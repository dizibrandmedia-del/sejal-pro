import { Router, Request, Response } from 'express';
import { attributionEngine } from '../services/attributionEngine';
import { store } from '../db/store';

const router = Router();

// Record UTM Touchpoint
router.post('/touchpoints', (req: Request, res: Response) => {
  try {
    const touchpoint = attributionEngine.recordTouchpoint(req.body);
    res.status(201).json({ success: true, touchpoint });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Attribution Summary Report
router.get('/report', (req: Request, res: Response) => {
  try {
    const report = attributionEngine.getAttributionReport();
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Commission Ledger
router.get('/commissions', (req: Request, res: Response) => {
  try {
    const ledger = Array.from(store.commissionLedger.values());
    res.json({ success: true, count: ledger.length, ledger });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
