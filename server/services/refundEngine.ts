import { store } from '../db/store';
import { Refund, RefundStatus } from '../../src/types/payment';
import { auditLogEngine } from './auditLogEngine';
import { notificationEngine } from './notificationEngine';

export class RefundEngine {
  /**
   * INITIATE A FULL OR PARTIAL REFUND
   */
  public async initiateRefund(params: {
    orderId: string;
    amountINR: number;
    reason: string;
    requestedBy: string;
    returnId?: string;
  }): Promise<Refund> {
    const order = store.orders.get(params.orderId);
    if (!order) {
      throw new Error(`Order ${params.orderId} does not exist.`);
    }

    const payment = Array.from(store.payments.values()).find((p) => p.orderId === params.orderId);
    if (!payment) {
      throw new Error(`No payment record found for order ${order.orderNumber}.`);
    }

    if (payment.status !== 'Captured' && payment.status !== 'Partially Refunded') {
      throw new Error(`Cannot refund order with payment status: ${payment.status}.`);
    }

    // Validate that refund amount does not exceed captured amount
    const remainingEligibleINR = payment.amountINR - payment.refundedAmountINR;
    if (params.amountINR <= 0 || params.amountINR > remainingEligibleINR) {
      throw new Error(
        `Invalid refund amount: ₹${params.amountINR}. Maximum eligible amount is ₹${remainingEligibleINR}.`
      );
    }

    const refundId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const razorpayRefundId = `rfnd_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const refund: Refund = {
      id: refundId,
      orderId: order.id,
      paymentId: payment.id,
      razorpayRefundId,
      returnId: params.returnId,
      amountINR: params.amountINR,
      currency: order.currencyUsed,
      amountInCurrency: Math.round(params.amountINR * order.exchangeRateUsed),
      reason: params.reason,
      status: 'Refund Completed', // Simulated instant gateway confirmation in test environment
      requestedBy: params.requestedBy,
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      auditNote: `Refund of ₹${params.amountINR} authorized. Gateway reference: ${razorpayRefundId}`,
    };

    store.refunds.set(refund.id, refund);

    // Update payment balances
    payment.refundedAmountINR += params.amountINR;
    payment.outstandingAmountINR = Math.max(0, payment.amountINR - payment.refundedAmountINR);
    payment.status = payment.refundedAmountINR >= payment.amountINR ? 'Refunded' : 'Partially Refunded';
    payment.updatedAt = new Date().toISOString();
    store.payments.set(payment.id, payment);

    // Update order
    order.refundIds.push(refund.id);
    if (payment.status === 'Refunded') {
      order.paymentStatus = 'Refunded';
      order.orderStatus = 'Refunded';
    }
    order.updatedAt = new Date().toISOString();
    store.orders.set(order.id, order);

    auditLogEngine.logAudit({
      entityType: 'Refund',
      entityId: refund.id,
      referenceCode: order.orderNumber,
      action: 'REFUND_COMPLETED',
      newState: payment.status,
      actor: params.requestedBy,
      reason: `Processed refund of ₹${params.amountINR} for reason: ${params.reason}`,
    });

    auditLogEngine.emitCommerceEvent(
      'refund.completed',
      'refund',
      refund.id,
      { orderNumber: order.orderNumber, amountINR: params.amountINR, razorpayRefundId },
      'system',
      order.orderNumber
    );

    // Notify customer
    await notificationEngine.notifyOrderEvent(order, 'refund.completed');

    return refund;
  }

  /**
   * Get all refunds for an order
   */
  public getOrderRefunds(orderId: string): Refund[] {
    return Array.from(store.refunds.values()).filter((r) => r.orderId === orderId);
  }
}

export const refundEngine = new RefundEngine();
