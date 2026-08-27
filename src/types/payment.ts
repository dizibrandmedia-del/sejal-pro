/**
 * SEJAL.PRO — Phase 2 Payment Domain Models
 * Authoritative Server-Side Models for Razorpay, States, Webhooks, and Refunds.
 */

export type PaymentStatus =
  | 'Initiated'
  | 'Payment Pending'
  | 'Captured'
  | 'Failed'
  | 'Cancelled'
  | 'Refunded'
  | 'Partially Refunded';

export type RefundStatus =
  | 'Refund Initiated'
  | 'Refund Processing'
  | 'Refund Completed'
  | 'Refund Failed';

export type PaymentMethodCategory =
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'
  | 'international'
  | 'mock_gateway';

export interface PaymentMetadata {
  cardLast4?: string;
  cardNetwork?: string;
  bankName?: string;
  upiVpa?: string;
  walletName?: string;
  internationalCountry?: string;
  clientIp?: string;
  userAgent?: string;
}

export interface Payment {
  id: string;                         // Internal SEJAL payment ID (pay_xxx)
  orderId: string;                    // Linked SEJAL order ID
  orderNumber: string;                // e.g. SEJAL-2026-000001
  razorpayOrderId?: string;           // Razorpay generated order ID (order_xxx)
  razorpayPaymentId?: string;         // Razorpay capture ID (pay_xxx)
  razorpaySignature?: string;         // HMAC SHA256 signature
  amountINR: number;                  // Authoritative amount in INR
  currency: string;                   // Customer active currency (INR, USD, AED, AUD)
  currencyRateAgainstINR: number;     // Multiplier at time of payment
  amountInCurrency: number;           // Amount in customer's currency
  status: PaymentStatus;
  method: PaymentMethodCategory;
  metadata?: PaymentMetadata;
  failureReason?: string;
  failureCode?: string;
  isSignatureVerified: boolean;
  refundedAmountINR: number;
  outstandingAmountINR: number;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
  capturedAt?: string;
}

export interface PaymentEvent {
  id: string;
  paymentId: string;
  eventType: string;                  // e.g. payment.authorized, payment.captured, payment.failed
  source: 'razorpay_webhook' | 'client_verification' | 'admin_override' | 'system';
  providerEventId?: string;           // x-razorpay-event-id
  rawPayload: Record<string, unknown>;
  normalizedStatus: PaymentStatus;
  processedAt: string;
  isDuplicate: boolean;
}

export interface Refund {
  id: string;                         // Internal SEJAL refund ID (ref_xxx)
  orderId: string;                    // Linked order ID
  paymentId: string;                  // Linked payment ID
  razorpayRefundId?: string;          // Razorpay refund ID (rfnd_xxx)
  returnId?: string;                  // Linked return request ID if applicable
  amountINR: number;
  currency: string;
  amountInCurrency: number;
  reason: string;
  status: RefundStatus;
  requestedBy: string;                // Customer email or admin identifier
  requestedAt: string;
  processedAt?: string;
  failedReason?: string;
  auditNote?: string;
}

export interface PaymentReconciliation {
  orderId: string;
  orderNumber: string;
  orderTotalINR: number;
  capturedPaymentINR: number;
  totalRefundedINR: number;
  netRevenueINR: number;
  outstandingINR: number;
  hasMismatch: boolean;
  mismatchReason?: string;
  paymentStatus: PaymentStatus;
  reconciledAt: string;
}

export interface RazorpayOrderCreateRequest {
  orderId: string;
  currency?: string;
}

export interface RazorpayOrderCreateResponse {
  razorpayOrderId: string;
  amountINR: number;
  currency: string;
  amountInSmallestUnit: number;        // in paise / cents
  keyId: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface RazorpayVerifySignatureRequest {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface RazorpayVerifySignatureResponse {
  success: boolean;
  verified: boolean;
  paymentId: string;
  orderStatus: string;
  message: string;
}
