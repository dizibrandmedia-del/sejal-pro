import { Router, Request, Response } from 'express';
import { shippingRulesEngine } from '../services/shippingRulesEngine';
import { shippingEngine } from '../services/shippingEngine';
import { store } from '../db/store';

export const shippingRouter = Router();

/**
 * POST /api/shipping/rates
 * Calculate dynamic shipping rate options and delivery estimates
 */
shippingRouter.post('/rates', (req: Request, res: Response) => {
  try {
    const { country, postalCode, orderTotalINR, weightGrams } = req.body;
    if (!country || orderTotalINR === undefined) {
      return res.status(400).json({ success: false, error: 'Missing country or orderTotalINR.' });
    }

    const rates = shippingRulesEngine.calculateRates({
      country,
      postalCode: postalCode || '',
      orderTotalINR,
      weightGrams,
    });

    return res.status(200).json({ success: true, data: rates });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/shipping/shipments
 * Create authoritative shipment and generate AWB
 */
shippingRouter.post('/shipments', async (req: Request, res: Response) => {
  try {
    const { orderId, serviceType, carrier, pickupDate } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Missing orderId.' });
    }

    const shipment = await shippingEngine.createShipment({
      orderId,
      serviceType: serviceType || 'standard_white_glove',
      carrier,
      pickupDate,
    });

    return res.status(201).json({ success: true, data: shipment });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/shipping/rules
 * Get all configured international shipping rules
 */
shippingRouter.get('/rules', (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: store.shippingRules });
});
