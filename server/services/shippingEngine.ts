import { store } from '../db/store';
import {
  Shipment,
  ShipmentEvent,
  NormalizedShipmentStatus,
  CarrierProviderId,
  CreateShipmentPayload,
} from '../../src/types/shipping';
import { auditLogEngine } from './auditLogEngine';
import { orderEngine } from './orderEngine';
import { notificationEngine } from './notificationEngine';

export class ShippingEngine {
  /**
   * CREATE AUTHORITATIVE SHIPMENT & GENERATE AWB
   */
  public async createShipment(payload: CreateShipmentPayload): Promise<Shipment> {
    const order = store.orders.get(payload.orderId);
    if (!order) {
      throw new Error(`Order ${payload.orderId} does not exist.`);
    }

    if (order.orderStatus !== 'Packed' && order.orderStatus !== 'Ready to Ship' && order.orderStatus !== 'Confirmed') {
      // In production, shipment is created once order is packed or ready to ship
    }

    const carrier: CarrierProviderId = payload.carrier || (order.shippingAddress.country === 'India' ? 'sejal_armoured' : 'dhl');
    const shipmentId = `shp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const awbNumber = `AWB-SEJAL-${Math.floor(100000 + Math.random() * 900000)}`;
    const providerShipmentId = `prov_${carrier}_${Date.now()}`;

    const carrierNameMap: Record<CarrierProviderId, string> = {
      sejal_armoured: 'SEJAL Armoured Courier Logistics',
      shiprocket: 'Shiprocket Luxury Express',
      delhivery: 'Delhivery Surface Direct',
      dhl: 'DHL Express Worldwide',
      fedex: 'FedEx Priority Air',
      bluedart: 'Blue Dart Apex Secure',
    };

    const initialEvent: ShipmentEvent = {
      id: `evt_shp_${Date.now()}_1`,
      shipmentId,
      orderId: order.id,
      rawStatus: 'MANIFESTED',
      normalizedStatus: 'Pickup Scheduled',
      hubLocation: `SEJAL Flagship Vault (${order.shippingAddress.city || 'Mumbai'})`,
      city: order.shippingAddress.city,
      country: order.shippingAddress.country,
      timestamp: new Date().toISOString(),
      carrierMessage: 'Armoured consignment manifested. Awaiting courier collection.',
      isLatest: true,
    };

    const shipment: Shipment = {
      id: shipmentId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      provider: carrier,
      providerName: carrierNameMap[carrier] || 'SEJAL Armoured Logistics',
      providerShipmentId,
      awbNumber,
      labelUrl: `https://api.sejal.pro/v1/shipments/${shipmentId}/label.pdf`,
      invoiceUrl: `https://api.sejal.pro/v1/orders/${order.id}/invoice.pdf`,
      serviceType: (payload.serviceType as any) || 'standard_white_glove',
      pickupScheduledDate: payload.pickupDate || new Date().toISOString(),
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      currentStatus: 'Pickup Scheduled',
      trackingUrl: `https://sejal.pro/track/${order.id}`,
      events: [initialEvent],
      weightGrams: 850,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.shipments.set(shipment.id, shipment);

    // Link Shipment to Order
    order.shipmentId = shipment.id;
    order.trackingNumber = awbNumber;
    order.trackingCourier = shipment.providerName;
    order.trackingUrl = shipment.trackingUrl;
    order.updatedAt = new Date().toISOString();
    store.orders.set(order.id, order);

    // Transition order to Ready to Ship -> Pickup Scheduled
    try {
      if (order.orderStatus === 'Packed') {
        await orderEngine.transitionOrderStatus(order.id, 'Ready to Ship', 'system');
      }
      await orderEngine.transitionOrderStatus(
        order.id,
        'Pickup Scheduled',
        'system',
        `AWB generated: ${awbNumber} via ${shipment.providerName}`
      );
    } catch {
      // ignore transition failure if already progressed
    }

    auditLogEngine.logAudit({
      entityType: 'Shipment',
      entityId: shipment.id,
      referenceCode: order.orderNumber,
      action: 'SHIPMENT_CREATED',
      newState: 'Pickup Scheduled',
      actor: 'system',
      reason: `Assigned carrier ${shipment.providerName} with AWB ${awbNumber}`,
    });

    auditLogEngine.emitCommerceEvent(
      'shipment.created',
      'shipment',
      shipment.id,
      { awbNumber, carrier: shipment.providerName, orderNumber: order.orderNumber },
      'system',
      order.orderNumber
    );

    return shipment;
  }

  /**
   * NORMALIZE CARRIER STATUS
   * Maps third-party carrier status codes to SEJAL standard event statuses.
   */
  public normalizeCarrierStatus(rawStatus: string): NormalizedShipmentStatus {
    const s = rawStatus.toUpperCase();

    if (s.includes('MANIFEST') || s.includes('BOOKED') || s.includes('READY_FOR_PICKUP')) {
      return 'Pickup Scheduled';
    }
    if (s.includes('PICKED_UP') || s.includes('COLLECTED') || s.includes('IN_ORIGIN_HUB')) {
      return 'Picked Up';
    }
    if (s.includes('OUT_FOR_DELIVERY') || s.includes('WITH_COURIER')) {
      return 'Out for Delivery';
    }
    if (s.includes('DELIVERED') || s.includes('SIGNED') || s.includes('COMPLETED')) {
      return 'Delivered';
    }
    if (s.includes('UNDELIVERED') || s.includes('ATTEMPTED') || s.includes('REATTEMPT')) {
      return 'Delivery Attempted';
    }
    if (s.includes('DELAY') || s.includes('EXCEPTION') || s.includes('WEATHER')) {
      return 'Delayed';
    }
    if (s.includes('RTO_INITIATED') || s.includes('RETURN_TO_ORIGIN')) {
      return 'RTO Initiated';
    }
    if (s.includes('RTO_DELIVERED') || s.includes('RETURNED_TO_SELLER')) {
      return 'RTO Delivered';
    }
    if (s.includes('LOST')) {
      return 'Lost';
    }
    if (s.includes('DAMAGED')) {
      return 'Damaged';
    }
    if (s.includes('HUB') || s.includes('FACILITY') || s.includes('SORTING')) {
      return 'At Hub';
    }

    return 'In Transit';
  }

  /**
   * ADVANCE SHIPMENT EVENT / CARRIER WEBHOOK SYNCHRONIZATION
   */
  public async addShipmentEvent(params: {
    shipmentId: string;
    rawStatus: string;
    hubLocation?: string;
    city?: string;
    country?: string;
    carrierMessage?: string;
    timestamp?: string;
  }): Promise<Shipment> {
    const shipment = store.shipments.get(params.shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${params.shipmentId} not found.`);
    }

    const order = store.orders.get(shipment.orderId);
    const normalizedStatus = this.normalizeCarrierStatus(params.rawStatus);

    // Mark previous events as not latest
    shipment.events.forEach((e) => (e.isLatest = false));

    const newEvent: ShipmentEvent = {
      id: `evt_shp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      shipmentId: shipment.id,
      orderId: shipment.orderId,
      rawStatus: params.rawStatus,
      normalizedStatus,
      hubLocation: params.hubLocation || shipment.lastKnownLocation,
      city: params.city,
      country: params.country,
      timestamp: params.timestamp || new Date().toISOString(),
      carrierMessage: params.carrierMessage,
      isLatest: true,
    };

    shipment.events.unshift(newEvent);
    shipment.currentStatus = normalizedStatus;
    if (params.hubLocation) {
      shipment.lastKnownLocation = params.hubLocation;
    }
    shipment.updatedAt = new Date().toISOString();

    store.shipments.set(shipment.id, shipment);

    // Synchronize Order status
    if (order) {
      order.lastKnownLocation = shipment.lastKnownLocation;
      
      const orderStatusMap: Partial<Record<NormalizedShipmentStatus, any>> = {
        'Picked Up': 'Picked Up',
        'In Transit': 'In Transit',
        'At Hub': 'In Transit',
        'Out for Delivery': 'Out for Delivery',
        'Delivered': 'Delivered',
        'RTO Initiated': 'RTO',
        'RTO Delivered': 'RTO',
      };

      const mappedOrderStatus = orderStatusMap[normalizedStatus];
      if (mappedOrderStatus && order.orderStatus !== mappedOrderStatus) {
        try {
          await orderEngine.transitionOrderStatus(
            order.id,
            mappedOrderStatus,
            'carrier_webhook',
            params.carrierMessage || `Courier status update: ${normalizedStatus}`
          );
        } catch (e) {
          console.warn(`[Shipping Engine] Order state transition warning: ${(e as any).message}`);
        }
      }
    }

    return shipment;
  }

  /**
   * Get shipment by order ID or shipment ID
   */
  public getShipmentByOrderId(orderId: string): Shipment | undefined {
    for (const shipment of store.shipments.values()) {
      if (shipment.orderId === orderId) {
        return shipment;
      }
    }
    return undefined;
  }
}

export const shippingEngine = new ShippingEngine();
