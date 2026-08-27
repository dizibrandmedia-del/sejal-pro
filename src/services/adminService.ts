import { apiClient } from './apiClient';
import { AdminUser, ProductType, CustomAttribute, CouponRule, Campaign, BulkValidationResult } from '../types/admin';
import { Product, Category, Collection, Brand } from '../types/product';
import { HomepageSection, Banner, LandingPage, EditorialArticle, MediaAsset } from '../types/cms';

export class AdminService {
  // Auth
  public async login(email: string, password: string) {
    const res = await apiClient.post<any>('/admin/auth/login', { email, password });
    return res.data;
  }

  public async verify2FA(tempToken: string, code: string) {
    const res = await apiClient.post<any>('/admin/auth/verify-2fa', { tempToken, code });
    return res.data;
  }

  public async getStaffUsers(): Promise<AdminUser[]> {
    const res = await apiClient.get<AdminUser[]>('/admin/auth/users');
    return res.data;
  }

  public async createStaffUser(user: { name: string; email: string; role: string }) {
    const res = await apiClient.post<AdminUser>('/admin/auth/users', user);
    return res.data;
  }

  public async updateStaffRole(id: string, newRole: string, actor?: string) {
    const res = await apiClient.patch<AdminUser>(`/admin/auth/users/${id}/role`, { newRole, actor });
    return res.data;
  }

  // Dashboard Analytics
  public async getDashboardAnalytics() {
    const res = await apiClient.get<any>('/analytics/dashboard');
    return res.data;
  }

  // Products
  public async getProducts(filters?: Record<string, string>): Promise<Product[]> {
    const res = await apiClient.get<Product[]>('/catalogue/products', filters);
    return res.data;
  }

  public async getProductById(id: string): Promise<Product> {
    const res = await apiClient.get<Product>(`/catalogue/products/${id}`);
    return res.data;
  }

  public async createProduct(product: Partial<Product>, actor?: string) {
    const res = await apiClient.post<Product>('/catalogue/products', { product, actor });
    return res.data;
  }

  public async updateProduct(id: string, updates: Partial<Product>, actor?: string) {
    const res = await apiClient.patch<Product>(`/catalogue/products/${id}`, { updates, actor });
    return res.data;
  }

  public async duplicateProduct(id: string, actor?: string) {
    const res = await apiClient.post<Product>(`/catalogue/products/${id}/duplicate`, { actor });
    return res.data;
  }

  public async deleteProduct(id: string, actor?: string) {
    const res = await fetch(`/api/catalogue/products/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor }),
    });
    return res.json();
  }

  // Product Types & Custom Attributes
  public async getProductTypes(): Promise<ProductType[]> {
    const res = await apiClient.get<ProductType[]>('/catalogue/product-types');
    return res.data;
  }

  public async createProductType(payload: any) {
    const res = await apiClient.post<ProductType>('/catalogue/product-types', payload);
    return res.data;
  }

  public async getAttributes(): Promise<CustomAttribute[]> {
    const res = await apiClient.get<CustomAttribute[]>('/catalogue/attributes');
    return res.data;
  }

  public async createAttribute(payload: any) {
    const res = await apiClient.post<CustomAttribute>('/catalogue/attributes', payload);
    return res.data;
  }

  // Categories & Collections
  public async getCategories(): Promise<Category[]> {
    const res = await apiClient.get<Category[]>('/catalogue/categories');
    return res.data;
  }

  public async createCategory(category: Partial<Category>, actor?: string) {
    const res = await apiClient.post<Category>('/catalogue/categories', { category, actor });
    return res.data;
  }

  public async getCollections(): Promise<Collection[]> {
    const res = await apiClient.get<Collection[]>('/catalogue/collections');
    return res.data;
  }

  public async createCollection(collection: Partial<Collection>, actor?: string) {
    const res = await apiClient.post<Collection>('/catalogue/collections', { collection, actor });
    return res.data;
  }

  // Media Library
  public async getMedia(params?: Record<string, string>): Promise<MediaAsset[]> {
    const res = await apiClient.get<MediaAsset[]>('/catalogue/media', params);
    return res.data;
  }

  public async uploadMedia(asset: Partial<MediaAsset>) {
    const res = await apiClient.post<MediaAsset>('/catalogue/media', asset);
    return res.data;
  }

  // CMS Homepage Sections
  public async getHomepageSections(includeAll: boolean = true): Promise<HomepageSection[]> {
    const res = await apiClient.get<HomepageSection[]>('/cms/homepage/sections', { includeAll: String(includeAll) });
    return res.data;
  }

  public async updateHomepageSection(id: string, updates: Partial<HomepageSection>, actor?: string) {
    const res = await apiClient.patch<HomepageSection>(`/cms/homepage/sections/${id}`, { updates, actor });
    return res.data;
  }

  public async reorderHomepageSections(orderedIds: string[], actor?: string) {
    const res = await apiClient.post<HomepageSection[]>('/cms/homepage/sections/reorder', { orderedIds, actor });
    return res.data;
  }

  // Banners
  public async getBanners(activeOnly?: boolean): Promise<Banner[]> {
    const res = await apiClient.get<Banner[]>('/cms/banners', activeOnly ? { activeOnly: 'true' } : undefined);
    return res.data;
  }

  public async createBanner(banner: Partial<Banner>, actor?: string) {
    const res = await apiClient.post<Banner>('/cms/banners', { banner, actor });
    return res.data;
  }

  // Landing Pages
  public async getLandingPages(): Promise<LandingPage[]> {
    const res = await apiClient.get<LandingPage[]>('/cms/landing-pages');
    return res.data;
  }

  public async getLandingPage(slug: string): Promise<LandingPage> {
    const res = await apiClient.get<LandingPage>(`/cms/landing-pages/${slug}`);
    return res.data;
  }

  public async createLandingPage(landingPage: Partial<LandingPage>, actor?: string) {
    const res = await apiClient.post<LandingPage>('/cms/landing-pages', { landingPage, actor });
    return res.data;
  }

  // Editorials
  public async getEditorials(): Promise<EditorialArticle[]> {
    const res = await apiClient.get<EditorialArticle[]>('/cms/editorials');
    return res.data;
  }

  public async createEditorial(article: Partial<EditorialArticle>, actor?: string) {
    const res = await apiClient.post<EditorialArticle>('/cms/editorials', { article, actor });
    return res.data;
  }

  // Marketing Coupons & Campaigns
  public async getCoupons(): Promise<CouponRule[]> {
    const res = await apiClient.get<CouponRule[]>('/marketing/coupons');
    return res.data;
  }

  public async createCoupon(coupon: Partial<CouponRule>, actor?: string) {
    const res = await apiClient.post<CouponRule>('/marketing/coupons', { coupon, actor });
    return res.data;
  }

  public async getCampaigns(): Promise<Campaign[]> {
    const res = await apiClient.get<Campaign[]>('/marketing/campaigns');
    return res.data;
  }

  public async createCampaign(campaign: Partial<Campaign>, actor?: string) {
    const res = await apiClient.post<Campaign>('/marketing/campaigns', { campaign, actor });
    return res.data;
  }

  // Bulk Operations
  public async validateCSV(rows: any[]): Promise<BulkValidationResult> {
    const res = await apiClient.post<BulkValidationResult>('/bulk/import/validate', { rows });
    return res.data;
  }

  public async applyCSV(validRows: any[], actor?: string) {
    const res = await apiClient.post<any>('/bulk/import/apply', { validRows, actor });
    return res.data;
  }

  public async bulkEdit(params: { productIds: string[]; priceAdjustmentMultiplier?: number; category?: string; availability?: string; isSignature?: boolean; actor?: string }) {
    const res = await apiClient.post<any>('/bulk/edit', params);
    return res.data;
  }

  // Audit Logs
  public async getAuditLogs() {
    const res = await apiClient.get<any>('/simulator/audit-events');
    return res.data;
  }
}

export const adminService = new AdminService();
