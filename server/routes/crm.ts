import { Router, Request, Response } from 'express';
import { crmEngine } from '../services/crmEngine';
import { segmentationEngine } from '../services/segmentationEngine';

const router = Router();

// List customer 360 profiles
router.get('/customers', (req: Request, res: Response) => {
  try {
    const { country, priveTier, search } = req.query;
    const profiles = crmEngine.listCustomerProfiles({
      country: country as string,
      priveTier: priveTier as string,
      search: search as string,
    });
    res.json({ success: true, count: profiles.length, profiles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single Customer 360 profile
router.get('/customers/:id/360', (req: Request, res: Response) => {
  try {
    const profile = crmEngine.getCustomer360(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Customer profile not found.' });
    }
    res.json({ success: true, profile });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Customer Timeline
router.get('/customers/:id/timeline', (req: Request, res: Response) => {
  try {
    const timeline = crmEngine.getCustomerTimeline(req.params.id);
    res.json({ success: true, count: timeline.length, timeline });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Safe Identity Resolution Merge
router.post('/identity-merge', (req: Request, res: Response) => {
  try {
    const { guestSessionId, email, phone, name } = req.body;
    if (!guestSessionId || !email) {
      return res.status(400).json({ success: false, error: 'guestSessionId and email are required.' });
    }
    const result = crmEngine.resolveCustomerIdentity(guestSessionId, email, phone, name);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Customer Consent
router.post('/customers/:id/consent', (req: Request, res: Response) => {
  try {
    const updated = crmEngine.updateConsent(req.params.id, req.body.consent, req.body.actor);
    res.json({ success: true, customer: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Segments: List
router.get('/segments', (req: Request, res: Response) => {
  try {
    const segments = segmentationEngine.listSegments();
    res.json({ success: true, count: segments.length, segments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Segments: Create
router.post('/segments', (req: Request, res: Response) => {
  try {
    const segment = segmentationEngine.createSegment(req.body);
    res.status(201).json({ success: true, segment });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Segments: Evaluate
router.post('/segments/:id/evaluate', (req: Request, res: Response) => {
  try {
    const result = segmentationEngine.evaluateSegment(req.params.id);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
