/**
 * SEJAL.PRO — Phase 2 Shipping Domain Models
 * Multi-Carrier Abstraction, Normalized Tracking Timeline, and Country Rules.
 */

export type NormalizedShipmentStatus =
  | 'Pickup Scheduled'
  | 'Picked Up'
  | 'In Transit'
  | 'At Hub'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delivery Attempted'
  | 'Delayed'
  | 'RTO Initiated'
  | 'RTO Delivered'
  | 'Lost'
  | 'Damaged';

export type CarrierProviderId =
  | 'shiprocket'
  | 'delhivery'
  | 'dhl'
  | 'fedex'
  | 'bluedart'
  | 'sejal_armoured';

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  orderId: string;
  rawStatus: string;                  // Carrier original status string
  normalizedStatus: NormalizedShipmentStatus;
  hubLocation?: string;               // Physical hub/facility name e.g. "Bandra Logistics Center, Mumbai"
  city?: string;
  country?: string;
  timestamp: string;
  carrierMessage?: string;
  isLatest: boolean;
}

export interface Shipment {
  id: string;                         // shp_xxx
  orderId: string;                    // Linked SEJAL order ID
  orderNumber: string;
  provider: CarrierProviderId;
  providerName: string;               // e.g. "SEJAL Armoured White-Glove" | "DHL Express Global"
  providerShipmentId: string;
  awbNumber: string;                  // Master Air Waybill tracking code
  labelUrl?: string;                  // PDF/Thermal printable label URL
  invoiceUrl?: string;
  serviceType: 'standard_white_glove' | 'priority_air_express' | 'same_day_salon_courier';
  pickupScheduledDate: string;
  pickedUpDate?: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  currentStatus: NormalizedShipmentStatus;
  trackingUrl: string;
  events: ShipmentEvent[];
  lastKnownLocation?: string;
  weightGrams: number;
  dimensionsCm?: {
    length: number;
    width: number;
    height: number;
  };
  recipientSignatureName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingRule {
  id: string;
  country: string;                    // India, UAE, USA, Australia
  countryCode: string;                // IN, AE, US, AU
  zone: string;                       // Metro, Domestic, GCC, North America, APAC
  minOrderValueINR: number;
  freeShippingThresholdINR: number;
  standardRateINR: number;
  expressRateINR: number;
  carrier: CarrierProviderId;
  estimatedDeliveryDaysMin: number;
  estimatedDeliveryDaysMax: number;
  isRestrictedProductPresent?: boolean;
  taxRatePercentage: number;
  dutiesIncluded: boolean;
}

export interface ShippingRateCalculationRequest {
  country: string;
  postalCode: string;
  orderTotalINR: number;
  weightGrams?: number;
}

export interface ShippingRateOption {
  serviceId: string;
  carrier: CarrierProviderId;
  serviceName: string;
  priceINR: number;
  priceInSelectedCurrency: number;
  currency: string;
  isFree: boolean;
  estimatedDeliveryText: string;
  estimatedDeliveryDate: string;
}

export interface CreateShipmentPayload {
  orderId: string;
  serviceType: string;
  carrier?: CarrierProviderId;
  pickupDate?: string;
}

export interface IShippingProvider {
  id: CarrierProviderId;
  name: string;
  getRates(request: ShippingRateCalculationRequest): Promise<ShippingRateOption[]>;
  createShipment(payload: CreateShipmentPayload, order: any): Promise<Shipment>;
  cancelShipment(providerShipmentId: string): Promise<boolean>;
  generateLabel(providerShipmentId: string): Promise<string>;
  schedulePickup(providerShipmentId: string, pickupDate: string): Promise<boolean>;
  trackShipment(awbNumber: string): Promise<ShipmentEvent[]>;
  normalizeStatus(rawStatus: string): NormalizedShipmentStatus;
}
