export type CurrencyCode = 'INR' | 'USD' | 'AED' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstINR: number; // Conversion multiplier relative to base currency
  symbolPosition: 'before' | 'after';
  flag: string;
  locale: string;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'editorial';

export interface FilterParams {
  category?: string;
  subcategory?: string;
  brand?: string[];
  collection?: string[];
  priceRange?: [number, number];
  colors?: string[];
  materials?: string[];
  inStockOnly?: boolean;
  searchQuery?: string;
  sortBy?: SortOption;
}

export type ToastType = 'success' | 'error' | 'info' | 'luxury';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

export interface BreadcrumbItem {
  label: string;
  url?: string;
}
