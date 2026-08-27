/**
 * SEJAL.PRO — Phase 2 Commerce Event Bus, Audit Log & Notification Types
 */

export type CommerceEventType =
  | 'payment.initiated'
  | 'payment.captured'
  | 'payment.failed'
  | 'payment.cancelled'
  | 'payment.refunded'
  | 'order.created'
  | 'order.confirmed'
  | 'order.processing'
  | 'order.quality_checked'
  | 'order.packed'
  | 'order.ready_to_ship'
  | 'order.pickup_scheduled'
  | 'order.picked_up'
  | 'order.shipped'
  | 'order.in_transit'
  | 'order.out_for_delivery'
  | 'order.delivered'
  | 'order.cancelled'
  | 'inventory.reserved'
  | 'inventory.released'
  | 'inventory.low_stock'
  | 'shipment.created'
  | 'shipment.updated'
  | 'shipment.rto_initiated'
  | 'shipment.rto_delivered'
  | 'return.requested'
  | 'return.approved'
  | 'return.rejected'
  | 'return.received'
  | 'return.quality_checked'
  | 'refund.initiated'
  | 'refund.completed'
  | 'refund.failed';

export interface CommerceEvent {
  id: string;                         // evt_xxx
  eventType: CommerceEventType;
  entityType: 'order' | 'payment' | 'inventory' | 'shipment' | 'return' | 'refund';
  entityId: string;
  orderNumber?: string;
  payload: Record<string, unknown>;
  actor: 'system' | 'customer' | 'admin_user' | 'razorpay_webhook' | 'carrier_webhook';
  timestamp: string;
  processed: boolean;
  correlationId?: string;
}

export interface AuditLogEntry {
  id: string;
  entityType: 'Order' | 'Payment' | 'Inventory' | 'Shipment' | 'Return' | 'Refund';
  entityId: string;
  referenceCode: string;              // e.g. SEJAL-2026-000001
  previousState?: string;
  newState: string;
  action: string;
  actor: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

export interface NotificationPayload {
  id: string;
  recipientEmail: string;
  recipientPhone?: string;
  recipientName: string;
  channels: Array<'email' | 'whatsapp' | 'sms'>;
  event: CommerceEventType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed' | 'suppressed_duplicate';
  deduplicationKey: string;
}
