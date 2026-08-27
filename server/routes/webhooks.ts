import { Router, Request, Response } from 'express';
import { webhookEngine } from '../services/webhookEngine';
import { shippingEngine } from '../services/shippingEngine';

export const webhooksRouter = Router();

/**
 * POST /api/webhooks/razorpay
 * Authenticated, Idempotent Webhook Endpoint for Razorpay
 */
webhooksRouter.post('/razorpay', async (req: Request, res: Response) => {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const eventId = (req.headers['x-razorpay-event-id'] as string) || '';
    
    // Retrieve raw body captured by middleware or stringify body
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    const result = await webhookEngine.handleRazorpayWebhook(rawBody, signature, eventId, req.body);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error(`[Razorpay Webhook Error] ${err.message}`);
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/webhooks/shipping
 * Carrier Webhook Endpoint (Shiprocket, Delhivery, DHL, FedEx)
 */
webhooksRouter.post('/shipping', async (req: Request, res: Response) => {
  try {
    const { shipmentId, rawStatus, hubLocation, city, country, carrierMessage, timestamp } = req.body;

    if (!shipmentId || !rawStatus) {
      return res.status(400).json({ success: false, error: 'Missing shipmentId or rawStatus.' });
    }

    const updatedShipment = await shippingEngine.addShipmentEvent({
      shipmentId,
      rawStatus,
      hubLocation,
      city,
      country,
      carrierMessage,
      timestamp,
    });

    return res.status(200).json({
      success: true,
      currentStatus: updatedShipment.currentStatus,
      lastKnownLocation: updatedShipment.lastKnownLocation,
      eventsCount: updatedShipment.events.length,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
