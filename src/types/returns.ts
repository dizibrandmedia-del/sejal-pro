/**
 * SEJAL.PRO — Phase 2 Returns & Quality Check Domain Models
 * Item-level Returns, Quality Inspections, Dispositions, and Refund Linkages.
 */

import { StockDisposition } from './inventory';

export type ReturnStatus =
  | 'Requested'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Pickup Scheduled'
  | 'Received'
  | 'Quality Check'
  | 'Refund Initiated'
  | 'Refund Completed';

export type ReturnReason =
  | 'Defective Craftsmanship or Gem Loose'
  | 'Incorrect Size or Fit'
  | 'Different from Presentation'
  | 'Damaged in Transit / Seal Broken'
  | 'Styling Preference Change'
  | 'Other Inviolable Reason';

export interface ReturnItem {
  id: string;                         // ret_item_xxx
  orderItemId: string;
  productId: string;
  productName: string;
  variantId: string;
  variantTitle: string;
  sku: string;
  quantity: number;
  itemPriceINR: number;
  refundEligibleAmountINR: number;
  reason: ReturnReason;
  customReasonDetail?: string;
  photos: string[];                   // Uploaded photo evidence URLs
  qualityResult?: QualityCheckResult;
}

export interface QualityCheckResult {
  inspectorName: string;
  inspectionDate: string;
  isPassed: boolean;
  receivedCondition: 'Pristine in Vault Box' | 'Minor Seal Wear' | 'Damaged / Altered' | 'Missing Accessories or Certificate';
  securityTagIntact: boolean;
  certificatePresent: boolean;
  notes: string;
  disposition: StockDisposition;      // Restock | Damaged | Reject | Further Review
  approvedRefundAmountINR: number;
}

export interface ReturnRequest {
  id: string;                         // ret_xxx
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: ReturnItem[];
  totalRefundRequestedINR: number;
  approvedRefundAmountINR?: number;
  status: ReturnStatus;
  statusHistory: Array<{
    status: ReturnStatus;
    timestamp: string;
    note?: string;
    actor: 'customer' | 'admin_user' | 'system';
  }>;
  pickupAddress: {
    recipientName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
  };
  pickupScheduledDate?: string;
  pickupAwbNumber?: string;
  linkedRefundId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface SubmitReturnRequestPayload {
  orderId: string;
  items: Array<{
    orderItemId: string;
    quantity: number;
    reason: ReturnReason;
    customReasonDetail?: string;
    photos?: string[];
  }>;
}

export interface ExecuteQualityCheckPayload {
  returnId: string;
  inspectorName: string;
  receivedCondition: 'Pristine in Vault Box' | 'Minor Seal Wear' | 'Damaged / Altered' | 'Missing Accessories or Certificate';
  securityTagIntact: boolean;
  certificatePresent: boolean;
  disposition: StockDisposition;
  isApproved: boolean;
  approvedRefundAmountINR: number;
  notes: string;
}
