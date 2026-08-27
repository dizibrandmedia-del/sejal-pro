import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerProfile, AuthState } from '../types/customer';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  authState: AuthState;
  customer: CustomerProfile | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string) => Promise<void>;
  register: (name: string, email: string, phone: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => authService.getStoredAuthState());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { showToast } = useToast();

  const login = async (emailOrPhone: string) => {
    const newState = await authService.login(emailOrPhone);
    setAuthState(newState);
    setIsAuthModalOpen(false);
    showToast(
      'Welcome to SEJAL Privé',
      `Delighted to have you with us, ${newState.customer?.firstName}.`,
      'luxury'
    );
  };

  const register = async (name: string, email: string, phone: string) => {
    const newState = await authService.register(name, email, phone);
    setAuthState(newState);
    setIsAuthModalOpen(false);
    showToast(
      'Welcome to Maison SEJAL',
      'Your Privé account has been created with complimentary 1,000 welcome points.',
      'luxury'
    );
  };

  const logout = () => {
    const emptyState = authService.logout();
    setAuthState(emptyState);
    showToast('Signed Out', 'You have been securely signed out.', 'info');
  };

  const updateProfile = (updates: Partial<CustomerProfile>) => {
    try {
      const updated = authService.updateProfile(updates);
      setAuthState((prev) => ({ ...prev, customer: updated }));
      showToast('Profile Updated', 'Your preferences have been saved.', 'success');
    } catch {
      showToast('Error', 'Unable to update profile.', 'error');
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        authState,
        customer: authState.customer,
        isAuthenticated: authState.isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
