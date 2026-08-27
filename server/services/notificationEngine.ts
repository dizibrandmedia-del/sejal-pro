import { store } from '../db/store';
import { NotificationPayload, CommerceEventType } from '../../src/types/events';
import { Order } from '../../src/types/order';

export class NotificationEngine {
  /**
   * Send or log a luxury customer notification with duplicate suppression
   */
  public async sendNotification(
    recipient: { email: string; phone?: string; name: string },
    event: CommerceEventType,
    title: string,
    body: string,
    data: Record<string, unknown>,
    channels: Array<'email' | 'whatsapp' | 'sms'> = ['email', 'whatsapp']
  ): Promise<NotificationPayload> {
    const deduplicationKey = `${recipient.email}_${event}_${data.orderNumber || data.orderId || Date.now()}`;

    // Duplicate Prevention Check
    const existing = store.notifications.find(
      (n) => n.deduplicationKey === deduplicationKey && n.status === 'sent'
    );

    if (existing) {
      console.log(`[Notification Engine] Suppressed duplicate notification for key: ${deduplicationKey}`);
      return {
        ...existing,
        status: 'suppressed_duplicate',
      };
    }

    const payload: NotificationPayload = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      recipientEmail: recipient.email,
      recipientPhone: recipient.phone,
      recipientName: recipient.name,
      channels,
      event,
      title,
      body,
      data,
      sentAt: new Date().toISOString(),
      status: 'sent',
      deduplicationKey,
    };

    store.notifications.unshift(payload);
    return payload;
  }

  /**
   * Helper to dispatch PRD-mandated luxury formatted order notifications
   */
  public async notifyOrderEvent(order: Order, event: CommerceEventType, extraDetails?: string) {
    const recipient = {
      email: order.customerEmail,
      phone: order.customerPhone,
      name: order.customerName,
    };

    let title = '';
    let body = '';

    switch (event) {
      case 'order.confirmed':
      case 'payment.captured':
        title = 'YOUR SEJAL ORDER IS CONFIRMED.';
        body = `Dear ${order.customerName},\n\nYour selection bearing reference ${order.orderNumber} has been securely authenticated in the Maison SEJAL vault. Our master artisans have begun preparation. Estimated arrival: ${order.estimatedDeliveryDate}.`;
        break;

      case 'order.packed':
        title = 'YOUR SEJAL CREATION HAS BEEN ENCLOSED.';
        body = `Dear ${order.customerName},\n\nYour masterwork has been placed into our signature rigid rose gold coffret with double-faced satin ribbons and personal calligraphy note.`;
        break;

      case 'shipment.created':
      case 'order.shipped':
        title = 'YOUR SEJAL SELECTION IS ON ITS WAY.';
        body = `Dear ${order.customerName},\n\nYour order (${order.orderNumber}) has been dispatched via ${order.trackingCourier || 'SEJAL Armoured Courier'}. Tracking Code: ${order.trackingNumber || 'AWB-PENDING'}. Track online at: https://sejal.pro/track/${order.id}`;
        break;

      case 'order.out_for_delivery':
        title = 'WHITE-GLOVE ARRIVAL TODAY.';
        body = `Dear ${order.customerName},\n\nOur personal courier is out for hand-delivery of your SEJAL selection today. Direct handover with recipient signature required.`;
        break;

      case 'order.delivered':
        title = 'YOUR SEJAL EXPERIENCE HAS ARRIVED.';
        body = `Dear ${order.customerName},\n\nYour selection (${order.orderNumber}) has been safely delivered into your care. May its sovereign beauty bring you enduring joy.`;
        break;

      case 'order.cancelled':
        title = 'SEJAL ORDER RESERVATION CANCELLED.';
        body = `Dear ${order.customerName},\n\nAs requested, order ${order.orderNumber} has been cancelled. Any pre-authorized funds have been released to your original payment method.`;
        break;

      case 'refund.completed':
        title = 'PRIVÉ REFUND CREDITED.';
        body = `Dear ${order.customerName},\n\nYour refund for order ${order.orderNumber} has been processed successfully. Funds will reflect on your card/bank within standard bank processing timelines.`;
        break;

      default:
        title = `UPDATE ON YOUR SEJAL SELECTION (${order.orderNumber})`;
        body = extraDetails || `Order status updated to: ${order.orderStatus}.`;
    }

    return this.sendNotification(recipient, event, title, body, {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
    });
  }
}

export const notificationEngine = new NotificationEngine();
