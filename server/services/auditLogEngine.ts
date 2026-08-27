import { store } from '../db/store';
import { AuditLogEntry, CommerceEvent, CommerceEventType } from '../../src/types/events';

export class AuditLogEngine {
  /**
   * Log an immutable operational audit entry
   */
  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const record: AuditLogEntry = {
      ...entry,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    store.auditLogs.unshift(record); // Store newest first
    return record;
  }

  /**
   * Dispatch and record a commerce event
   */
  public emitCommerceEvent(
    eventType: CommerceEventType,
    entityType: 'order' | 'payment' | 'inventory' | 'shipment' | 'return' | 'refund',
    entityId: string,
    payload: Record<string, unknown>,
    actor: 'system' | 'customer' | 'admin_user' | 'razorpay_webhook' | 'carrier_webhook' = 'system',
    orderNumber?: string
  ): CommerceEvent {
    const event: CommerceEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eventType,
      entityType,
      entityId,
      orderNumber,
      payload,
      actor,
      timestamp: new Date().toISOString(),
      processed: true,
    };

    store.commerceEvents.unshift(event);
    return event;
  }

  /**
   * Retrieve audit logs with optional filtering
   */
  public getAuditLogs(filter?: { entityType?: string; entityId?: string; referenceCode?: string }): AuditLogEntry[] {
    let logs = store.auditLogs;
    if (filter?.entityType) {
      logs = logs.filter((l) => l.entityType === filter.entityType);
    }
    if (filter?.entityId) {
      logs = logs.filter((l) => l.entityId === filter.entityId);
    }
    if (filter?.referenceCode) {
      logs = logs.filter((l) => l.referenceCode === filter.referenceCode);
    }
    return logs;
  }

  /**
   * Retrieve commerce events
   */
  public getCommerceEvents(orderNumber?: string): CommerceEvent[] {
    if (orderNumber) {
      return store.commerceEvents.filter((e) => e.orderNumber === orderNumber);
    }
    return store.commerceEvents;
  }
}

export const auditLogEngine = new AuditLogEngine();
