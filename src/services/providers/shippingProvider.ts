import { ShippingMethod } from '../../types/order';

export interface IShippingProvider {
  id: string;
  name: string;
  getAvailableMethods(country: string, cartTotalINR: number): ShippingMethod[];
}

export class LuxuryShippingProvider implements IShippingProvider {
  id = 'sejal_luxury_logistics';
  name = 'SEJAL White-Glove Global Logistics';

  getAvailableMethods(country: string): ShippingMethod[] {
    const isDomestic = country.toLowerCase() === 'india';

    if (isDomestic) {
      return [
        {
          id: 'ship-white-glove-in',
          name: 'Complimentary White-Glove Insured Delivery',
          description: 'Hand-delivered in tamper-proof signature packaging by SEJAL concierge staff.',
          estimatedDelivery: '2–4 Business Days',
          priceINR: 0,
          insured: true,
        },
        {
          id: 'ship-express-in',
          name: 'Priority Armoured Next-Day Express',
          description: 'Armoured priority delivery with real-time GPS tracking and OTP verification.',
          estimatedDelivery: 'Next Business Day',
          priceINR: 1500,
          insured: true,
        },
      ];
    }

    // International (UAE, USA, Australia, Worldwide)
    return [
      {
        id: 'ship-intl-white-glove',
        name: 'Complimentary Insured International Air Courier',
        description: 'DHL Express Luxury Network with customs clearance and door-to-door insurance.',
        estimatedDelivery: '3–6 Business Days',
        priceINR: 0,
        insured: true,
      },
      {
        id: 'ship-intl-priority',
        name: 'Priority Diplomatic Air Freight',
        description: 'Expedited VIP air cargo with dedicated customs escort.',
        estimatedDelivery: '2–3 Business Days',
        priceINR: 4500,
        insured: true,
      },
    ];
  }
}

export const shippingProvider: IShippingProvider = new LuxuryShippingProvider();
