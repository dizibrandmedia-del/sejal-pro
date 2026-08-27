/**
 * SEJAL.PRO — Phase 5 Personalisation & AI-Ready Architecture Types
 * Priority-based recommendation rules, AI Gift Finder, Style Quiz, and Concierge AI Interfaces.
 */

import { Product } from './product';

export interface PersonalisationContext {
  customerId?: string;
  country: string;
  preferredCurrency: string;
  recentProductIds: string[];
  recentCategories: string[];
  wishlistProductIds: string[];
  priveTier?: string;
  styleQuizAnswers?: Record<string, string>;
}

export type RecommendationType =
  | 'curated_admin'
  | 'recently_viewed'
  | 'complete_the_look'
  | 'category_affinity'
  | 'trending_luxury'
  | 'prive_exclusive';

export interface RecommendationResult {
  sectionTitle: string;
  sectionSubtitle?: string;
  recommendationType: RecommendationType;
  products: Product[];
  explanation: string;
}

export interface AIGiftFinderQuery {
  occasion: 'Royal Wedding' | 'Milestone Anniversary' | 'Gala Evening' | 'High Festive' | 'Bespoke Birthday';
  recipient: 'Wife / Partner' | 'Daughter' | 'Mother' | 'Self-Gifting' | 'Royal Dignitary';
  budgetINRRange: { min: number; max: number };
  aesthetic: 'Modern Haute Joaillerie' | 'Heritage Brocade & Silk' | 'Minimalist Diamond' | 'Extrait Perfumery';
  country?: string;
}

export interface AIGiftFinderResult {
  curatedProduct: Product;
  curationReason: string;
  pairingProduct?: Product;
  suggestedPackaging: string;
  conciergeNote: string;
}

export interface StyleQuizQuestion {
  id: string;
  question: string;
  options: Array<{
    id: string;
    label: string;
    description: string;
    imageUrl?: string;
    categoryTag: string;
  }>;
}

export interface AIVisualSearchQuery {
  imageBytesOrUrl: string;
  preferredCategory?: string;
}

export interface AIVisualSearchResult {
  matchedProducts: Array<{
    product: Product;
    similarityScore: number;
    matchedAttributes: string[];
  }>;
}
