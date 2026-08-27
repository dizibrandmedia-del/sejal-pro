/**
 * SEJAL.PRO — Phase 5 Omnichannel Notification Engine
 * Unified Provider Abstraction (Email, WhatsApp, SMS), Safe Variable Interpolation, Frequency Capping & Consent.
 */

import { store } from '../db/store';
import { NotificationTemplate, NotificationChannel, CommunicationLog } from '../../src/types/automation';
import { Customer360Profile } from '../../src/types/crm';
import { auditLogEngine } from './auditLogEngine';

export class OmniNotificationEngine {
  /**
   * CREATE OR UPDATE NOTIFICATION TEMPLATE
   */
  public saveTemplate(payload: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): NotificationTemplate {
    const id = payload.id || `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const template: NotificationTemplate = {
      ...payload,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.notificationTemplates.set(id, template);

    auditLogEngine.logAudit({
      entityType: 'Template',
      entityId: id,
      referenceCode: template.name,
      action: payload.id ? 'TEMPLATE_UPDATED' : 'TEMPLATE_CREATED',
      actor: 'Content Manager',
      reason: `Template ${template.name} for ${template.channel}`,
    });

    return template;
  }

  /**
   * LIST ALL TEMPLATES
   */
  public listTemplates(): NotificationTemplate[] {
    return Array.from(store.notificationTemplates.values());
  }

  /**
   * INTERPOLATE TEMPLATE VARIABLES SAFELY
   */
  public interpolateVariables(templateString: string, variables: Record<string, any>): string {
    return templateString.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
      if (variables[key] !== undefined && variables[key] !== null) {
        return String(variables[key]);
      }
      return match; // Keep unresolved variable intact or fallback
    });
  }

  /**
   * SEND NOTIFICATION (OMNICHANNEL WITH FREQUENCY & CONSENT CHECKS)
   */
  public async sendNotification(payload: {
    recipient: { email: string; phone?: string; name: string; customerId?: string };
    templateId?: string;
    channel: NotificationChannel;
    messageType: 'transactional' | 'marketing';
    subject?: string;
    body?: string;
    variables?: Record<string, any>;
    associatedOrderId?: string;
    associatedWorkflowId?: string;
  }): Promise<CommunicationLog> {
    const { recipient, templateId, channel, messageType, variables = {}, associatedOrderId, associatedWorkflowId } = payload;

    // 1. Fetch template if templateId provided
    let subject = payload.subject || '';
    let body = payload.body || '';

    if (templateId) {
      const template = store.notificationTemplates.get(templateId);
      if (!template) {
        throw new Error(`Notification template ${templateId} does not exist.`);
      }
      if (template.subjectTemplate) {
        subject = this.interpolateVariables(template.subjectTemplate, { ...variables, customer_name: recipient.name });
      }
      body = this.interpolateVariables(template.bodyTemplate, { ...variables, customer_name: recipient.name });
    }

    const logId = `log_comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    // 2. Consent Verification for Marketing Communications
    if (messageType === 'marketing') {
      const customer =
        (recipient.customerId ? store.crmProfiles.get(recipient.customerId) : null) ||
        Array.from(store.crmProfiles.values()).find(
          (p) => p.email.toLowerCase() === recipient.email.toLowerCase()
        );

      if (customer) {
        if (channel === 'email' && !customer.consent.marketingEmail) {
          return this.recordSuppressedLog(logId, recipient, channel, messageType, subject, body, 'suppressed_consent', associatedOrderId, associatedWorkflowId);
        }
        if (channel === 'whatsapp' && !customer.consent.marketingWhatsApp) {
          return this.recordSuppressedLog(logId, recipient, channel, messageType, subject, body, 'suppressed_consent', associatedOrderId, associatedWorkflowId);
        }
        if (channel === 'sms' && !customer.consent.marketingSMS) {
          return this.recordSuppressedLog(logId, recipient, channel, messageType, subject, body, 'suppressed_consent', associatedOrderId, associatedWorkflowId);
        }

        // 3. Frequency Capping: Maximum 1 marketing communication per 24 hours
        const lastMarketingLog = store.communicationLogs.find(
          (l) => l.recipientEmail.toLowerCase() === recipient.email.toLowerCase() &&
                 l.messageType === 'marketing' &&
                 l.status === 'delivered' &&
                 Date.now() - new Date(l.sentAt).getTime() < 24 * 60 * 60 * 1000
        );

        if (lastMarketingLog) {
          return this.recordSuppressedLog(logId, recipient, channel, messageType, subject, body, 'suppressed_frequency_limit', associatedOrderId, associatedWorkflowId);
        }
      }
    }

    // 4. Simulate Delivery through Provider (Email: SendGrid/SES, WhatsApp: Twilio/Meta Business, SMS: Kaleyra)
    const providerMessageId = `msg_prv_${channel}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const log: CommunicationLog = {
      id: logId,
      recipientEmail: recipient.email,
      recipientPhone: recipient.phone,
      recipientName: recipient.name,
      channel,
      templateId,
      messageType,
      title: subject,
      body,
      status: 'delivered',
      providerMessageId,
      associatedOrderId,
      associatedWorkflowId,
      sentAt: now,
      deliveredAt: now,
    };

    store.communicationLogs.unshift(log);

    // Also record on customer timeline if customer is identified
    const existingTimeline = store.customerTimelines.get(recipient.email.toLowerCase()) || [];
    existingTimeline.unshift({
      id: `evt_tl_${Date.now()}`,
      customerId: recipient.customerId || recipient.email,
      customerEmail: recipient.email,
      eventType: 'automation_message_sent',
      title: `${channel.toUpperCase()} Dispatched: ${subject || templateId || 'Communication'}`,
      description: body.substring(0, 120) + (body.length > 120 ? '...' : ''),
      channel,
      timestamp: now,
    });
    store.customerTimelines.set(recipient.email.toLowerCase(), existingTimeline);

    return log;
  }

  private recordSuppressedLog(
    logId: string,
    recipient: { email: string; phone?: string; name: string },
    channel: NotificationChannel,
    messageType: 'transactional' | 'marketing',
    title: string,
    body: string,
    status: 'suppressed_opt_out' | 'suppressed_frequency' | 'suppressed_purchased',
    associatedOrderId?: string,
    associatedWorkflowId?: string
  ): CommunicationLog {
    const log: CommunicationLog = {
      id: logId,
      recipientEmail: recipient.email,
      recipientPhone: recipient.phone,
      recipientName: recipient.name,
      channel,
      messageType,
      title,
      body,
      status,
      associatedOrderId,
      associatedWorkflowId,
      sentAt: new Date().toISOString(),
    };

    store.communicationLogs.unshift(log);
    console.log(`[OmniNotification] Communication suppressed for ${recipient.email} reason: ${status}`);
    return log;
  }

  /**
   * LIST COMMUNICATION LOGS
   */
  public listCommunicationLogs(limit: number = 50): CommunicationLog[] {
    return store.communicationLogs.slice(0, limit);
  }
}

export const omniNotificationEngine = new OmniNotificationEngine();
