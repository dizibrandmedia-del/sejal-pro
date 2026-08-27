import { Router, Request, Response } from 'express';
import { marketingEngine } from '../services/marketingEngine';

export const marketingRouter = Router();

// ==========================================
// 1. COUPON ENGINE
// ==========================================

marketingRouter.get('/coupons', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: marketingEngine.listCoupons() });
});

marketingRouter.post('/coupons', (req: Request, res: Response) => {
  try {
    const { coupon, actor } = req.body;
    if (!coupon || !coupon.code || !coupon.discountValue) {
      return res.status(400).json({ success: false, error: 'Coupon code and discount value are required.' });
    }

    const created = marketingEngine.createCoupon(coupon, actor);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

marketingRouter.patch('/coupons/:code', (req: Request, res: Response) => {
  try {
    const updated = marketingEngine.updateCoupon(req.params.code, req.body.updates, req.body.actor);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

marketingRouter.delete('/coupons/:code', (req: Request, res: Response) => {
  try {
    marketingEngine.deleteCoupon(req.params.code, req.body.actor);
    return res.status(200).json({ success: true, message: 'Coupon deleted.' });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/marketing/coupons/validate
 * Authoritative checkout coupon validation & discount calculation
 */
marketingRouter.post('/coupons/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotalINR, items, country, customerEmail } = req.body;
    if (!code || subtotalINR === undefined) {
      return res.status(400).json({ success: false, error: 'Code and subtotalINR are required.' });
    }

    const result = marketingEngine.validateCouponForCart({
      code,
      subtotalINR: Number(subtotalINR),
      items,
      country,
      customerEmail,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. CAMPAIGNS
// ==========================================

marketingRouter.get('/campaigns', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: marketingEngine.listCampaigns() });
});

marketingRouter.post('/campaigns', (req: Request, res: Response) => {
  try {
    const created = marketingEngine.createCampaign(req.body.campaign, req.body.actor);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
