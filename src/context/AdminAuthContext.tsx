import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminPermission } from '../types/admin';
import { adminService } from '../services/adminService';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  requires2FA: boolean;
  tempToken: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  verify2FA: (code: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: AdminPermission) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'sejal_admin_session';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default Super Admin session for immediate developer access in testing
    return {
      id: 'usr_super_admin',
      email: 'sejal@sejal.pro',
      name: 'Sejal Gupta (Founder & Head of Maison)',
      role: 'Super Admin',
      permissions: [
        'dashboard:view',
        'products:read',
        'products:write',
        'products:publish',
        'products:delete',
        'pricing:edit',
        'pricing:view_cost',
        'product_types:manage',
        'attributes:manage',
        'categories:manage',
        'collections:manage',
        'brands:manage',
        'media:manage',
        'homepage:manage',
        'banners:manage',
        'landing_pages:manage',
        'editorial:manage',
        'seo:manage',
        'coupons:manage',
        'campaigns:manage',
        'inventory:view',
        'inventory:adjust',
        'orders:view',
        'orders:manage',
        'orders:cancel',
        'payments:view',
        'payments:reconcile',
        'shipping:view',
        'shipping:manage',
        'returns:view',
        'returns:quality_check',
        'refunds:issue',
        'customers:view',
        'customers:manage',
        'concierge:manage',
        'bulk:import',
        'bulk:export',
        'bulk:edit',
        'rbac:manage',
        'audit:view',
        'settings:manage',
      ],
      isActive: true,
      twoFactorEnabled: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-27T00:00:00Z',
    };
  });

  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await adminService.login(email, pass);
      if (res.requires2FA) {
        setRequires2FA(true);
        setTempToken(res.tempToken);
        return false;
      }

      setAdminUser(res.user);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(res.user));
      return true;
    } catch (err: any) {
      throw new Error(err.message || 'Administrative sign in failed.');
    }
  };

  const verify2FA = async (code: string): Promise<boolean> => {
    if (!tempToken) throw new Error('No active 2FA session.');
    try {
      const res = await adminService.verify2FA(tempToken, code);
      setAdminUser(res.user);
      setRequires2FA(false);
      setTempToken(null);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(res.user));
      return true;
    } catch (err: any) {
      throw new Error(err.message || '2FA code verification failed.');
    }
  };

  const logout = () => {
    setAdminUser(null);
    setRequires2FA(false);
    setTempToken(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!adminUser || !adminUser.isActive) return false;
    if (adminUser.role === 'Super Admin') return true;
    return adminUser.permissions.includes(permission);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        requires2FA,
        tempToken,
        login,
        verify2FA,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
