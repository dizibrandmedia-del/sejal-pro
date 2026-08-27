/**
 * SEJAL.PRO — Phase 3 Dynamic CMS Domain Models
 * Data-driven models for Homepage Sections, Banners, Modular Landing Pages, and Editorial Content.
 */

export type HomepageSectionType =
  | 'hero'
  | 'video_hero'
  | 'value_pillars'
  | 'signature_collection'
  | 'category_portals'
  | 'new_arrivals'
  | 'curated_edit'
  | 'gifting_experience'
  | 'founder_story'
  | 'prive_salon'
  | 'flagship_showroom'
  | 'newsletter'
  | 'testimonials'
  | 'social_feed'
  | 'banner_split';

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title: string;
  subtitle?: string;
  isEnabled: boolean;
  sortOrder: number;
  scheduleStart?: string;               // ISO date string
  scheduleEnd?: string;                 // ISO date string
  config: Record<string, any>;          // Section-specific dynamic properties
  updatedAt: string;
}

export type BannerPlacement =
  | 'homepage_hero'
  | 'homepage_mid'
  | 'category_header'
  | 'collection_header'
  | 'cart_drawer'
  | 'popup_modal';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  placement: BannerPlacement;
  desktopMediaUrl: string;
  mobileMediaUrl: string;
  ctaText?: string;
  destinationUrl?: string;
  scheduleStart?: string;
  scheduleEnd?: string;
  priority: number;                     // Higher number = higher priority
  isActive: boolean;
  altText: string;
  createdAt: string;
  updatedAt: string;
}

export type LandingPageBlockType =
  | 'hero_banner'
  | 'editorial_text'
  | 'rich_media'
  | 'product_grid'
  | 'collection_spotlight'
  | 'curated_quote'
  | 'split_banner'
  | 'call_to_action'
  | 'testimonials';

export interface LandingPageBlock {
  id: string;
  type: LandingPageBlockType;
  title?: string;
  content?: string;
  mediaUrl?: string;
  mobileMediaUrl?: string;
  productIds?: string[];
  collectionSlug?: string;
  ctaText?: string;
  ctaUrl?: string;
  sortOrder: number;
  settings?: Record<string, any>;
}

export interface LandingPage {
  id: string;
  slug: string;                         // e.g. "bridal-edit", "uae-luxury", "festive-curation"
  title: string;
  tagline?: string;
  blocks: LandingPageBlock[];
  isPublished: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorialArticle {
  id: string;
  slug: string;                         // e.g. "the-art-of-high-joaillerie", "silk-drapes-guide"
  title: string;
  subtitle: string;
  author: string;
  category: 'High Jewellery' | 'Haute Couture' | 'Fragrance' | 'Art of Gifting' | 'Heritage & Craft';
  coverImageUrl: string;
  excerpt: string;
  bodyMarkdown: string;
  readTimeMinutes: number;
  relatedProductIds: string[];
  tags: string[];
  isPublished: boolean;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  fileType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/svg+xml' | 'video/mp4';
  sizeBytes: number;
  width?: number;
  height?: number;
  tags: string[];
  folder: 'products' | 'banners' | 'editorial' | 'lifestyle' | 'logos';
  altText: string;
  createdAt: string;
}
