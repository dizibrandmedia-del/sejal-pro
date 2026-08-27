import { Router, Request, Response } from 'express';
import { personalisationEngine } from '../services/personalisationEngine';

const router = Router();

// Recommendations Endpoint (Curated, Complete the look, Recently viewed)
router.post('/recommendations', (req: Request, res: Response) => {
  try {
    const { context = {}, targetProductId } = req.body;
    const recommendations = personalisationEngine.getRecommendations(context, targetProductId);
    res.json({ success: true, recommendations });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Gift Finder Query Endpoint
router.post('/gift-finder', (req: Request, res: Response) => {
  try {
    const result = personalisationEngine.findLuxuryGift(req.body);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Style Quiz Endpoint
router.get('/style-quiz', (_req: Request, res: Response) => {
  try {
    const questions = personalisationEngine.getStyleQuiz();
    res.json({ success: true, questions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
