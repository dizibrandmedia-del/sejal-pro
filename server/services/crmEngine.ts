/**
 * SEJAL.PRO — Phase 5 Customer 360 & CRM Engine
 * Unified Customer Profile Aggregation, Activity Timeline, Identity Resolution, and Consent.
 */

import { store } from '../db/store';
import { Customer360Profile, CustomerTimelineEvent, CustomerTimelineEventType, IdentityMergeRecord } from '../../src/types/crm';
import { auditLogEngine } from './auditLogEngine';

export class CrmEngine {
  /**
   * GET OR ASSEMBLE CUSTOMER 360 PROFILE
   * Merges authoritative commerce data, orders, returns, and concierge interactions.
   */
  public getCustomer360(identifier: string): Customer360Profile | null {
    // 1. Try finding existing CRM profile by ID or Email
    let profile = Array.from(store.crmProfiles.values()).find(
      (p) => p.id === identifier || p.email.toLowerCase() === identifier.toLowerCase()
    );

    // 2. Fetch authoritative orders
    const customerOrders = Array.from(store.orders.values()).filter(
      (o) => (profile && o.customerId === profile.id) || o.customerEmail.toLowerCase() === identifier.toLowerCase()
    );

    // 3. Fetch authoritative returns
    const customerReturns = Array.from(store.returns.values()).filter(
      (r) => r.customerEmail.toLowerCase() === identifier.toLowerCase()
    );

    if (!profile) {
      if (customerOrders.length === 0) return null;
      
      const firstOrder = customerOrders[0];
      const rawName = (firstOrder as any).customerName || firstOrder.shippingAddress?.fullName || 'Valued Client';
      const nameParts = String(rawName).split(' ');
      const newId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      profile = {
        id: newId,
        email: firstOrder.customerEmail,
        phone: (firstOrder as any).customerPhone || firstOrder.shippingAddress?.phone || '+91 0000000000',
        firstName: nameParts[0] || 'Client',
        lastName: nameParts.slice(1).join(' ') || '',
        country: firstOrder.shippingAddress?.country || 'India',
        preferredCurrency: (firstOrder.currencyUsed as any) || 'INR',
        totalOrdersCount: 0,
        lifetimeSpendINR: 0,
        averageOrderValueINR: 0,
        viewedProductIds: [],
        wishlistProductIds: [],
        cartProductIds: [],
        preferredCategories: [],
        preferredBrands: ['SEJAL Signature Joaillerie'],
        priveTier: 'Member',
        privePoints: 0,
        isPriveEligible: false,
        conciergeRequestsCount: 0,
        totalReturnsCount: 0,
        totalRefundedINR: 0,
        returnRatePercentage: 0,
        acquisitionSource: 'direct',
        consent: {
          marketingEmail: true,
          marketingWhatsApp: true,
          marketingSMS: false,
          frequencyPreference: 'weekly_curation',
          lastConsentUpdated: new Date().toISOString(),
          consentSource: 'checkout',
        },
        activeSegmentIds: [],
        createdAt: firstOrder.createdAt,
        updatedAt: new Date().toISOString(),
      };
      store.crmProfiles.set(profile.id, profile);
    }

    // 4. Calculate fresh authoritative aggregates
    const paidOrders = customerOrders.filter((o) => o.paymentStatus === 'Captured' || o.orderStatus === 'Delivered' || o.orderStatus === 'Confirmed');
    const lifetimeSpend = paidOrders.reduce((sum, o) => sum + (o.totalINR || 0), 0);
    const orderCount = paidOrders.length;
    const aov = orderCount > 0 ? Math.round(lifetimeSpend / orderCount) : 0;

    profile.totalOrdersCount = orderCount;
    profile.lifetimeSpendINR = lifetimeSpend;
    profile.averageOrderValueINR = aov;
    profile.firstOrderDate = customerOrders[customerOrders.length - 1]?.createdAt;
    profile.lastOrderDate = customerOrders[0]?.createdAt;

    // Calculate returns metrics
    const totalRefunded = customerReturns.reduce((sum, r) => sum + (r.approvedRefundAmountINR || 0), 0);
    profile.totalReturnsCount = customerReturns.length;
    profile.totalRefundedINR = totalRefunded;
    profile.returnRatePercentage = orderCount > 0 ? Math.round((customerReturns.length / orderCount) * 100) : 0;

    // Calculate Privé eligibility
    if (lifetimeSpend >= 3000000) {
      profile.priveTier = 'Diamond High Salon';
      profile.isPriveEligible = true;
    } else if (lifetimeSpend >= 1500000) {
      profile.priveTier = 'Gold Privé';
      profile.isPriveEligible = true;
    } else if (lifetimeSpend >= 500000) {
      profile.priveTier = 'Silver Privé';
      profile.isPriveEligible = true;
    }

    profile.privePoints = Math.round(lifetimeSpend / 100);
    profile.updatedAt = new Date().toISOString();
    store.crmProfiles.set(profile.id, profile);

    return profile;
  }

  /**
   * LIST ALL CRM PROFILES
   */
  public listCustomerProfiles(filters?: { country?: string; priveTier?: string; search?: string }): Customer360Profile[] {
    let list = Array.from(store.crmProfiles.values());

    if (filters?.country) {
      list = list.filter((p) => p.country.toLowerCase() === filters.country!.toLowerCase());
    }

    if (filters?.priveTier) {
      list = list.filter((p) => p.priveTier === filters.priveTier);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((p) => p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.phone.includes(q));
    }

    return list.sort((a, b) => b.lifetimeSpendINR - a.lifetimeSpendINR);
  }

  /**
   * RECORD ACTIVITY TIMELINE EVENT
   */
  public recordTimelineEvent(payload: {
    customerId?: string;
    customerEmail: string;
    eventType: CustomerTimelineEventType;
    title: string;
    description: string;
    entityId?: string;
    metadata?: Record<string, any>;
    channel?: 'storefront' | 'email' | 'whatsapp' | 'sms' | 'concierge' | 'system';
  }): CustomerTimelineEvent {
    const event: CustomerTimelineEvent = {
      id: `evt_tl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      customerId: payload.customerId || payload.customerEmail,
      customerEmail: payload.customerEmail,
      eventType: payload.eventType,
      title: payload.title,
      description: payload.description,
      entityId: payload.entityId,
      metadata: payload.metadata,
      timestamp: new Date().toISOString(),
      channel: payload.channel || 'storefront',
    };

    const key = payload.customerEmail.toLowerCase();
    const existing = store.customerTimelines.get(key) || [];
    existing.unshift(event);
    store.customerTimelines.set(key, existing);

    return event;
  }

  /**
   * GET FULL CUSTOMER TIMELINE
   * Aggregates timeline events and synthesizes orders, returns, and concierge history.
   */
  public getCustomerTimeline(customerEmail: string): CustomerTimelineEvent[] {
    const key = customerEmail.toLowerCase();
    const events = [...(store.customerTimelines.get(key) || [])];

    // Synthesize timeline entries from authoritative orders
    const orders = Array.from(store.orders.values()).filter(
      (o) => o.customerEmail.toLowerCase() === key
    );

    orders.forEach((o) => {
      if (!events.some((e) => e.entityId === o.id && e.eventType === 'order_created')) {
        events.push({
          id: `syn_ord_${o.id}`,
          customerId: o.customerId || o.customerEmail,
          customerEmail: o.customerEmail,
          eventType: 'order_created',
          title: `Acquired Creation (Order ${o.orderNumber})`,
          description: `Secured ${o.items.length} items valued at ₹${o.totalINR.toLocaleString('en-IN')}`,
          entityId: o.id,
          metadata: { orderNumber: o.orderNumber, totalINR: o.totalINR },
          timestamp: o.createdAt,
          channel: 'storefront',
        });
      }
    });

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * IDENTITY RESOLUTION: SAFE GUEST TO CUSTOMER MERGE
   */
  public resolveCustomerIdentity(
    guestSessionId: string,
    email: string,
    phone: string,
    name?: string
  ): { targetProfile: Customer360Profile; mergeRecord: IdentityMergeRecord } {
    let profile = this.getCustomer360(email);

    if (!profile) {
      const newId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const names = (name || 'Guest Client').split(' ');
      profile = {
        id: newId,
        email: email.toLowerCase(),
        phone: phone || '',
        firstName: names[0],
        lastName: names.slice(1).join(' '),
        country: 'India',
        preferredCurrency: 'INR',
        totalOrdersCount: 0,
        lifetimeSpendINR: 0,
        averageOrderValueINR: 0,
        viewedProductIds: [],
        wishlistProductIds: [],
        cartProductIds: [],
        preferredCategories: [],
        preferredBrands: ['SEJAL Signature Joaillerie'],
        priveTier: 'Member',
        privePoints: 0,
        isPriveEligible: false,
        conciergeRequestsCount: 0,
        totalReturnsCount: 0,
        totalRefundedINR: 0,
        returnRatePercentage: 0,
        acquisitionSource: 'direct',
        consent: {
          marketingEmail: true,
          marketingWhatsApp: true,
          marketingSMS: false,
          frequencyPreference: 'weekly_curation',
          lastConsentUpdated: new Date().toISOString(),
          consentSource: 'account_portal',
        },
        activeSegmentIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.crmProfiles.set(profile.id, profile);
    }

    // Transfer guest timeline events to target profile
    const guestEvents = store.customerTimelines.get(guestSessionId) || [];
    if (guestEvents.length > 0) {
      const customerEvents = store.customerTimelines.get(profile.email) || [];
      guestEvents.forEach((ge) => {
        ge.customerId = profile!.id;
        ge.customerEmail = profile!.email;
        customerEvents.push(ge);
      });
      store.customerTimelines.set(profile.email, customerEvents);
      store.customerTimelines.delete(guestSessionId);
    }

    const mergeRecord: IdentityMergeRecord = {
      id: `id_mrg_${Date.now()}`,
      sourceGuestSessionId: guestSessionId,
      targetCustomerId: profile.id,
      mergedEmail: profile.email,
      mergedPhone: profile.phone,
      transferredEventsCount: guestEvents.length,
      mergedTimelineEventsCount: guestEvents.length,
      mergedAt: new Date().toISOString(),
      actor: 'system_auto_merge',
    };

    store.identityMerges.push(mergeRecord);

    auditLogEngine.logAudit({
      entityType: 'Customer',
      entityId: profile.id,
      referenceCode: profile.email,
      action: 'IDENTITY_MERGED',
      actor: 'system',
      reason: `Guest session ${guestSessionId} safely resolved into Customer ${profile.id}`,
    });

    return { targetProfile: profile, mergeRecord, mergedTimelineEventsCount: guestEvents.length };
  }

  /**
   * UPDATE CUSTOMER PREFERENCES & CONSENT
   */
  public updateConsent(
    customerId: string,
    consent: Partial<Customer360Profile['consent']>,
    actor: string = 'customer'
  ): Customer360Profile {
    let profile =
      store.crmProfiles.get(customerId) ||
      Array.from(store.crmProfiles.values()).find((p) => p.email.toLowerCase() === customerId.toLowerCase());

    if (!profile) {
      profile = this.getCustomer360(customerId);
    }

    if (!profile) {
      throw new Error(`Customer profile ${customerId} not found.`);
    }

    profile.consent = {
      ...profile.consent,
      ...consent,
      lastConsentUpdated: new Date().toISOString(),
    };
    profile.updatedAt = new Date().toISOString();
    store.crmProfiles.set(profile.id, profile);

    auditLogEngine.logAudit({
      entityType: 'Customer',
      entityId: profile.id,
      referenceCode: profile.email,
      action: 'CONSENT_UPDATED',
      actor,
      reason: `Consent updated: Email=${profile.consent.marketingEmail}, WhatsApp=${profile.consent.marketingWhatsApp}, SMS=${profile.consent.marketingSMS}`,
    });

    return profile;
  }
}

export const crmEngine = new CrmEngine();
