/**
 * SEJAL.PRO — Phase 5 CRM Domain Models
 * Customer 360, Identity Resolution, Dynamic Segmentation, Timeline, and Consent.
 */

import { PriveTier } from './customer';

export interface CustomerConsent {
  marketingEmail: boolean;
  marketingWhatsApp: boolean;
  marketingSMS: boolean;
  frequencyPreference: 'daily_digest' | 'weekly_curation' | 'vip_invites_only' | 'quiet_mode';
  lastConsentUpdated: string;
  consentSource: 'checkout' | 'account_portal' | 'newsletter_modal' | 'concierge_direct';
}

export interface Customer360Profile {
  id: string;                         // cust_xxx
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  country: string;                    // India, United Arab Emirates, United States, Australia
  preferredCurrency: 'INR' | 'USD' | 'AED' | 'AUD';
  
  // Financial & Order Metrics (Authoritative from Commerce Engine)
  totalOrdersCount: number;
  lifetimeSpendINR: number;
  averageOrderValueINR: number;
  firstOrderDate?: string;
  lastOrderDate?: string;
  
  // Category & Product Affinity
  viewedProductIds: string[];
  wishlistProductIds: string[];
  cartProductIds: string[];
  preferredCategories: string[];      // e.g. ['high-jewellery', 'bridal-edit']
  preferredBrands: string[];
  
  // Privé & Concierge Status
  priveTier: PriveTier;
  privePoints: number;
  isPriveEligible: boolean;
  assignedConciergeStaff?: string;
  conciergeRequestsCount: number;
  lastConciergeContactDate?: string;
  
  // Returns & Quality Metrics
  totalReturnsCount: number;
  totalRefundedINR: number;
  returnRatePercentage: number;
  
  // Marketing & Attribution
  acquisitionSource: 'organic' | 'google_ads' | 'meta_ads' | 'influencer' | 'affiliate' | 'referral' | 'direct';
  firstUtmSource?: string;
  firstUtmMedium?: string;
  firstUtmCampaign?: string;
  attributedInfluencerId?: string;
  attributedAffiliateId?: string;
  
  // Consent & Preferences
  consent: CustomerConsent;
  
  // Segment Memberships
  activeSegmentIds: string[];
  
  createdAt: string;
  updatedAt: string;
}

export type CustomerTimelineEventType =
  | 'session_started'
  | 'product_viewed'
  | 'category_browsed'
  | 'collection_viewed'
  | 'wishlist_added'
  | 'wishlist_removed'
  | 'cart_item_added'
  | 'cart_abandoned'
  | 'order_created'
  | 'payment_captured'
  | 'order_shipped'
  | 'order_delivered'
  | 'return_requested'
  | 'refund_issued'
  | 'review_submitted'
  | 'prive_upgraded'
  | 'concierge_requested'
  | 'concierge_completed'
  | 'automation_message_sent'
  | 'automation_message_opened'
  | 'automation_message_clicked';

export interface CustomerTimelineEvent {
  id: string;                         // evt_tl_xxx
  customerId: string;
  customerEmail: string;
  eventType: CustomerTimelineEventType;
  title: string;
  description: string;
  entityId?: string;                  // e.g. orderId, productId, returnId
  metadata?: Record<string, any>;
  timestamp: string;
  channel?: 'storefront' | 'email' | 'whatsapp' | 'sms' | 'concierge' | 'system';
}

export type SegmentConditionField =
  | 'country'
  | 'lifetimeSpendINR'
  | 'totalOrdersCount'
  | 'averageOrderValueINR'
  | 'priveTier'
  | 'daysSinceLastOrder'
  | 'categoryAffinity'
  | 'hasAbandonedCart'
  | 'hasWishlistItems'
  | 'acquisitionSource'
  | 'attributedInfluencerId'
  | 'returnsCount';

export type SegmentOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'contains'
  | 'in_list'
  | 'is_true'
  | 'is_false';

export interface SegmentRule {
  field: SegmentConditionField;
  operator: SegmentOperator;
  value: any;
}

export interface DynamicSegment {
  id: string;                         // seg_xxx
  name: string;
  description: string;
  logic: 'ALL' | 'ANY';               // AND vs OR
  rules: SegmentRule[];
  memberCount: number;
  isSystemSegment: boolean;           // Built-in VIP / Privé / Abandoned Cart
  createdAt: string;
  updatedAt: string;
  lastCalculatedAt: string;
}

export interface IdentityMergeRecord {
  id: string;
  sourceGuestSessionId: string;
  targetCustomerId: string;
  mergedEmail: string;
  mergedPhone: string;
  transferredEventsCount: number;
  mergedAt: string;
  actor: 'system_auto_merge' | 'admin_manual_merge';
}
