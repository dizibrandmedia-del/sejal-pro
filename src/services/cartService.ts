import { Cart, CartItem, GiftPackagingOption, CouponDiscount } from '../types/cart';
import { Product, ProductVariant } from '../types/product';

const CART_STORAGE_KEY = 'sejal_pro_cart_v1';

export const INITIAL_GIFT_PACKAGING: GiftPackagingOption = {
  enabled: false,
  boxType: 'signature-rose-gold',
  giftMessage: '',
  recipientName: '',
  senderName: '',
  priceINR: 0, // Complimentary in Phase 1
};

export const AVAILABLE_COUPONS: CouponDiscount[] = [
  {
    code: 'PRIVEVIP',
    discountType: 'percentage',
    amount: 10,
    description: '10% Privé Welcome Courtesy',
  },
  {
    code: 'SEJALHERITAGE',
    discountType: 'fixed',
    amount: 25000,
    description: '₹25,000 Courtesy on orders above ₹2,00,000',
    minSubtotalINR: 200000,
  },
];

class CartService {
  public getInitialCart(): Cart {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return this.recalculateCart(parsed);
      }
    } catch {
      // ignore
    }

    return {
      items: [],
      giftPackaging: { ...INITIAL_GIFT_PACKAGING },
      subtotalINR: 0,
      discountINR: 0,
      giftPackagingTotalINR: 0,
      shippingTotalINR: 0,
      estimatedTaxINR: 0,
      totalINR: 0,
      itemCount: 0,
    };
  }

  public saveCart(cart: Cart): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }

  public recalculateCart(cart: Cart): Cart {
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalINR = cart.items.reduce((sum, item) => {
      const price = item.variant?.priceINR || item.product.basePriceINR;
      return sum + price * item.quantity;
    }, 0);

    let discountINR = 0;
    if (cart.appliedCoupon) {
      if (cart.appliedCoupon.discountType === 'percentage') {
        discountINR = Math.round((subtotalINR * cart.appliedCoupon.amount) / 100);
      } else if (cart.appliedCoupon.discountType === 'fixed') {
        if (!cart.appliedCoupon.minSubtotalINR || subtotalINR >= cart.appliedCoupon.minSubtotalINR) {
          discountINR = cart.appliedCoupon.amount;
        }
      }
    }

    const giftPackagingTotalINR = cart.giftPackaging.enabled ? cart.giftPackaging.priceINR : 0;
    const shippingTotalINR = 0; // Complimentary White-Glove Shipping
    const estimatedTaxINR = Math.round((subtotalINR - discountINR) * 0.03); // 3% GST on luxury jewellery/fine goods in India
    const totalINR = Math.max(0, subtotalINR - discountINR + giftPackagingTotalINR + shippingTotalINR);

    return {
      ...cart,
      itemCount,
      subtotalINR,
      discountINR,
      giftPackagingTotalINR,
      shippingTotalINR,
      estimatedTaxINR,
      totalINR,
    };
  }

  public addItem(
    currentCart: Cart,
    product: Product,
    variant: ProductVariant,
    quantity: number = 1,
    selectedOptions: Record<string, string> = {}
  ): Cart {
    const lineId = `${product.id}_${variant.id}`;
    const existingIndex = currentCart.items.findIndex((item) => item.id === lineId);

    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      updatedItems = currentCart.items.map((item, index) =>
        index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      const newItem: CartItem = {
        id: lineId,
        productId: product.id,
        variantId: variant.id,
        product,
        variant,
        quantity,
        selectedOptions,
        addedAt: new Date().toISOString(),
      };
      updatedItems = [...currentCart.items, newItem];
    }

    const updated = this.recalculateCart({ ...currentCart, items: updatedItems });
    this.saveCart(updated);
    return updated;
  }

  public updateQuantity(currentCart: Cart, itemId: string, quantity: number): Cart {
    let updatedItems: CartItem[];
    if (quantity <= 0) {
      updatedItems = currentCart.items.filter((item) => item.id !== itemId);
    } else {
      updatedItems = currentCart.items.map((item) => (item.id === itemId ? { ...item, quantity } : item));
    }

    const updated = this.recalculateCart({ ...currentCart, items: updatedItems });
    this.saveCart(updated);
    return updated;
  }

  public removeItem(currentCart: Cart, itemId: string): Cart {
    const updatedItems = currentCart.items.filter((item) => item.id !== itemId);
    const updated = this.recalculateCart({ ...currentCart, items: updatedItems });
    this.saveCart(updated);
    return updated;
  }

  public setGiftPackaging(currentCart: Cart, giftPackaging: GiftPackagingOption): Cart {
    const updated = this.recalculateCart({ ...currentCart, giftPackaging });
    this.saveCart(updated);
    return updated;
  }

  public applyCoupon(currentCart: Cart, code: string): { cart: Cart; success: boolean; message: string } {
    const coupon = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return {
        cart: currentCart,
        success: false,
        message: 'Invalid or expired Privé invitation code.',
      };
    }

    if (coupon.minSubtotalINR && currentCart.subtotalINR < coupon.minSubtotalINR) {
      return {
        cart: currentCart,
        success: false,
        message: `This invitation code requires a minimum selection of ₹${coupon.minSubtotalINR.toLocaleString('en-IN')}.`,
      };
    }

    const updated = this.recalculateCart({ ...currentCart, appliedCoupon: coupon });
    this.saveCart(updated);
    return {
      cart: updated,
      success: true,
      message: `Privé courtesy applied: ${coupon.description}`,
    };
  }

  public removeCoupon(currentCart: Cart): Cart {
    const updated = this.recalculateCart({ ...currentCart, appliedCoupon: undefined });
    this.saveCart(updated);
    return updated;
  }

  public clearCart(): Cart {
    const empty = {
      items: [],
      giftPackaging: { ...INITIAL_GIFT_PACKAGING },
      subtotalINR: 0,
      discountINR: 0,
      giftPackagingTotalINR: 0,
      shippingTotalINR: 0,
      estimatedTaxINR: 0,
      totalINR: 0,
      itemCount: 0,
    };
    this.saveCart(empty);
    return empty;
  }
}

export const cartService = new CartService();
