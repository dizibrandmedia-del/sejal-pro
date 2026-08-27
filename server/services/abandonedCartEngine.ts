/**
 * SEJAL.PRO — Phase 5 Abandoned Cart Recovery Engine
 * Dedicated Luxury Abandoned Selection Manager with Real-Time Purchase Suppression.
 */

import { store } from '../db/store';
import { automationEngine } from './automationEngine';
import { crmEngine } from './crmEngine';
import { omniNotificationEngine } from './omniNotificationEngine';
import { auditLogEngine } from './auditLogEngine';

export class AbandonedCartEngine {
  /**
   * RECORD ABANDONED CART SIGNAL
   * Evaluates cart rules and enrolls customer in quiet recovery workflow if eligible.
   */
  public async handleAbandonedCart(payload: {
    customer: { id?: string; email: string; phone?: string; name: string };
    cart: {
      items: Array<{ productId: string; productName: string; sku: string; priceINR: number; quantity: number }>;
      subtotalINR: number;
    };
    sessionId: string;
  }): Promise<{ status: 'enrolled' | 'suppressed'; reason?: string }> {
    const { customer, cart, sessionId } = payload;

    // 1. Check if customer already placed an order after or with this cart
    const recentOrders = Array.from(store.orders.values()).filter(
      (o) => o.customerEmail.toLowerCase() === customer.email.toLowerCase() &&
             Date.now() - new Date(o.createdAt).getTime() < 30 * 60 * 1000 // Last 30 mins
    );

    if (recentOrders.length > 0) {
      return { status: 'suppressed', reason: 'Customer already completed purchase.' };
    }

    // 2. Check if product is in stock
    const primaryItem = cart.items[0];
    if (!primaryItem) {
      return { status: 'suppressed', reason: 'Empty cart.' };
    }

    const inventoryItem = store.inventory.get(primaryItem.sku);
    if (inventoryItem && inventoryItem.availableQuantity <= 0) {
      return { status: 'suppressed', reason: 'Item out of stock in vault.' };
    }

    // 3. Update customer CRM profile with cart products
    const crmProfile = crmEngine.getCustomer360(customer.email);
    if (crmProfile) {
      crmProfile.cartProductIds = cart.items.map((i) => i.productId);
      store.crmProfiles.set(crmProfile.id, crmProfile);
    }

    // 4. Record Activity Timeline
    crmEngine.recordTimelineEvent({
      customerId: customer.id || customer.email,
      customerEmail: customer.email,
      eventType: 'cart_abandoned',
      title: 'Cart Selection Awaiting Checkout',
      description: `${primaryItem.productName} (Total: ₹${cart.subtotalINR.toLocaleString('en-IN')})`,
      metadata: { cartItemsCount: cart.items.length, subtotalINR: cart.subtotalINR },
      channel: 'storefront',
    });

    // 5. Trigger Workflow with Idempotency Key (Customer + Session + Date)
    const triggerEventId = `cart_ab_${customer.email}_${new Date().toISOString().slice(0, 10)}`;
    await automationEngine.triggerWorkflow('cart_abandoned', customer, {
      triggerEventId,
      metadata: {
        product_name: primaryItem.productName,
        subtotalINR: cart.subtotalINR,
        cart_url: `https://sejal.pro/cart?resume=${sessionId}`,
      },
    });

    auditLogEngine.logAudit({
      entityType: 'Customer',
      entityId: customer.email,
      referenceCode: `CART-${sessionId}`,
      action: 'ABANDONED_CART_CAPTURED',
      actor: 'system',
      reason: `Abandoned cart captured for ₹${cart.subtotalINR} (${primaryItem.productName})`,
    });

    return { status: 'enrolled' };
  }

  /**
   * CANCEL ABANDONED CART RECOVERY WHEN PURCHASE OCCURS
   */
  public handlePurchaseCompleted(customerEmail: string, orderNumber: string) {
    // Terminate any active cart abandonment executions
    Array.from(store.workflowExecutions.values()).forEach((exec) => {
      if (
        exec.customerEmail.toLowerCase() === customerEmail.toLowerCase() &&
        (exec.status === 'active' || exec.status === 'waiting_delay')
      ) {
        exec.status = 'exited_converted';
        exec.executionHistory.push({
          stepId: 'purchase_exit',
          actionExecuted: 'Order Completed',
          result: `Customer completed order ${orderNumber}. Abandoned cart recovery terminated.`,
          timestamp: new Date().toISOString(),
        });
        store.workflowExecutions.set(exec.id, exec);
      }
    });

    // Clear cart products on CRM profile
    const crmProfile = crmEngine.getCustomer360(customerEmail);
    if (crmProfile) {
      crmProfile.cartProductIds = [];
      store.crmProfiles.set(crmProfile.id, crmProfile);
    }
  }
}

export const abandonedCartEngine = new AbandonedCartEngine();
