/**
 * SEJAL.PRO — Phase 5 Marketing Automation & Omnichannel Notification Types
 * Reusable Workflow Engine, Triggers, Conditions, Delays, Actions, and Delivery Logs.
 */

export type WorkflowTriggerType =
  | 'cart_abandoned'
  | 'product_viewed_multiple'
  | 'wishlist_item_added'
  | 'order_placed'
  | 'order_delivered'
  | 'prive_tier_upgraded'
  | 'segment_joined'
  | 'inactive_30_days'
  | 'birthday_upcoming';

export type NotificationChannel = 'email' | 'whatsapp' | 'sms';

export interface WorkflowCondition {
  field: 'country' | 'lifetimeSpendINR' | 'priveTier' | 'hasPurchasedSinceTrigger' | 'isCartStillActive' | 'hasConsent';
  operator: 'equals' | 'greater_than' | 'is_true' | 'is_false' | 'in_list';
  value: any;
}

export interface WorkflowAction {
  channel: NotificationChannel;
  templateId: string;
  subject?: string;
  customMessage?: string;
  includeDiscountCoupon?: string;
  assignedConciergeTask?: boolean;
}

export interface WorkflowStep {
  id: string;                         // step_xxx
  stepType: 'delay' | 'condition' | 'action';
  delayMinutes?: number;              // e.g. 120 = 2 hours
  condition?: WorkflowCondition;
  action?: WorkflowAction;
  onConditionFalseGotoStepId?: string; // Branching
  nextStepId?: string;
}

export interface MarketingWorkflow {
  id: string;                         // wf_xxx
  name: string;
  description: string;
  triggerType: WorkflowTriggerType;
  targetSegmentId?: string;           // Optional segment restriction
  steps: WorkflowStep[];
  isActive: boolean;
  frequencyCapHours: number;          // e.g. 24h cooldown for same customer
  quietHoursEnforced: boolean;        // e.g. 10 PM - 8 AM suppression
  totalEnrolledCount: number;
  totalConvertedCount: number;
  totalRevenueGeneratedINR: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecutionState {
  id: string;                         // exec_xxx
  workflowId: string;
  customerId: string;
  customerEmail: string;
  customerPhone?: string;
  triggerEventId: string;             // Idempotency anchor
  currentStepIndex: number;
  status: 'active' | 'waiting_delay' | 'completed' | 'exited_converted' | 'exited_opt_out' | 'failed';
  delayUntilTimestamp?: string;
  executionHistory: Array<{
    stepId: string;
    actionExecuted: string;
    result: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;                         // tmpl_xxx
  name: string;
  category: 'abandoned_cart' | 'prive_invitation' | 'order_update' | 'concierge_followup' | 'collection_curation';
  channel: NotificationChannel;
  subjectTemplate?: string;           // for email
  bodyTemplate: string;               // Contains {{customer_name}}, {{order_id}}, {{tracking_url}}, {{product_name}}, etc.
  supportedVariables: string[];
  isTransactional: boolean;           // True for orders/shipping (bypasses marketing opt-out)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationLog {
  id: string;                         // log_comm_xxx
  recipientEmail: string;
  recipientPhone?: string;
  recipientName: string;
  channel: NotificationChannel;
  templateId?: string;
  messageType: 'transactional' | 'marketing';
  title?: string;
  body?: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'clicked' | 'failed' | 'suppressed_frequency' | 'suppressed_frequency_limit' | 'suppressed_opt_out' | 'suppressed_consent' | 'suppressed_purchased';
  failureReason?: string;
  associatedOrderId?: string;
  associatedWorkflowId?: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
}
