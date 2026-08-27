import { Product, ProductVariant } from './product';

export interface GiftPackagingOption {
  enabled: boolean;
  boxType: 'signature-rose-gold' | 'prive-velvet' | 'bridal-heritage';
  giftMessage?: string;
  recipientName?: string;
  senderName?: string;
  priceINR: number;
}

export interface CartItem {
  id: string; // unique item line id (product.id + variant.id)
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  selectedOptions: Record<string, string>;
  addedAt: string;
}

export interface CouponDiscount {
  code: string;
  discountType: 'percentage' | 'fixed';
  amount: number; // e.g. 10 for 10%, or 5000 INR
  description: string;
  minSubtotalINR?: number;
}

export interface Cart {
  items: CartItem[];
  giftPackaging: GiftPackagingOption;
  appliedCoupon?: CouponDiscount;
  subtotalINR: number;
  discountINR: number;
  giftPackagingTotalINR: number;
  shippingTotalINR: number;
  estimatedTaxINR: number;
  totalINR: number;
  itemCount: number;
}
