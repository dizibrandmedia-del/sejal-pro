import { CurrencyCode, CurrencyConfig } from '../types/common';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    rateAgainstINR: 1,
    symbolPosition: 'before',
    flag: '🇮🇳',
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateAgainstINR: 0.0118, // 1 INR = 0.0118 USD (~85 INR/USD)
    symbolPosition: 'before',
    flag: '🇺🇸',
    locale: 'en-US',
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    rateAgainstINR: 0.0435, // 1 INR = 0.0435 AED
    symbolPosition: 'before',
    flag: '🇦🇪',
    locale: 'en-AE',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rateAgainstINR: 0.0182, // 1 INR = 0.0182 AUD
    symbolPosition: 'before',
    flag: '🇦🇺',
    locale: 'en-AU',
  },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'INR';

export function formatCurrencyPrice(amountINR: number, currencyCode: CurrencyCode = DEFAULT_CURRENCY): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = amountINR * config.rateAgainstINR;
  
  if (currencyCode === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }
  
  if (currencyCode === 'AED') {
    return `AED ${Math.round(converted).toLocaleString('en-AE')}`;
  }
  
  const formattedNumber = Math.round(converted).toLocaleString(config.locale);
  return `${config.symbol}${formattedNumber}`;
}
