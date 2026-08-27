/**
 * SEJAL.PRO — Phase 3 Admin & RBAC Domain Models
 * Structured, operational, role-based access control and catalogue builders.
 */

export type AdminRole =
  | 'Super Admin'
  | 'Product Manager'
  | 'Order Manager'
  | 'Marketing Manager'
  | 'Content Manager'
  | 'Customer Concierge';

export type AdminPermission =
  | 'dashboard:view'
  | 'products:read'
  | 'products:write'
  | 'products:publish'
  | 'products:delete'
  | 'pricing:edit'
  | 'pricing:view_cost'
  | 'product_types:manage'
  | 'attributes:manage'
  | 'categories:manage'
  | 'collections:manage'
  | 'brands:manage'
  | 'media:manage'
  | 'homepage:manage'
  | 'banners:manage'
  | 'landing_pages:manage'
  | 'editorial:manage'
  | 'seo:manage'
  | 'coupons:manage'
  | 'campaigns:manage'
  | 'inventory:view'
  | 'inventory:adjust'
  | 'orders:view'
  | 'orders:manage'
  | 'orders:cancel'
  | 'payments:view'
  | 'payments:reconcile'
  | 'shipping:view'
  | 'shipping:manage'
  | 'returns:view'
  | 'returns:quality_check'
  | 'refunds:issue'
  | 'customers:view'
  | 'customers:manage'
  | 'concierge:manage'
  | 'bulk:import'
  | 'bulk:export'
  | 'bulk:edit'
  | 'rbac:manage'
  | 'audit:view'
  | 'settings:manage';

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  'Super Admin': [
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
  'Product Manager': [
    'dashboard:view',
    'products:read',
    'products:write',
    'products:publish',
    'products:delete',
    'pricing:edit',
    'product_types:manage',
    'attributes:manage',
    'categories:manage',
    'collections:manage',
    'brands:manage',
    'media:manage',
    'inventory:view',
    'inventory:adjust',
    'bulk:import',
    'bulk:export',
    'bulk:edit',
    'audit:view',
  ],
  'Order Manager': [
    'dashboard:view',
    'orders:view',
    'orders:manage',
    'orders:cancel',
    'shipping:view',
    'shipping:manage',
    'returns:view',
    'returns:quality_check',
    'inventory:view',
    'customers:view',
    'bulk:export',
    'audit:view',
  ],
  'Marketing Manager': [
    'dashboard:view',
    'coupons:manage',
    'campaigns:manage',
    'collections:manage',
    'banners:manage',
    'landing_pages:manage',
    'editorial:manage',
    'media:manage',
    'seo:manage',
    'customers:view',
    'bulk:export',
    'audit:view',
  ],
  'Content Manager': [
    'dashboard:view',
    'homepage:manage',
    'banners:manage',
    'landing_pages:manage',
    'editorial:manage',
    'media:manage',
    'seo:manage',
    'audit:view',
  ],
  'Customer Concierge': [
    'dashboard:view',
    'customers:view',
    'customers:manage',
    'concierge:manage',
    'orders:view',
    'shipping:view',
    'returns:view',
    'audit:view',
  ],
};

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttributeFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multi-select'
  | 'boolean'
  | 'measurement'
  | 'size'
  | 'colour'
  | 'date';

export interface AttributeOption {
  id: string;
  label: string;
  value: string;
  hexColor?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CustomAttribute {
  id: string;
  code: string;                         // e.g. "gemstone_cut", "heel_height"
  label: string;                        // e.g. "Gemstone Cut", "Heel Height"
  fieldType: AttributeFieldType;
  description?: string;
  options?: AttributeOption[];          // For select, multi-select, size, colour
  unit?: string;                        // e.g. "carats", "mm", "ml", "cm"
  isRequired: boolean;
  isVisibleOnProductPage: boolean;
  isFilterable: boolean;
  isSearchable: boolean;
  isVariantDefining: boolean;
  isInternalOnly: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  id: string;
  code: string;                         // e.g. "high-jewellery", "perfume", "handbags", "shoes"
  name: string;                         // e.g. "High Haute Joaillerie", "Haute Parfumerie"
  description: string;
  attributeIds: string[];               // Associated CustomAttributes
  variantAttributeIds: string[];        // Attributes that can define product variants
  hasVariants: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DiscountType = 'percentage' | 'fixed_amount';

export interface CouponRule {
  id: string;
  code: string;                         // e.g. "PRIVE20", "ROYAL10"
  description: string;
  discountType: DiscountType;
  discountValue: number;                // e.g. 20 for 20%, or 25000 for ₹25,000
  currency: string;                     // Usually INR or applicable to all
  minCartValueINR: number;
  maxDiscountINR?: number;              // Cap for percentage discounts
  totalUsageLimit?: number;
  usageCount: number;
  perCustomerLimit: number;
  startDate: string;
  endDate: string;
  eligibleProductIds?: string[];
  eligibleCategoryIds?: string[];
  eligibleCountries?: string[];
  allowStacking: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'expired' | 'disabled';

export interface Campaign {
  id: string;
  code: string;
  name: string;                         // e.g. "The Royal Diwali Edit 2026"
  description: string;
  landingPageSlug?: string;
  collectionSlug?: string;
  featuredProductIds: string[];
  bannerId?: string;
  couponCode?: string;
  targetAudience: string;               // e.g. "All Clients", "VIP Privé", "UAE Luxury"
  utmCampaignTag: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    minSpendINR?: number;
    minOrders?: number;
    priveTiers?: string[];
    countries?: string[];
    preferredCategories?: string[];
  };
  customerCount: number;
  updatedAt: string;
}

export interface BulkValidationRowError {
  rowNumber: number;
  sku?: string;
  field: string;
  message: string;
}

export interface BulkValidationResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: BulkValidationRowError[];
  warnings: string[];
  previewData: any[];
  canImport: boolean;
}
