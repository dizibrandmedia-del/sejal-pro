import { Order, OrderStatus } from '../types/order';
import { Cart } from '../types/cart';
import { Address } from '../types/customer';
import { apiClient } from './apiClient';

export class OrderService {
  /**
   * CREATE REAL SERVER-SIDE COMMERCE ORDER
   */
  public async createServerOrder(
    cart: Cart,
    customer: { name: string; email: string; phone: string; id?: string },
    shippingAddress: Address,
    shippingMethod: any,
    paymentMethod: any,
    currency: string,
    currencyRate: number
  ): Promise<Order> {
    const payload = {
      customer,
      items: cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      shippingAddress,
      shippingMethod,
      giftPackaging: cart.giftPackaging,
      couponCode: cart.appliedCoupon?.code,
      currency,
      currencyRate,
      paymentMethod,
    };

    const res = await apiClient.createServerOrder(payload);
    return res.data;
  }

  /**
   * GET ALL ORDERS
   */
  public async getOrders(customerEmail?: string): Promise<Order[]> {
    try {
      const res = await apiClient.getOrders(customerEmail);
      return res.data;
    } catch {
      return [];
    }
  }

  /**
   * GET SINGLE ORDER BY ID OR ORDER NUMBER
   */
  public async getOrderById(id: string): Promise<Order | null> {
    try {
      const res = await apiClient.getOrderById(id);
      return res.data;
    } catch {
      return null;
    }
  }

  /**
   * CANCEL ORDER
   */
  public async cancelOrder(orderId: string, reason: string): Promise<Order> {
    const res = await apiClient.cancelOrder(orderId, reason);
    return res.data;
  }

  /**
   * GET TRACKING DETAILS
   */
  public async getOrderTracking(orderId: string): Promise<any> {
    const res = await apiClient.trackOrder(orderId);
    return res.data;
  }
}

export const orderService = new OrderService();
