import { Router, Request, Response } from 'express';
import { store } from '../db/store';
import { webhookEngine } from '../services/webhookEngine';
import { inventoryEngine } from '../services/inventoryEngine';
import { shippingEngine } from '../services/shippingEngine';
import { orderEngine } from '../services/orderEngine';
import { auditLogEngine } from '../services/auditLogEngine';

export const simulatorRouter = Router();

/**
 * POST /api/simulator/razorpay-webhook
 * Simulate a Razorpay webhook event
 */
simulatorRouter.post('/razorpay-webhook', async (req: Request, res: Response) => {
  try {
    const { event, orderId, paymentId, amountINR, eventId } = req.body;
    const order = store.orders.get(orderId);

    const payload = {
      id: eventId || `evt_sim_${Date.now()}`,
      event: event || 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentId || `pay_sim_${Date.now()}`,
            order_id: order?.razorpayOrderId || `order_sim_${Date.now()}`,
            amount: (amountINR || order?.totalINR || 285000) * 100,
            status: event === 'payment.failed' ? 'failed' : 'captured',
            method: 'upi',
            vpa: 'vip.client@okhdfcbank',
          },
        },
      },
    };

    const rawBody = JSON.stringify(payload);
    const signature = 'sig_webhook_mock_verified';

    const result = await webhookEngine.handleRazorpayWebhook(rawBody, signature, payload.id, payload);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/simulator/concurrency-test
 * Tests simultaneous reservation to verify that overselling is prevented
 */
simulatorRouter.post('/concurrency-test', async (req: Request, res: Response) => {
  try {
    const { sku } = req.body;
    const testSku = sku || 'SEJ-JW-MOR-01';

    // Set stock to exactly 1 unit
    const inv = store.inventory.get(testSku);
    if (!inv) {
      return res.status(404).json({ success: false, error: `SKU ${testSku} not found.` });
    }

    inv.totalQuantity = 1;
    inv.availableQuantity = 1;
    inv.reservedQuantity = 0;
    store.inventory.set(testSku, inv);

    // Launch 2 simultaneous reservation requests concurrently via Promise.all
    const req1 = inventoryEngine.reserveStock(
      [{ sku: testSku, variantId: inv.variantId, quantity: 1 }],
      `ord_sim_concurrent_1_${Date.now()}`,
      'SEJAL-SIM-001'
    );

    const req2 = inventoryEngine.reserveStock(
      [{ sku: testSku, variantId: inv.variantId, quantity: 1 }],
      `ord_sim_concurrent_2_${Date.now()}`,
      'SEJAL-SIM-002'
    );

    const [res1, res2] = await Promise.all([req1, req2]);

    const successes = [res1, res2].filter((r) => r.success).length;
    const failures = [res1, res2].filter((r) => !r.success).length;

    return res.status(200).json({
      success: true,
      testName: 'Overselling Protection Concurrency Test',
      initialStock: 1,
      results: {
        request1: res1,
        request2: res2,
      },
      evaluation: {
        successCount: successes,
        failureCount: failures,
        isOversellingPrevented: successes === 1 && failures === 1,
        remainingAvailableStock: store.inventory.get(testSku)?.availableQuantity,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/simulator/advance-shipment
 * Advance shipment status through carrier milestones
 */
simulatorRouter.post('/advance-shipment', async (req: Request, res: Response) => {
  try {
    const { orderId, targetStatus, hubLocation, carrierMessage } = req.body;
    const shipment = shippingEngine.getShipmentByOrderId(orderId);
    if (!shipment) {
      return res.status(404).json({ success: false, error: `No shipment found for order ${orderId}.` });
    }

    const updated = await shippingEngine.addShipmentEvent({
      shipmentId: shipment.id,
      rawStatus: targetStatus || 'IN_TRANSIT',
      hubLocation: hubLocation || 'Mumbai Air Logistics Gateway',
      carrierMessage: carrierMessage || `Consignment progressed to ${targetStatus}`,
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/simulator/audit-events
 * Get all audit log entries and commerce events
 */
simulatorRouter.get('/audit-events', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    auditLogs: store.auditLogs,
    commerceEvents: store.commerceEvents,
    notifications: store.notifications,
  });
});
