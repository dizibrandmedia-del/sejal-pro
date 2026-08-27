import { Router, Request, Response } from 'express';
import { orderEngine } from '../services/orderEngine';
import { cancellationEngine } from '../services/cancellationEngine';
import { shippingEngine } from '../services/shippingEngine';

export const ordersRouter = Router();

/**
 * POST /api/orders
 * Create authoritative server-side order with inventory reservation
 */
ordersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { customer, items, shippingAddress, shippingMethod, giftPackaging, couponCode, currency, currencyRate, paymentMethod } = req.body;

    if (!customer?.email || !items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ success: false, error: 'Missing required order payload fields.' });
    }

    const result = await orderEngine.createOrder({
      customer,
      items,
      shippingAddress,
      shippingMethod,
      giftPackaging,
      couponCode,
      currency: currency || 'INR',
      currencyRate: currencyRate || 1,
      paymentMethod,
    });

    return res.status(201).json({ success: true, data: result.order, reservationId: result.reservationId });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/orders
 * List orders (optional ?customerEmail=...)
 */
ordersRouter.get('/', (req: Request, res: Response) => {
  try {
    const customerEmail = req.query.customerEmail as string | undefined;
    const orders = orderEngine.listOrders(customerEmail);
    return res.status(200).json({ success: true, data: orders, count: orders.length });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/orders/:id
 * Get single order by ID or orderNumber
 */
ordersRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const order = orderEngine.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/orders/:id/status
 * Transition order status through state machine
 */
ordersRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { newStatus, actor, note } = req.body;
    if (!newStatus) {
      return res.status(400).json({ success: false, error: 'Missing newStatus.' });
    }

    const updated = await orderEngine.transitionOrderStatus(
      req.params.id,
      newStatus,
      actor || 'admin_user',
      note
    );

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/orders/:id/cancel
 * Cancel order with inventory release and automated refund
 */
ordersRouter.post('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { reason, cancelledBy } = req.body;

    const cancelledOrder = await cancellationEngine.cancelOrder({
      orderId: req.params.id,
      cancelledBy: cancelledBy || 'customer',
      reason: reason || 'Customer cancellation request',
    });

    return res.status(200).json({ success: true, data: cancelledOrder });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/orders/:id/track
 * Customer tracking timeline with normalized events and hub location
 */
ordersRouter.get('/:id/track', (req: Request, res: Response) => {
  try {
    const order = orderEngine.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    const shipment = shippingEngine.getShipmentByOrderId(order.id);

    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        orderStatus: order.orderStatus,
        carrier: order.trackingCourier || shipment?.providerName || 'SEJAL Armoured Logistics',
        awbNumber: order.trackingNumber || shipment?.awbNumber || 'PENDING-MANIFEST',
        trackingUrl: order.trackingUrl || shipment?.trackingUrl,
        lastKnownLocation: order.lastKnownLocation || shipment?.lastKnownLocation || 'SEJAL Flagship Vault',
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        actualDeliveryDate: order.actualDeliveryDate,
        recipientAddress: order.shippingAddress,
        items: order.items,
        events: shipment?.events || [
          {
            id: 'evt_init',
            shipmentId: 'shp_pending',
            orderId: order.id,
            rawStatus: 'ORDER_PLACED',
            normalizedStatus: 'Pickup Scheduled',
            hubLocation: 'SEJAL Flagship Vault',
            timestamp: order.createdAt,
            carrierMessage: 'Order confirmed and registered for armoured preparation.',
            isLatest: true,
          },
        ],
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
