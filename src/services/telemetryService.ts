/**
 * SEJAL.PRO — Phase 5 Client-Side Telemetry & Event Dispatcher
 * Captures UTM Parameters, Canonical Storefront Events & Enforces Purchase Deduplication.
 */

import { CanonicalEventType } from '../types/analytics';

const SESSION_KEY = 'sejal_session_id';
const UTM_KEY = 'sejal_utm_params';
const DEDUP_PURCHASE_KEY = 'sejal_purchases_recorded';

export const telemetryService = {
  /**
   * INITIALIZE SESSION & CAPTURE UTM PARAMETERS
   */
  initSession(): string {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    // Capture UTMs from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    if (utmSource || utmCampaign) {
      const utmObj = {
        utmSource: utmSource || 'direct',
        utmMedium: utmMedium || 'referral',
        utmCampaign: utmCampaign || 'organic',
        utmTerm: utmTerm || '',
        utmContent: utmContent || '',
        landingPath: window.location.pathname,
      };
      sessionStorage.setItem(UTM_KEY, JSON.stringify(utmObj));

      // Record touchpoint on backend
      fetch('/api/attribution/touchpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          ...utmObj,
          deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
        }),
      }).catch(() => {});
    }

    return sessionId;
  },

  /**
   * GET ACTIVE SESSION ID
   */
  getSessionId(): string {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = this.initSession();
    }
    return sessionId;
  },

  /**
   * GET CAPTURED UTM PARAMETERS
   */
  getStoredUTM(): Record<string, string> {
    try {
      const stored = sessionStorage.getItem(UTM_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  /**
   * TRACK CANONICAL EVENT
   */
  async track(
    eventType: CanonicalEventType,
    payload: {
      customerId?: string;
      customerEmail?: string;
      orderId?: string;
      orderNumber?: string;
      productId?: string;
      productName?: string;
      category?: string;
      amountINR?: number;
      currency?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<void> {
    const sessionId = this.getSessionId();
    const utms = this.getStoredUTM();

    // Purchase Deduplication Safeguard
    if (eventType === 'purchase') {
      const orderRef = payload.orderNumber || payload.orderId || '';
      if (orderRef) {
        const recorded: string[] = JSON.parse(sessionStorage.getItem(DEDUP_PURCHASE_KEY) || '[]');
        if (recorded.includes(orderRef)) {
          console.log(`[Telemetry] Purchase event suppressed on client: ${orderRef}`);
          return;
        }
        recorded.push(orderRef);
        sessionStorage.setItem(DEDUP_PURCHASE_KEY, JSON.stringify(recorded));
      }
    }

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          sessionId,
          deduplicationKey: eventType === 'purchase' ? `order_${payload.orderNumber || payload.orderId}` : undefined,
          deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
          ...utms,
          ...payload,
        }),
      });
    } catch {
      // Non-blocking telemetry
    }
  },
};
