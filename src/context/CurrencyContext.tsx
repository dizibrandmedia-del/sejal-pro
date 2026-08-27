import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, CurrencyConfig } from '../types/common';
import { CURRENCIES, DEFAULT_CURRENCY, formatCurrencyPrice } from '../config/currencies';

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountINR: number) => string;
  allCurrencies: Record<CurrencyCode, CurrencyConfig>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'sejal_pro_currency_v1';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode;
      if (saved && CURRENCIES[saved]) return saved;
    } catch {
      // ignore
    }
    return DEFAULT_CURRENCY;
  });

  const currencyConfig = CURRENCIES[currency] || CURRENCIES.INR;

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  };

  const formatPrice = (amountINR: number) => {
    return formatCurrencyPrice(amountINR, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyConfig,
        setCurrency,
        formatPrice,
        allCurrencies: CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
