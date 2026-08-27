import { store } from '../db/store';
import { CouponRule, Campaign } from '../../src/types/admin';
import { auditLogEngine } from './auditLogEngine';

export class MarketingEngine {
  // ==========================================
  // 1. DYNAMIC COUPON ENGINE
  // ==========================================

  public listCoupons(): CouponRule[] {
    return Array.from(store.coupons.values());
  }

  public getCoupon(code: string): CouponRule | undefined {
    return store.coupons.get(code.toUpperCase());
  }

  public createCoupon(params: any, actor: string = 'Marketing Manager'): CouponRule {
    const code = params.code.toUpperCase().trim();
    if (store.coupons.has(code)) {
      throw new Error(`Coupon with code "${code}" already exists.`);
    }

    const newCoupon: CouponRule = {
      id: `cpn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      code,
      description: params.description || '',
      discountType: params.discountType || 'percentage',
      discountValue: Number(params.discountValue) || 10,
      currency: params.currency || 'INR',
      minCartValueINR: Number(params.minCartValueINR) || 0,
      maxDiscountINR: params.maxDiscountINR ? Number(params.maxDiscountINR) : undefined,
      totalUsageLimit: params.totalUsageLimit ? Number(params.totalUsageLimit) : undefined,
      usageCount: 0,
      perCustomerLimit: Number(params.perCustomerLimit) || 1,
      startDate: params.startDate || new Date().toISOString(),
      endDate: params.endDate || new Date(Date.now() + 90 * 86400000).toISOString(),
      eligibleProductIds: params.eligibleProductIds,
      eligibleCategoryIds: params.eligibleCategoryIds,
      eligibleCountries: params.eligibleCountries,
      allowStacking: Boolean(params.allowStacking),
      isActive: params.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.coupons.set(newCoupon.code, newCoupon);

    auditLogEngine.logAudit({
      entityType: 'Coupon',
      entityId: newCoupon.id,
      referenceCode: newCoupon.code,
      action: 'COUPON_CREATED',
      actor,
      reason: `Created coupon ${newCoupon.code}: ${newCoupon.discountValue}${newCoupon.discountType === 'percentage' ? '%' : ' INR'} off`,
    });

    return newCoupon;
  }

  public updateCoupon(code: string, updates: Partial<CouponRule>, actor: string = 'Marketing Manager'): CouponRule {
    const coupon = store.coupons.get(code.toUpperCase());
    if (!coupon) throw new Error(`Coupon ${code} not found.`);

    Object.assign(coupon, updates, { updatedAt: new Date().toISOString() });
    store.coupons.set(coupon.code, coupon);

    auditLogEngine.logAudit({
      entityType: 'Coupon',
      entityId: coupon.id,
      referenceCode: coupon.code,
      action: 'COUPON_UPDATED',
      actor,
      reason: `Updated coupon parameters for ${coupon.code}`,
    });

    return coupon;
  }

  public deleteCoupon(code: string, actor: string = 'Marketing Manager'): boolean {
    const coupon = store.coupons.get(code.toUpperCase());
    if (!coupon) throw new Error(`Coupon ${code} not found.`);

    store.coupons.delete(code.toUpperCase());

    auditLogEngine.logAudit({
      entityType: 'Coupon',
      entityId: coupon.id,
      referenceCode: coupon.code,
      action: 'COUPON_DELETED',
      actor,
      reason: `Deleted coupon ${coupon.code}`,
    });

    return true;
  }

  /**
   * AUTHORITATIVE COUPON VALIDATION & DISCOUNT CALCULATION
   */
  public validateCouponForCart(params: {
    code: string;
    subtotalINR: number;
    items?: Array<{ productId: string; category?: string; priceINR: number; quantity: number }>;
    country?: string;
    customerEmail?: string;
  }): { isValid: boolean; discountINR: number; coupon?: CouponRule; rejectionReason?: string } {
    const coupon = store.coupons.get(params.code.toUpperCase().trim());
    if (!coupon) {
      return { isValid: false, discountINR: 0, rejectionReason: `Privé code "${params.code}" is not recognized.` };
    }

    if (!coupon.isActive) {
      return { isValid: false, discountINR: 0, rejectionReason: `Privé code "${params.code}" is currently deactivated.` };
    }

    const now = new Date().getTime();
    if (new Date(coupon.startDate).getTime() > now) {
      return { isValid: false, discountINR: 0, rejectionReason: `Privé code "${params.code}" is not active yet.` };
    }
    if (new Date(coupon.endDate).getTime() < now) {
      return { isValid: false, discountINR: 0, rejectionReason: `Privé code "${params.code}" has expired.` };
    }

    if (coupon.totalUsageLimit && coupon.usageCount >= coupon.totalUsageLimit) {
      return { isValid: false, discountINR: 0, rejectionReason: `Privé code "${params.code}" allocation has been fully claimed.` };
    }

    if (coupon.minCartValueINR > 0 && params.subtotalINR < coupon.minCartValueINR) {
      return {
        isValid: false,
        discountINR: 0,
        rejectionReason: `Minimum cart value of ₹${coupon.minCartValueINR.toLocaleString('en-IN')} required for code "${params.code}".`,
      };
    }

    if (coupon.eligibleCountries && coupon.eligibleCountries.length > 0 && params.country) {
      if (!coupon.eligibleCountries.includes(params.country)) {
        return {
          isValid: false,
          discountINR: 0,
          rejectionReason: `Privé code "${params.code}" is not applicable for destination ${params.country}.`,
        };
      }
    }

    // Calculate Discount Amount
    let discountINR = 0;
    if (coupon.discountType === 'percentage') {
      discountINR = Math.round((params.subtotalINR * coupon.discountValue) / 100);
      if (coupon.maxDiscountINR && discountINR > coupon.maxDiscountINR) {
        discountINR = coupon.maxDiscountINR;
      }
    } else {
      discountINR = Math.min(coupon.discountValue, params.subtotalINR);
    }

    return {
      isValid: true,
      discountINR,
      coupon,
    };
  }

  // ==========================================
  // 2. CAMPAIGN MANAGEMENT
  // ==========================================

  public listCampaigns(): Campaign[] {
    const now = new Date().getTime();
    const campaigns = Array.from(store.campaigns.values());

    // Evaluate dynamic active/expired status based on date
    campaigns.forEach((c) => {
      if (c.status !== 'disabled' && c.status !== 'draft') {
        if (new Date(c.startDate).getTime() > now) {
          c.status = 'scheduled';
        } else if (new Date(c.endDate).getTime() < now) {
          c.status = 'expired';
        } else {
          c.status = 'active';
        }
      }
    });

    return campaigns;
  }

  public createCampaign(params: any, actor: string = 'Marketing Manager'): Campaign {
    const id = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const code = params.code || `SEJAL-CAMP-${Date.now().toString().slice(-4)}`;

    const newCampaign: Campaign = {
      id,
      code,
      name: params.name,
      description: params.description || '',
      landingPageSlug: params.landingPageSlug,
      collectionSlug: params.collectionSlug,
      featuredProductIds: params.featuredProductIds || [],
      bannerId: params.bannerId,
      couponCode: params.couponCode,
      targetAudience: params.targetAudience || 'All Luxury Clients',
      utmCampaignTag: params.utmCampaignTag || params.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      startDate: params.startDate || new Date().toISOString(),
      endDate: params.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.campaigns.set(newCampaign.id, newCampaign);

    auditLogEngine.logAudit({
      entityType: 'Campaign',
      entityId: newCampaign.id,
      referenceCode: newCampaign.code,
      action: 'CAMPAIGN_CREATED',
      actor,
      reason: `Created campaign: ${newCampaign.name}`,
    });

    return newCampaign;
  }
}

export const marketingEngine = new MarketingEngine();
