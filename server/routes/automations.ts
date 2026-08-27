import { Router, Request, Response } from 'express';
import { automationEngine } from '../services/automationEngine';
import { abandonedCartEngine } from '../services/abandonedCartEngine';
import { store } from '../db/store';

const router = Router();

// List Workflows
router.get('/workflows', (req: Request, res: Response) => {
  try {
    const workflows = automationEngine.listWorkflows();
    res.json({ success: true, count: workflows.length, workflows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create Workflow
router.post('/workflows', (req: Request, res: Response) => {
  try {
    const workflow = automationEngine.createWorkflow(req.body);
    res.status(201).json({ success: true, workflow });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger Abandoned Cart Signal
router.post('/abandoned-cart', async (req: Request, res: Response) => {
  try {
    const result = await abandonedCartEngine.handleAbandonedCart(req.body);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// List Executions
router.get('/executions', (req: Request, res: Response) => {
  try {
    const executions = Array.from(store.workflowExecutions.values());
    res.json({ success: true, count: executions.length, executions });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
