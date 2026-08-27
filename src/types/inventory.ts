/**
 * SEJAL.PRO — Phase 2 Inventory Domain Models
 * Authoritative Server-Side Models for Atomic Reservations, Overselling Protection, and Stock Dispositions.
 */

export type StockDisposition =
  | 'Restock'
  | 'Damaged'
  | 'Reject'
  | 'Further Review';

export type InventoryEventType =
  | 'stock.initialized'
  | 'stock.reserved'
  | 'stock.released'
  | 'stock.sold'
  | 'stock.adjusted'
  | 'stock.returned'
  | 'stock.damaged'
  | 'stock.low_threshold_reached';

export interface InventoryItem {
  id: string;                         // inv_xxx
  productId: string;                  // Linked product ID
  productName: string;
  variantId: string;                  // Linked variant ID
  sku: string;                        // Unique SKU identifier
  variantTitle: string;
  totalQuantity: number;              // Total physical units on hand
  reservedQuantity: number;           // Reserved in pending/confirmed orders
  availableQuantity: number;          // totalQuantity - reservedQuantity - soldQuantity - damagedQuantity
  soldQuantity: number;               // Fulfilled and delivered
  damagedQuantity: number;            // Quarantined damaged goods
  returnedQuantity: number;           // Returned awaiting inspection
  lowStockThreshold: number;          // Default e.g. 3 units for luxury pieces
  isLowStock: boolean;
  isOutOfStock: boolean;
  updatedAt: string;
}

export interface InventoryReservation {
  id: string;                         // res_xxx
  orderId: string;                    // Linked SEJAL order ID
  orderNumber: string;
  sku: string;
  variantId: string;
  quantity: number;
  status: 'active' | 'fulfilled' | 'released' | 'expired';
  expiresAt: string;                  // Auto-release TTL for unpaid checkouts (e.g. 30 mins)
  createdAt: string;
  releasedAt?: string;
  releaseReason?: 'payment_failed' | 'order_cancelled' | 'ttl_expired' | 'manual_override';
}

export interface InventoryEvent {
  id: string;
  sku: string;
  variantId: string;
  eventType: InventoryEventType;
  quantityChanged: number;
  availableAfter: number;
  reservedAfter: number;
  referenceId?: string;               // orderId, returnId, or admin adjustment ID
  actor: 'system' | 'customer' | 'admin_user';
  note?: string;
  timestamp: string;
}

export interface StockAdjustmentRequest {
  sku: string;
  adjustmentType: 'add' | 'subtract' | 'set' | 'mark_damaged';
  quantity: number;
  reason: string;
  actor: string;
}
