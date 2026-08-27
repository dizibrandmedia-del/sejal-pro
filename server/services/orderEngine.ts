import { store } from '../db/store';
import { Order, OrderStatus, OrderItem } from '../../src/types/order';
import { auditLogEngine } from './auditLogEngine';
import { notificationEngine } from './notificationEngine';
import { inventoryEngine } from './inventoryEngine';
import { MOCK_PRODUCTS } from '../../src/data/mockProducts';

/**
 * Valid state transitions definition from Master PRD v2.0
 */
const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  'Payment Pending': ['Confirmed', 'Cancelled'],
  'Confirmed': ['Processing', 'Cancelled'],
  'Processing': ['Quality Check', 'Cancelled'],
  'Quality Check': ['Packed', 'Cancelled'],
  'Packed': ['Ready to Ship', 'Cancelled'],
  'Ready to Ship': ['Pickup Scheduled', 'Picked Up', 'Shipped', 'Cancelled'],
  'Pickup Scheduled': ['Picked Up', 'Shipped', 'Cancelled'],
  'Picked Up': ['Shipped', 'In Transit', 'RTO'],
  'Shipped': ['In Transit', 'Out for Delivery', 'RTO'],
  'In Transit': ['Out for Delivery', 'Delivered', 'RTO'],
  'Out for Delivery': ['Delivered', 'RTO'],
  'Delivered': ['Returned', 'Refunded'],
  'Cancelled': [], // Terminal
  'RTO': ['Returned', 'Refunded'],
  'Returned': ['Refunded'],
  'Refunded': [], // Terminal
};

export class OrderEngine {
  /**
   * Create an authoritative server-side order with inventory reservation.
   * Client totals are NEVER trusted.
   */
  public async createOrder(payload: {
    customer: { name: string; email: string; phone: string; id?: string };
    items: Array<{ productId: string; variantId: string; quantity: number }>;
    shippingAddress: any;
    shippingMethod: any;
    giftPackaging: any;
    couponCode?: string;
    currency: string;
    currencyRate: number;
    paymentMethod: any;
  }): Promise<{ order: Order; reservationId: string }> {
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const orderNumber = store.generateNextOrderNumber();

    // 1. Authoritatively calculate item prices from master catalog
    const orderItems: OrderItem[] = [];
    let subtotalINR = 0;
    const reservationItems: Array<{ sku: string; variantId: string; quantity: number }> = [];

    for (const itemReq of payload.items) {
      const product = MOCK_PRODUCTS.find((p) => p.id === itemReq.productId);
      if (!product) {
        throw new Error(`Product ${itemReq.productId} does not exist.`);
      }

      const variant = product.variants.find((v) => v.id === itemReq.variantId) || product.variants[0];
      const priceINR = variant.priceINR || product.basePriceINR;
      const totalINR = priceINR * itemReq.quantity;

      subtotalINR += totalINR;
      reservationItems.push({ sku: variant.sku, variantId: variant.id, quantity: itemReq.quantity });

      orderItems.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        productSlug: product.slug,
        sku: variant.sku,
        selectedOptionsText: variant.title,
        imageUrl: product.media[0]?.url || '',
        priceINR,
        quantity: itemReq.quantity,
        totalINR,
      });
    }

    // 2. Authoritatively calculate discounts
    let discountINR = 0;
    if (payload.couponCode) {
      const code = payload.couponCode.trim().toUpperCase();
      if (code === 'PRIVEVIP') {
        discountINR = Math.round(subtotalINR * 0.15); // 15% VIP discount
      } else if (code === 'SEJALHERITAGE') {
        discountINR = 15000;
      }
    }

    // 3. Calculate shipping and packaging
    const shippingINR = payload.shippingMethod?.priceINR || 0;
    const packagingINR = 0; // Complimentary signature packaging
    const taxINR = 0; // Taxes included in luxury base prices
    const totalINR = Math.max(0, subtotalINR - discountINR + shippingINR + packagingINR + taxINR);

    const exchangeRateUsed = payload.currencyRate || 1;
    const totalInCurrency = Math.round(totalINR * exchangeRateUsed);

    // 4. Atomically Reserve Inventory
    const reserveResult = await inventoryEngine.reserveStock(reservationItems, orderId, orderNumber);
    if (!reserveResult.success) {
      throw new Error(reserveResult.error || 'Inventory reservation failed. Stock depleted.');
    }

    // 5. Create Order Record
    const order: Order = {
      id: orderId,
      orderNumber,
      customerId: payload.customer.id,
      customerEmail: payload.customer.email,
      customerPhone: payload.customer.phone,
      customerName: payload.customer.name,
      items: orderItems,
      shippingAddress: payload.shippingAddress,
      shippingMethod: payload.shippingMethod,
      giftPackaging: payload.giftPackaging,
      subtotalINR,
      discountINR,
      shippingINR,
      taxINR,
      packagingINR,
      totalINR,
      currencyUsed: payload.currency,
      exchangeRateUsed,
      totalInCurrency,
      paymentMethod: payload.paymentMethod || 'razorpay',
      paymentStatus: 'Payment Pending',
      orderStatus: 'Payment Pending',
      statusHistory: [
        {
          status: 'Payment Pending',
          timestamp: new Date().toISOString(),
          actor: 'system',
          note: 'Order created and inventory reserved. Awaiting payment authorization.',
        },
      ],
      inventoryReservationId: reserveResult.reservationId,
      returnIds: [],
      refundIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    store.orders.set(orderId, order);

    auditLogEngine.logAudit({
      entityType: 'Order',
      entityId: orderId,
      referenceCode: orderNumber,
      action: 'ORDER_CREATED',
      newState: 'Payment Pending',
      actor: payload.customer.email,
      reason: `Created order with ${orderItems.length} items, Total: ₹${totalINR.toLocaleString('en-IN')}`,
    });

    auditLogEngine.emitCommerceEvent(
      'order.created',
      'order',
      orderId,
      { orderNumber, totalINR, customerEmail: payload.customer.email },
      'customer',
      orderNumber
    );

    return { order, reservationId: reserveResult.reservationId! };
  }

  /**
   * Transition order to a new status using the Strict PRD State Machine
   */
  public async transitionOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    actor: 'customer' | 'admin_user' | 'system' | 'razorpay_webhook' | 'carrier_webhook',
    note?: string
  ): Promise<Order> {
    const order = store.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found.`);
    }

    const currentStatus = order.orderStatus;

    // Validate State Transition
    const allowed = ALLOWED_ORDER_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Invalid state transition: Cannot transition order ${order.orderNumber} from "${currentStatus}" to "${newStatus}". Allowed transitions: [${allowed.join(', ')}]`
      );
    }

    // Apply Transition
    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      actor,
      note,
    });

    // Special status handlers
    if (newStatus === 'Confirmed') {
      order.paymentStatus = 'Captured';
    } else if (newStatus === 'Delivered') {
      order.actualDeliveryDate = new Date().toISOString();
      await inventoryEngine.commitSold(order.id);
    }

    store.orders.set(orderId, order);

    // Audit and Commerce Event dispatch
    auditLogEngine.logAudit({
      entityType: 'Order',
      entityId: orderId,
      referenceCode: order.orderNumber,
      action: 'ORDER_STATUS_CHANGED',
      previousState: currentStatus,
      newState: newStatus,
      actor,
      reason: note,
    });

    // Map order status to commerce event type
    const eventTypeMap: Partial<Record<OrderStatus, any>> = {
      Confirmed: 'order.confirmed',
      Processing: 'order.processing',
      'Quality Check': 'order.quality_checked',
      Packed: 'order.packed',
      'Ready to Ship': 'order.ready_to_ship',
      'Pickup Scheduled': 'order.pickup_scheduled',
      'Picked Up': 'order.picked_up',
      Shipped: 'order.shipped',
      'In Transit': 'order.in_transit',
      'Out for Delivery': 'order.out_for_delivery',
      Delivered: 'order.delivered',
      Cancelled: 'order.cancelled',
    };

    const commerceEvent = eventTypeMap[newStatus];
    if (commerceEvent) {
      auditLogEngine.emitCommerceEvent(
        commerceEvent,
        'order',
        orderId,
        { orderNumber: order.orderNumber, previousStatus: currentStatus, newStatus, note },
        actor,
        order.orderNumber
      );

      // Dispatch Luxury Notification to Customer
      await notificationEngine.notifyOrderEvent(order, commerceEvent, note);
    }

    return order;
  }

  /**
   * Get order by ID or Order Number
   */
  public getOrder(identifier: string): Order | undefined {
    if (store.orders.has(identifier)) {
      return store.orders.get(identifier);
    }
    for (const order of store.orders.values()) {
      if (order.orderNumber === identifier) {
        return order;
      }
    }
    return undefined;
  }

  /**
   * List all orders (optionally filtered by customer email)
   */
  public listOrders(customerEmail?: string): Order[] {
    let list = Array.from(store.orders.values());
    if (customerEmail) {
      list = list.filter((o) => o.customerEmail.toLowerCase() === customerEmail.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const orderEngine = new OrderEngine();
