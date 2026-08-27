import { Router, Request, Response } from 'express';
import { paymentEngine } from '../services/paymentEngine';

export const paymentsRouter = Router();

/**
 * POST /api/payments/razorpay/create-order
 * Create server-side Razorpay order using authoritative order total
 */
paymentsRouter.post('/razorpay/create-order', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Missing required field: orderId' });
    }

    const razorpayOrder = await paymentEngine.createRazorpayOrder(orderId);
    return res.status(200).json({ success: true, data: razorpayOrder });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/payments/razorpay/verify
 * Cryptographically verify Razorpay signature and capture payment
 */
paymentsRouter.post('/razorpay/verify', async (req: Request, res: Response) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, method, metadata } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required verification fields (orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature).',
      });
    }

    const payment = await paymentEngine.confirmPaymentCapture({
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      method,
      metadata,
    });

    return res.status(200).json({
      success: true,
      verified: true,
      data: {
        paymentId: payment.id,
        orderId: payment.orderId,
        orderNumber: payment.orderNumber,
        status: payment.status,
        capturedAmountINR: payment.amountINR,
      },
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, verified: false, error: err.message });
  }
});

/**
 * GET /api/payments/reconciliation
 * Return payment reconciliation overview
 */
paymentsRouter.get('/reconciliation', (req: Request, res: Response) => {
  try {
    const reports = paymentEngine.getReconciliationReport();
    return res.status(200).json({ success: true, data: reports });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
