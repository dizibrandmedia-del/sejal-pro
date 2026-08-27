import { Router, Request, Response } from 'express';
import { returnsEngine } from '../services/returnsEngine';

export const returnsRouter = Router();

/**
 * POST /api/returns
 * Submit item-level return request
 */
returnsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { orderId, items } = req.body;
    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing orderId or items list.' });
    }

    const returnRequest = await returnsEngine.submitReturnRequest({ orderId, items });
    return res.status(201).json({ success: true, data: returnRequest });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/returns
 * List returns (optional ?customerEmail=...)
 */
returnsRouter.get('/', (req: Request, res: Response) => {
  try {
    const customerEmail = req.query.customerEmail as string | undefined;
    const list = returnsEngine.listReturns(customerEmail);
    return res.status(200).json({ success: true, data: list, count: list.length });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/returns/:id
 * Get single return by ID
 */
returnsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const returnReq = returnsEngine.getReturn(req.params.id);
    if (!returnReq) {
      return res.status(404).json({ success: false, error: 'Return request not found.' });
    }
    return res.status(200).json({ success: true, data: returnReq });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/returns/:id/quality-check
 * Execute quality check and assign stock disposition
 */
returnsRouter.post('/:id/quality-check', async (req: Request, res: Response) => {
  try {
    const { inspectorName, receivedCondition, securityTagIntact, certificatePresent, disposition, isApproved, approvedRefundAmountINR, notes } = req.body;

    if (!inspectorName || !disposition || approvedRefundAmountINR === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required quality inspection fields.' });
    }

    const updated = await returnsEngine.executeQualityCheck({
      returnId: req.params.id,
      inspectorName,
      receivedCondition: receivedCondition || 'Pristine in Vault Box',
      securityTagIntact: securityTagIntact ?? true,
      certificatePresent: certificatePresent ?? true,
      disposition,
      isApproved: isApproved ?? true,
      approvedRefundAmountINR: Number(approvedRefundAmountINR),
      notes: notes || 'Standard quality check completed.',
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
