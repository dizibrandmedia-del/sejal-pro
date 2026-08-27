import { Address } from './customer';
import { GiftPackagingOption } from './cart';
import { PaymentStatus } from './payment';

/**
 * SEJAL.PRO — Phase 2 Master Order Status Lifecycle
 * Strictly enforces valid PRD transitions:
 * Payment Pending -> Confirmed -> Processing -> Quality Check -> Packed -> Ready to Ship ->
 * Pickup Scheduled -> Picked Up -> Shipped -> In Transit -> Out for Delivery -> Delivered
 * (Exceptions: Cancelled, RTO, Returned, Refunded)
 */
export type OrderStatus =
  | 'Payment Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Quality Check'
  | 'Packed'
  | 'Ready to Ship'
  | 'Pickup Scheduled'
  | 'Picked Up'
  | 'Shipped'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'RTO'
  | 'Returned'
  | 'Refunded';

export type PaymentMethodType =
  | 'razorpay'
  | 'credit_card'
  | 'netbanking_upi'
  | 'apple_pay'
  | 'stripe'
  | 'prive_concierge_invoice'
  | 'mock_luxury';

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDelivery: string;
  priceINR: number;
  insured: boolean;
}

export interface OrderItem {
  id: string;                         // Unique order item ID
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  sku: string;
  selectedOptionsText: string;
  imageUrl: string;
  priceINR: number;
  quantity: number;
  totalINR: number;
  isReturned?: boolean;
  returnId?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  actor: 'customer' | 'admin_user' | 'system' | 'razorpay_webhook' | 'carrier_webhook';
  note?: string;
}

export interface OrderCancellationRecord {
  cancelledAt: string;
  cancelledBy: 'customer' | 'admin_user' | 'system';
  reason: string;
  refundInitiated: boolean;
  refundId?: string;
  inventoryReleased: boolean;
}

export interface Order {
  id: string;                         // ord_xxx
  orderNumber: string;                // e.g. "SEJAL-2026-000001"
  customerId?: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  
  items: OrderItem[];
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  giftPackaging: GiftPackagingOption;
  
  subtotalINR: number;
  discountINR: number;
  shippingINR: number;
  taxINR: number;
  packagingINR: number;
  totalINR: number;
  
  currencyUsed: string;
  exchangeRateUsed: number;
  totalInCurrency: number;
  
  paymentId?: string;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  
  shipmentId?: string;
  trackingNumber?: string;
  trackingCourier?: string;
  trackingUrl?: string;
  lastKnownLocation?: string;
  
  inventoryReservationId?: string;
  
  returnIds: string[];
  refundIds: string[];
  cancellation?: OrderCancellationRecord;
  
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
}
