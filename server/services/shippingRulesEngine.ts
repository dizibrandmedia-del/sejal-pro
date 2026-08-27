import { store } from '../db/store';
import { ShippingRule, ShippingRateOption, ShippingRateCalculationRequest } from '../../src/types/shipping';

export class ShippingRulesEngine {
  /**
   * Get all active shipping rules
   */
  public getRules(): ShippingRule[] {
    return store.shippingRules;
  }

  /**
   * Calculate available shipping rate tiers and delivery estimates for a destination
   */
  public calculateRates(request: ShippingRateCalculationRequest): ShippingRateOption[] {
    const country = request.country.trim();
    
    // Find matching rule or fallback to international
    const rule =
      store.shippingRules.find(
        (r) =>
          r.country.toLowerCase() === country.toLowerCase() ||
          r.countryCode.toLowerCase() === country.toLowerCase()
      ) || store.shippingRules[0]; // default to India domestic rule

    const isFree = request.orderTotalINR >= rule.freeShippingThresholdINR;
    const now = new Date();

    const minDays = rule.estimatedDeliveryDaysMin;
    const maxDays = rule.estimatedDeliveryDaysMax;

    const minDeliveryDate = new Date(now.getTime() + minDays * 86400000);
    const maxDeliveryDate = new Date(now.getTime() + maxDays * 86400000);

    const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const dateRangeText = `${minDeliveryDate.toLocaleDateString('en-GB', dateOptions)} – ${maxDeliveryDate.toLocaleDateString('en-GB', dateOptions)}`;

    const options: ShippingRateOption[] = [
      {
        serviceId: 'standard_white_glove',
        carrier: rule.carrier,
        serviceName:
          rule.countryCode === 'IN'
            ? 'SEJAL Armoured White-Glove Hand-Delivery'
            : `${rule.country} Luxury Insured Priority Air`,
        priceINR: isFree ? 0 : rule.standardRateINR,
        priceInSelectedCurrency: isFree ? 0 : rule.standardRateINR,
        currency: 'INR',
        isFree,
        estimatedDeliveryText: `${minDays}–${maxDays} Business Days (${dateRangeText})`,
        estimatedDeliveryDate: maxDeliveryDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      },
    ];

    // Priority Air Express Option
    if (rule.expressRateINR > 0) {
      const expressMinDays = Math.max(1, minDays - 1);
      const expressMaxDays = Math.max(2, maxDays - 2);
      const expressMinDate = new Date(now.getTime() + expressMinDays * 86400000);
      const expressMaxDate = new Date(now.getTime() + expressMaxDays * 86400000);

      options.push({
        serviceId: 'priority_air_express',
        carrier: rule.carrier,
        serviceName: 'VIP Same-Day Manifest / Priority Air Dispatch',
        priceINR: rule.expressRateINR,
        priceInSelectedCurrency: rule.expressRateINR,
        currency: 'INR',
        isFree: false,
        estimatedDeliveryText: `${expressMinDays}–${expressMaxDays} Business Days (${expressMinDate.toLocaleDateString('en-GB', dateOptions)} – ${expressMaxDate.toLocaleDateString('en-GB', dateOptions)})`,
        estimatedDeliveryDate: expressMaxDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      });
    }

    return options;
  }
}

export const shippingRulesEngine = new ShippingRulesEngine();
