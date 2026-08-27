import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'sejal_pro_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default: seed with 2 favorite items
    return ['prod-1', 'prod-6'];
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = (productId: string) => {
    const product = productService.getProductById(productId);
    if (isInWishlist(productId)) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from Wishlist', `${product?.name || 'Item'} has been removed.`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      showToast(
        'Added to Wishlist',
        `${product?.name || 'Item'} has been saved to your curated wishlist.`,
        'luxury'
      );
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const allProducts = productService.getAllProducts();
  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
