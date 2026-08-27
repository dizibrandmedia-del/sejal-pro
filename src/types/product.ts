export interface ProductMedia {
  id: string;
  url: string;
  alt: string;
  type: 'image' | 'video';
  isPrimary?: boolean;
  isHover?: boolean;
  angle?: 'front' | 'side' | 'back' | 'lifestyle' | 'detail' | 'packaging';
}

export interface VariantOption {
  name: string; // e.g. "Color", "Size", "Material", "Volume"
  value: string; // e.g. "Rose Gold", "Small", "18K Gold", "100ml"
  hexColor?: string; // For color swatches
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  options: VariantOption[];
  priceINR: number;
  compareAtPriceINR?: number;
  stock: number;
  media: ProductMedia[];
  active: boolean;
  weightGrams?: number;
  dimensions?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string[];
}

export interface ProductReview {
  id: string;
  customerName: string;
  rating: number;
  headline: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  location?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  subtitle?: string;
  brand: string;
  productType: string;
  category: string; // category slug
  subcategory?: string; // subcategory slug
  collection?: string; // collection slug
  tags: string[];
  
  // Pricing (Stored in Base INR, converted dynamically)
  basePriceINR: number;
  salePriceINR?: number;
  compareAtPriceINR?: number;
  
  // Stock & Availability
  availability: 'in-stock' | 'low-stock' | 'made-to-order' | 'out-of-stock';
  stock: number;
  isLimitedEdition?: boolean;
  isSignature?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  
  // Descriptions & Editorial Story
  shortDescription: string;
  story: string;
  details: string[];
  materials: string[];
  craftsmanship: string;
  dimensions?: string;
  careGuide: string;
  packagingDetails: string;
  
  // Media & Variants
  media: ProductMedia[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  
  // Ratings
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  
  // Related
  relatedProductIds?: string[];
  completeTheLookIds?: string[];
  
  // SEO
  seo?: ProductSEO;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  editorialImage: string;
  bannerImage: string;
  featuredProductIds?: string[];
  subcategories: Subcategory[];
  order: number;
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  origin: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  featured: boolean;
}
