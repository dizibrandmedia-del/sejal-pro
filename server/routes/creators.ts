import { Router, Request, Response } from 'express';
import { attributionEngine } from '../services/attributionEngine';

const router = Router();

// Influencers: List
router.get('/influencers', (req: Request, res: Response) => {
  try {
    const influencers = attributionEngine.listInfluencers();
    res.json({ success: true, count: influencers.length, influencers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Influencers: Save
router.post('/influencers', (req: Request, res: Response) => {
  try {
    const influencer = attributionEngine.saveInfluencer(req.body);
    res.status(201).json({ success: true, influencer });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Affiliates: List
router.get('/affiliates', (req: Request, res: Response) => {
  try {
    const affiliates = attributionEngine.listAffiliates();
    res.json({ success: true, count: affiliates.length, affiliates });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Affiliates: Save
router.post('/affiliates', (req: Request, res: Response) => {
  try {
    const affiliate = attributionEngine.saveAffiliate(req.body);
    res.status(201).json({ success: true, affiliate });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
