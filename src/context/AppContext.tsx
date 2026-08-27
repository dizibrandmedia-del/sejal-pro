import React from 'react';
import { CurrencyProvider } from './CurrencyContext';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import { WishlistProvider } from './WishlistContext';
import { CartProvider } from './CartContext';
import { AdminAuthProvider } from './AdminAuthContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <CurrencyProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <AdminAuthProvider>
                {children}
              </AdminAuthProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ToastProvider>
  );
};
