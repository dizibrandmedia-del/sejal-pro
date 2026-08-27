import { store } from '../db/store';
import { InventoryItem, InventoryReservation, InventoryEvent, StockDisposition } from '../../src/types/inventory';
import { auditLogEngine } from './auditLogEngine';

export class InventoryEngine {
  /**
   * Check live availability for a SKU
   */
  public getAvailability(sku: string): { available: number; total: number; reserved: number; isOutOfStock: boolean; isLowStock: boolean } {
    const item = store.inventory.get(sku);
    if (!item) {
      return { available: 0, total: 0, reserved: 0, isOutOfStock: true, isLowStock: true };
    }
    return {
      available: item.availableQuantity,
      total: item.totalQuantity,
      reserved: item.reservedQuantity,
      isOutOfStock: item.availableQuantity <= 0,
      isLowStock: item.isLowStock,
    };
  }

  /**
   * Get all inventory items
   */
  public getAllInventory(): InventoryItem[] {
    return Array.from(store.inventory.values());
  }

  /**
   * ATOMIC INVENTORY RESERVATION
   * Thread-safe with mutex lock to guarantee zero overselling.
   */
  public async reserveStock(
    items: Array<{ sku: string; variantId: string; quantity: number }>,
    orderId: string,
    orderNumber: string
  ): Promise<{ success: boolean; reservationId?: string; error?: string }> {
    return store.executeTransaction(async () => {
      // Step 1: Pre-flight validation of all items under lock
      for (const item of items) {
        const inv = store.inventory.get(item.sku);
        if (!inv) {
          return { success: false, error: `SKU ${item.sku} does not exist in master catalog.` };
        }
        if (inv.availableQuantity < item.quantity) {
          return {
            success: false,
            error: `Insufficient inventory for ${inv.productName} (${inv.variantTitle}). Requested: ${item.quantity}, Available: ${inv.availableQuantity}.`,
          };
        }
      }

      // Step 2: Atomically deduct availableQuantity and increase reservedQuantity
      const reservationId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins TTL

      for (const item of items) {
        const inv = store.inventory.get(item.sku)!;
        
        inv.availableQuantity -= item.quantity;
        inv.reservedQuantity += item.quantity;
        inv.isLowStock = inv.availableQuantity <= inv.lowStockThreshold;
        inv.isOutOfStock = inv.availableQuantity <= 0;
        inv.updatedAt = new Date().toISOString();

        store.inventory.set(item.sku, inv);

        // Store reservation record
        const resRecord: InventoryReservation = {
          id: `${reservationId}_${item.sku}`,
          orderId,
          orderNumber,
          sku: item.sku,
          variantId: item.variantId,
          quantity: item.quantity,
          status: 'active',
          expiresAt,
          createdAt: new Date().toISOString(),
        };
        store.inventoryReservations.set(resRecord.id, resRecord);

        // Log inventory event
        const invEvent: InventoryEvent = {
          id: `invevt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sku: item.sku,
          variantId: item.variantId,
          eventType: 'stock.reserved',
          quantityChanged: -item.quantity,
          availableAfter: inv.availableQuantity,
          reservedAfter: inv.reservedQuantity,
          referenceId: orderId,
          actor: 'customer',
          note: `Reserved ${item.quantity} units for order ${orderNumber}`,
          timestamp: new Date().toISOString(),
        };
        store.inventoryEvents.push(invEvent);

        auditLogEngine.logAudit({
          entityType: 'Inventory',
          entityId: inv.id,
          referenceCode: orderNumber,
          action: 'STOCK_RESERVED',
          previousState: `Available: ${inv.availableQuantity + item.quantity}`,
          newState: `Available: ${inv.availableQuantity}, Reserved: ${inv.reservedQuantity}`,
          actor: 'Customer Checkout',
        });
      }

      auditLogEngine.emitCommerceEvent(
        'inventory.reserved',
        'inventory',
        reservationId,
        { orderId, orderNumber, itemsCount: items.length },
        'system',
        orderNumber
      );

      return { success: true, reservationId };
    });
  }

  /**
   * ATOMIC INVENTORY RELEASE
   * Releases reserved stock when an order is cancelled or payment fails.
   */
  public async releaseStock(
    orderId: string,
    orderNumber: string,
    reason: 'payment_failed' | 'order_cancelled' | 'ttl_expired' | 'manual_override'
  ): Promise<{ success: boolean; releasedCount: number }> {
    return store.executeTransaction(async () => {
      let releasedCount = 0;

      for (const [resId, res] of store.inventoryReservations.entries()) {
        if (res.orderId === orderId && res.status === 'active') {
          const inv = store.inventory.get(res.sku);
          if (inv) {
            inv.reservedQuantity = Math.max(0, inv.reservedQuantity - res.quantity);
            inv.availableQuantity += res.quantity;
            inv.isLowStock = inv.availableQuantity <= inv.lowStockThreshold;
            inv.isOutOfStock = inv.availableQuantity <= 0;
            inv.updatedAt = new Date().toISOString();

            store.inventory.set(res.sku, inv);
          }

          res.status = 'released';
          res.releasedAt = new Date().toISOString();
          res.releaseReason = reason;
          store.inventoryReservations.set(resId, res);
          releasedCount += res.quantity;

          // Log event
          store.inventoryEvents.push({
            id: `invevt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            sku: res.sku,
            variantId: res.variantId,
            eventType: 'stock.released',
            quantityChanged: res.quantity,
            availableAfter: inv?.availableQuantity || 0,
            reservedAfter: inv?.reservedQuantity || 0,
            referenceId: orderId,
            actor: 'system',
            note: `Released ${res.quantity} units due to ${reason}`,
            timestamp: new Date().toISOString(),
          });
        }
      }

      auditLogEngine.emitCommerceEvent(
        'inventory.released',
        'inventory',
        orderId,
        { orderId, orderNumber, reason, releasedCount },
        'system',
        orderNumber
      );

      return { success: true, releasedCount };
    });
  }

  /**
   * COMMIT RESERVATION AS SOLD
   * When order payment is captured and fulfilled.
   */
  public async commitSold(orderId: string): Promise<boolean> {
    return store.executeTransaction(async () => {
      for (const [resId, res] of store.inventoryReservations.entries()) {
        if (res.orderId === orderId && res.status === 'active') {
          const inv = store.inventory.get(res.sku);
          if (inv) {
            inv.reservedQuantity = Math.max(0, inv.reservedQuantity - res.quantity);
            inv.soldQuantity += res.quantity;
            inv.updatedAt = new Date().toISOString();
            store.inventory.set(res.sku, inv);
          }
          res.status = 'fulfilled';
          store.inventoryReservations.set(resId, res);
        }
      }
      return true;
    });
  }

  /**
   * HANDLE RETURN STOCK DISPOSITION
   * Controlled restocking based on quality inspection.
   */
  public async handleReturnDisposition(
    sku: string,
    quantity: number,
    disposition: StockDisposition,
    returnId: string,
    orderNumber: string
  ): Promise<{ success: boolean; newAvailable: number }> {
    return store.executeTransaction(async () => {
      const inv = store.inventory.get(sku);
      if (!inv) {
        throw new Error(`SKU ${sku} not found for return disposition.`);
      }

      if (disposition === 'Restock') {
        // Restock to available physical inventory
        inv.availableQuantity += quantity;
        inv.soldQuantity = Math.max(0, inv.soldQuantity - quantity);
        inv.isOutOfStock = inv.availableQuantity <= 0;
        inv.isLowStock = inv.availableQuantity <= inv.lowStockThreshold;

        store.inventoryEvents.push({
          id: `invevt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sku,
          variantId: inv.variantId,
          eventType: 'stock.returned',
          quantityChanged: quantity,
          availableAfter: inv.availableQuantity,
          reservedAfter: inv.reservedQuantity,
          referenceId: returnId,
          actor: 'admin_user',
          note: `Restocked ${quantity} units after passing pristine quality check`,
          timestamp: new Date().toISOString(),
        });
      } else if (disposition === 'Damaged') {
        // Quarantined into damaged inventory, do NOT restock to available
        inv.damagedQuantity += quantity;
        inv.soldQuantity = Math.max(0, inv.soldQuantity - quantity);

        store.inventoryEvents.push({
          id: `invevt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sku,
          variantId: inv.variantId,
          eventType: 'stock.damaged',
          quantityChanged: 0,
          availableAfter: inv.availableQuantity,
          reservedAfter: inv.reservedQuantity,
          referenceId: returnId,
          actor: 'admin_user',
          note: `Quarantined ${quantity} units as damaged in return ${returnId}`,
          timestamp: new Date().toISOString(),
        });
      }

      inv.updatedAt = new Date().toISOString();
      store.inventory.set(sku, inv);

      auditLogEngine.logAudit({
        entityType: 'Inventory',
        entityId: inv.id,
        referenceCode: orderNumber,
        action: `RETURN_DISPOSITION_${disposition.toUpperCase()}`,
        newState: `Available: ${inv.availableQuantity}, Damaged: ${inv.damagedQuantity}`,
        actor: 'Quality Inspector',
        reason: `Processed return ${returnId} with disposition ${disposition}`,
      });

      return { success: true, newAvailable: inv.availableQuantity };
    });
  }
}

export const inventoryEngine = new InventoryEngine();
