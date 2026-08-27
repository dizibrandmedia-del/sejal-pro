/**
 * SEJAL.PRO — Phase 5 Advanced Analytics & Canonical Event Dictionary
 * Strictly enforces Purchase Deduplication, Cohorts, and GA4 / Meta CAPI compatibility.
 */

export type CanonicalEventType =
  | 'page_view'
  | 'search_performed'
  | 'product_view'
  | 'category_view'
  | 'collection_view'
  | 'wishlist_add'
  | 'wishlist_remove'
  | 'add_to_bag'
  | 'remove_from_bag'
  | 'checkout_started'
  | 'checkout_step_completed'
  | 'purchase'
  | 'refund'
  | 'campaign_click'
  | 'influencer_click'
  | 'affiliate_click';

export interface CanonicalAnalyticsEvent {
  id: string;                         // evt_an_xxx
  eventType: CanonicalEventType;
  deduplicationKey?: string;          // Crucial for purchase: `order_${orderNumber}`
  sessionId: string;
  customerId?: string;
  customerEmail?: string;
  orderId?: string;
  orderNumber?: string;
  productId?: string;
  productName?: string;
  category?: string;
  amountINR?: number;
  currency?: string;
  country?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  
  // Attribution parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  influencerCode?: string;
  affiliateCode?: string;
  
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface CustomerCohortMetrics {
  cohortMonth: string;                // e.g. "2026-06"
  newCustomersCount: number;
  month1Retention: number;            // Percentage e.g. 35.4%
  month2Retention: number;
  month3Retention: number;
  averageLTV_INR: number;
}

export interface ProductAnalyticsSummary {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  viewsCount: number;
  uniqueViewersCount: number;
  wishlistCount: number;
  addToBagCount: number;
  purchasesCount: number;
  grossRevenueINR: number;
  conversionRatePercentage: number;
  returnsCount: number;
}

export interface AdvancedAnalyticsDashboardData {
  overview: {
    totalSessions: number;
    totalOrders: number;
    grossRevenueINR: number;
    netRevenueINR: number;
    averageOrderValueINR: number;
    overallConversionRate: number;
    repeatCustomerRate: number;
    totalPriveClients: number;
  };
  geography: Array<{
    country: string;
    ordersCount: number;
    revenueINR: number;
    aovINR: number;
    sharePercentage: number;
  }>;
  channels: Array<{
    channel: string;
    source: string;
    sessions: number;
    orders: number;
    revenueINR: number;
    conversionRate: number;
  }>;
  topProducts: ProductAnalyticsSummary[];
  cohorts: CustomerCohortMetrics[];
}
