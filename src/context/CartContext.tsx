import React, { createContext, useContext, useState } from 'react';
import { Cart, GiftPackagingOption } from '../types/cart';
import { Product, ProductVariant } from '../types/product';
import { cartService } from '../services/cartService';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Cart;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number,
    selectedOptions?: Record<string, string>,
    showDrawerAfter?: boolean
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  setGiftPackaging: (giftPackaging: GiftPackagingOption) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => cartService.getInitialCart());
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { showToast } = useToast();

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = (
    product: Product,
    variant?: ProductVariant,
    quantity: number = 1,
    selectedOptions: Record<string, string> = {},
    showDrawerAfter: boolean = true
  ) => {
    const targetVariant = variant || product.variants[0];
    if (!targetVariant) return;

    const updated = cartService.addItem(cart, product, targetVariant, quantity, selectedOptions);
    setCart(updated);

    showToast(
      'Added to Your Selection',
      `${product.name} (${targetVariant.title}) has been placed in your bag.`,
      'luxury'
    );

    if (showDrawerAfter) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const updated = cartService.updateQuantity(cart, itemId, quantity);
    setCart(updated);
  };

  const removeItem = (itemId: string) => {
    const updated = cartService.removeItem(cart, itemId);
    setCart(updated);
    showToast('Selection Updated', 'Item removed from your bag.', 'info');
  };

  const setGiftPackaging = (giftPackaging: GiftPackagingOption) => {
    const updated = cartService.setGiftPackaging(cart, giftPackaging);
    setCart(updated);
    if (giftPackaging.enabled) {
      showToast('The Art of Gifting Added', 'Signature rose gold ribbon box & personalized card included.', 'luxury');
    }
  };

  const applyCoupon = (code: string) => {
    const result = cartService.applyCoupon(cart, code);
    setCart(result.cart);
    showToast(
      result.success ? 'Privé Code Applied' : 'Privé Code',
      result.message,
      result.success ? 'luxury' : 'error'
    );
  };

  const removeCoupon = () => {
    const updated = cartService.removeCoupon(cart);
    setCart(updated);
    showToast('Code Removed', 'Privé invitation code removed.', 'info');
  };

  const clearCart = () => {
    const empty = cartService.clearCart();
    setCart(empty);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        addToCart,
        updateQuantity,
        removeItem,
        setGiftPackaging,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
