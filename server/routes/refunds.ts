import { Router, Request, Response } from 'express';
import { refundEngine } from '../services/refundEngine';
import { store } from '../db/store';

export const refundsRouter = Router();

/**
 * POST /api/refunds
 * Initiate a full or partial refund
 */
refundsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { orderId, amountINR, reason, requestedBy, returnId } = req.body;
    if (!orderId || !amountINR || !reason) {
      return res.status(400).json({ success: false, error: 'Missing orderId, amountINR, or reason.' });
    }

    const refund = await refundEngine.initiateRefund({
      orderId,
      amountINR: Number(amountINR),
      reason,
      requestedBy: requestedBy || 'admin_user',
      returnId,
    });

    return res.status(201).json({ success: true, data: refund });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/refunds
 * List all refunds
 */
refundsRouter.get('/', (req: Request, res: Response) => {
  const orderId = req.query.orderId as string | undefined;
  if (orderId) {
    const list = refundEngine.getOrderRefunds(orderId);
    return res.status(200).json({ success: true, data: list });
  }
  return res.status(200).json({ success: true, data: Array.from(store.refunds.values()) });
});
