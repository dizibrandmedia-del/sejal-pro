import { Router, Request, Response } from 'express';
import { omniNotificationEngine } from '../services/omniNotificationEngine';

const router = Router();

// List templates
router.get('/templates', (req: Request, res: Response) => {
  try {
    const templates = omniNotificationEngine.listTemplates();
    res.json({ success: true, count: templates.length, templates });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save/Update template
router.post('/templates', (req: Request, res: Response) => {
  try {
    const template = omniNotificationEngine.saveTemplate(req.body);
    res.status(201).json({ success: true, template });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Live Preview Variable Interpolation
router.post('/preview', (req: Request, res: Response) => {
  try {
    const { templateString, variables } = req.body;
    const interpolated = omniNotificationEngine.interpolateVariables(templateString, variables);
    res.json({ success: true, preview: interpolated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Send Test Notification
router.post('/send-test', async (req: Request, res: Response) => {
  try {
    const log = await omniNotificationEngine.sendNotification(req.body);
    res.json({ success: true, log });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// List Communication Logs
router.get('/logs', (req: Request, res: Response) => {
  try {
    const logs = omniNotificationEngine.listCommunicationLogs(Number(req.query.limit) || 50);
    res.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
