import { store } from '../db/store';
import { Order } from '../../src/types/order';
import { inventoryEngine } from './inventoryEngine';
import { refundEngine } from './refundEngine';
import { auditLogEngine } from './auditLogEngine';
import { notificationEngine } from './notificationEngine';

export class CancellationEngine {
  /**
   * CANCEL ORDER WITH CONFIGURABLE BUSINESS RULES
   */
  public async cancelOrder(params: {
    orderId: string;
    cancelledBy: 'customer' | 'admin_user' | 'system';
    reason: string;
  }): Promise<Order> {
    const order = store.orders.get(params.orderId);
    if (!order) {
      throw new Error(`Order ${params.orderId} not found.`);
    }

    const currentStatus = order.orderStatus;

    // Check cancellation eligibility
    const CANCELLABLE_STATUSES = ['Payment Pending', 'Confirmed', 'Processing', 'Quality Check', 'Packed'];
    if (!CANCELLABLE_STATUSES.includes(currentStatus)) {
      throw new Error(
        `Order ${order.orderNumber} cannot be cancelled in status "${currentStatus}". Handover to courier has commenced; please initiate a luxury return upon arrival.`
      );
    }

    // 1. Release Reserved Inventory Atomically
    await inventoryEngine.releaseStock(order.id, order.orderNumber, 'order_cancelled');

    // 2. Process Refund if payment was captured
    let refundInitiated = false;
    let refundId: string | undefined;

    const payment = Array.from(store.payments.values()).find((p) => p.orderId === order.id);
    if (payment && (payment.status === 'Captured' || payment.status === 'Partially Refunded')) {
      const remainingAmount = payment.amountINR - payment.refundedAmountINR;
      if (remainingAmount > 0) {
        const refund = await refundEngine.initiateRefund({
          orderId: order.id,
          amountINR: remainingAmount,
          reason: `Automated cancellation refund: ${params.reason}`,
          requestedBy: params.cancelledBy,
        });
        refundInitiated = true;
        refundId = refund.id;
      }
    }

    // 3. Update Order Record
    order.orderStatus = 'Cancelled';
    order.cancellation = {
      cancelledAt: new Date().toISOString(),
      cancelledBy: params.cancelledBy,
      reason: params.reason,
      refundInitiated,
      refundId,
      inventoryReleased: true,
    };
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date().toISOString(),
      actor: params.cancelledBy,
      note: params.reason,
    });
    order.updatedAt = new Date().toISOString();

    store.orders.set(order.id, order);

    auditLogEngine.logAudit({
      entityType: 'Order',
      entityId: order.id,
      referenceCode: order.orderNumber,
      action: 'ORDER_CANCELLED',
      previousState: currentStatus,
      newState: 'Cancelled',
      actor: params.cancelledBy,
      reason: params.reason,
    });

    auditLogEngine.emitCommerceEvent(
      'order.cancelled',
      'order',
      order.id,
      { orderNumber: order.orderNumber, reason: params.reason, refundInitiated },
      params.cancelledBy,
      order.orderNumber
    );

    // 4. Notify Customer
    await notificationEngine.notifyOrderEvent(order, 'order.cancelled', params.reason);

    return order;
  }
}

export const cancellationEngine = new CancellationEngine();
