/**
 * SEJAL.PRO — Phase 5 Attribution, Influencer & Affiliate Models
 * Multi-touchpoint UTM attribution, Creator links, and Return/Refund Commission Ledgers.
 */

export interface UTMTouchpoint {
  id: string;
  sessionId: string;
  customerId?: string;
  customerEmail?: string;
  utmSource: string;                  // e.g. 'instagram', 'google', 'vogue_middle_east'
  utmMedium: string;                  // e.g. 'cpc', 'story_link', 'influencer_exclusive'
  utmCampaign: string;                // e.g. 'uae_royal_launch_2026'
  utmTerm?: string;
  utmContent?: string;
  landingPath: string;
  ipCountry?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  timestamp: string;
}

export type CommissionModel = 'percentage' | 'fixed_per_order';

export interface InfluencerProfile {
  id: string;                         // inf_xxx
  handle: string;                     // e.g. @sheikha_style or @royalelegance
  fullName: string;
  email: string;
  phone: string;
  country: string;
  uniqueCode: string;                 // e.g. 'SEJALXSHEIKHA'
  referralSlug: string;               // e.g. '/invite/sheikha'
  commissionModel: CommissionModel;
  commissionRate: number;             // e.g. 10 (10%) or 15000 (₹15,000 fixed)
  status: 'active' | 'paused' | 'archived';
  
  // Performance Aggregations
  totalClicks: number;
  totalOrdersCount: number;
  totalGrossRevenueINR: number;
  totalRefundedRevenueINR: number;
  netEligibleRevenueINR: number;
  totalCommissionEarnedINR: number;
  totalCommissionPaidINR: number;
  pendingCommissionINR: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateProfile {
  id: string;                         // aff_xxx
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  websiteUrl: string;
  uniqueCode: string;                 // e.g. 'VOGUEGLOBAL10'
  referralSlug: string;
  commissionPercentage: number;       // e.g. 8%
  status: 'active' | 'paused' | 'suspended';
  
  // Performance
  totalClicks: number;
  totalOrdersCount: number;
  totalGrossRevenueINR: number;
  netEligibleRevenueINR: number;
  totalCommissionEarnedINR: number;
  pendingPayoutINR: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface CommissionLedgerEntry {
  id: string;                         // comm_xxx
  beneficiaryType: 'influencer' | 'affiliate';
  beneficiaryId: string;
  beneficiaryName: string;
  orderId: string;
  orderNumber: string;
  orderAmountINR: number;
  commissionRateApplied: string;      // e.g. "10%"
  grossCommissionINR: number;
  
  // Deductions from Returns & Partial Refunds
  isRefundedOrReturned: boolean;
  refundDeductionINR: number;
  netCommissionPayableINR: number;
  
  status: 'pending_hold' | 'approved_payable' | 'paid' | 'cancelled_refunded';
  payoutHoldUntilDate: string;        // 30 days after delivery to ensure return window passed
  paidAt?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttributionReport {
  channel: string;
  source: string;
  medium: string;
  campaign: string;
  clicks: number;
  ordersCount: number;
  grossRevenueINR: number;
  netRevenueINR: number;
  aovINR: number;
  conversionRatePercentage: number;
}
