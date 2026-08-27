import { Order } from '../../src/types/order';
import { Payment, PaymentEvent, Refund } from '../../src/types/payment';
import { InventoryItem, InventoryReservation, InventoryEvent } from '../../src/types/inventory';
import { Shipment, ShipmentEvent, ShippingRule } from '../../src/types/shipping';
import { ReturnRequest } from '../../src/types/returns';
import { AuditLogEntry, NotificationPayload, CommerceEvent } from '../../src/types/events';
import { Product, Category, Collection, Brand } from '../../src/types/product';
import { AdminUser, ProductType, CustomAttribute, CouponRule, Campaign, CustomerSegment, ROLE_PERMISSIONS } from '../../src/types/admin';
import { HomepageSection, Banner, LandingPage, EditorialArticle, MediaAsset } from '../../src/types/cms';
import { Customer360Profile, CustomerTimelineEvent, DynamicSegment, IdentityMergeRecord } from '../../src/types/crm';
import { MarketingWorkflow, WorkflowExecutionState, NotificationTemplate, CommunicationLog } from '../../src/types/automation';
import { UTMTouchpoint, InfluencerProfile, AffiliateProfile, CommissionLedgerEntry } from '../../src/types/attribution';
import { CanonicalAnalyticsEvent } from '../../src/types/analytics';
import { MOCK_PRODUCTS } from '../../src/data/mockProducts';
import { MOCK_CATEGORIES } from '../../src/data/mockCategories';

/**
 * Concurrency Mutex Lock
 * Guarantees transaction-safe execution for inventory reservation and state transitions.
 */
class Mutex {
  private queue: Array<(release: () => void) => void> = [];
  private locked = false;

  public async acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      const release = () => {
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          if (next) next(release);
        } else {
          this.locked = false;
        }
      };

      if (!this.locked) {
        this.locked = true;
        resolve(release);
      } else {
        this.queue.push(resolve);
      }
    });
  }
}

export class CommerceStore {
  // Phase 1 & 2 Entities
  public orders: Map<string, Order> = new Map();
  public payments: Map<string, Payment> = new Map();
  public paymentEvents: PaymentEvent[] = [];
  public refunds: Map<string, Refund> = new Map();
  public inventory: Map<string, InventoryItem> = new Map(); // Keyed by SKU
  public inventoryReservations: Map<string, InventoryReservation> = new Map();
  public inventoryEvents: InventoryEvent[] = [];
  public shipments: Map<string, Shipment> = new Map();
  public shipmentEvents: ShipmentEvent[] = [];
  public shippingRules: ShippingRule[] = [];
  public returns: Map<string, ReturnRequest> = new Map();
  public auditLogs: AuditLogEntry[] = [];
  public notifications: NotificationPayload[] = [];
  public commerceEvents: CommerceEvent[] = [];
  public processedWebhookEventIds: Set<string> = new Set();

  // Phase 3 Admin & Dynamic CMS Entities
  public adminUsers: Map<string, AdminUser> = new Map();
  public productTypes: Map<string, ProductType> = new Map();
  public customAttributes: Map<string, CustomAttribute> = new Map();
  public products: Map<string, Product> = new Map();
  public categories: Map<string, Category> = new Map();
  public collections: Map<string, Collection> = new Map();
  public brands: Map<string, Brand> = new Map();
  public homepageSections: Map<string, HomepageSection> = new Map();
  public banners: Map<string, Banner> = new Map();
  public landingPages: Map<string, LandingPage> = new Map();
  public editorials: Map<string, EditorialArticle> = new Map();
  public coupons: Map<string, CouponRule> = new Map();
  public campaigns: Map<string, Campaign> = new Map();
  public mediaAssets: Map<string, MediaAsset> = new Map();
  public customerSegments: Map<string, CustomerSegment> = new Map();

  // Phase 5 CRM, Marketing Automation, Attribution & Analytics Entities
  public crmProfiles: Map<string, Customer360Profile> = new Map();
  public customerTimelines: Map<string, CustomerTimelineEvent[]> = new Map(); // Keyed by customerId or email
  public dynamicSegments: Map<string, DynamicSegment> = new Map();
  public marketingWorkflows: Map<string, MarketingWorkflow> = new Map();
  public workflowExecutions: Map<string, WorkflowExecutionState> = new Map();
  public notificationTemplates: Map<string, NotificationTemplate> = new Map();
  public communicationLogs: CommunicationLog[] = [];
  public utmTouchpoints: UTMTouchpoint[] = [];
  public influencers: Map<string, InfluencerProfile> = new Map();
  public affiliates: Map<string, AffiliateProfile> = new Map();
  public commissionLedger: Map<string, CommissionLedgerEntry> = new Map();
  public canonicalAnalyticsEvents: CanonicalAnalyticsEvent[] = [];
  public identityMerges: IdentityMergeRecord[] = [];

  private mutex = new Mutex();
  private orderSequence = 1000;

  constructor() {
    this.seedInitialData();
  }

  /**
   * Execute an atomic database transaction with mutex locking.
   * Ensures simultaneous requests are evaluated sequentially without race conditions.
   */
  public async executeTransaction<T>(operation: () => Promise<T>): Promise<T> {
    const release = await this.mutex.acquire();
    try {
      return await operation();
    } finally {
      release();
    }
  }

  /**
   * Generate next sequential luxury order reference
   * e.g. "SEJAL-2026-000001"
   */
  public generateNextOrderNumber(): string {
    this.orderSequence += 1;
    const padded = String(this.orderSequence).padStart(6, '0');
    return `SEJAL-2026-${padded}`;
  }

  /**
   * Seed catalog inventory, shipping rules, CMS, and sample state
   */
  private seedInitialData() {
    // 1. Seed Staff Users (RBAC)
    const seedStaff: AdminUser[] = [
      {
        id: 'usr_super_admin',
        email: 'sejal@sejal.pro',
        name: 'Sejal Gupta (Founder & Head of Maison)',
        role: 'Super Admin',
        permissions: ROLE_PERMISSIONS['Super Admin'],
        isActive: true,
        twoFactorEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_admin_alias',
        email: 'admin@sejal.pro',
        name: 'Sejal Administrator (Operations & Command)',
        role: 'Super Admin',
        permissions: ROLE_PERMISSIONS['Super Admin'],
        isActive: true,
        twoFactorEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_prod_mgr',
        email: 'merchandise@sejal.pro',
        name: 'Alistair Vance (Chief Merchandising Officer)',
        role: 'Product Manager',
        permissions: ROLE_PERMISSIONS['Product Manager'],
        isActive: true,
        twoFactorEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_order_mgr',
        email: 'logistics@sejal.pro',
        name: 'Vikramaditya Roy (Armoured Fleet Director)',
        role: 'Order Manager',
        permissions: ROLE_PERMISSIONS['Order Manager'],
        isActive: true,
        twoFactorEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_mktg_mgr',
        email: 'marketing@sejal.pro',
        name: 'Claire Dupont (Global Brand Director)',
        role: 'Marketing Manager',
        permissions: ROLE_PERMISSIONS['Marketing Manager'],
        isActive: true,
        twoFactorEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_content_mgr',
        email: 'editor@sejal.pro',
        name: 'Elena Rostova (Senior Editorial Director)',
        role: 'Content Manager',
        permissions: ROLE_PERMISSIONS['Content Manager'],
        isActive: true,
        twoFactorEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_concierge',
        email: 'concierge@sejal.pro',
        name: 'Devanshi Verma (Privé Salon Concierge Liaison)',
        role: 'Customer Concierge',
        permissions: ROLE_PERMISSIONS['Customer Concierge'],
        isActive: true,
        twoFactorEnabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedStaff.forEach((u) => this.adminUsers.set(u.id, u));

    // 2. Seed Custom Attributes
    const seedAttributes: CustomAttribute[] = [
      {
        id: 'attr_gemstone_cut',
        code: 'gemstone_cut',
        label: 'Gemstone Cut & Symmetry',
        fieldType: 'select',
        description: 'Diamond or precious stone cut specification',
        options: [
          { id: 'opt_cushion', label: 'Cushion Brilliant', value: 'Cushion Brilliant', displayOrder: 1, isActive: true },
          { id: 'opt_round', label: 'Round Brilliant VVS', value: 'Round Brilliant VVS', displayOrder: 2, isActive: true },
          { id: 'opt_emerald', label: 'Emerald Step Cut', value: 'Emerald Step Cut', displayOrder: 3, isActive: true },
          { id: 'opt_oval', label: 'Oval Elegance Cut', value: 'Oval Elegance Cut', displayOrder: 4, isActive: true },
        ],
        isRequired: false,
        isVisibleOnProductPage: true,
        isFilterable: true,
        isSearchable: true,
        isVariantDefining: true,
        isInternalOnly: false,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'attr_metal_finish',
        code: 'metal_finish',
        label: 'Gold Karat & Metal Finish',
        fieldType: 'colour',
        description: 'Metal composition',
        options: [
          { id: 'opt_rg', label: '18K Rose Gold', value: '18K Rose Gold', hexColor: '#B76E79', displayOrder: 1, isActive: true },
          { id: 'opt_wg', label: '18K White Gold', value: '18K White Gold', hexColor: '#E5E8EB', displayOrder: 2, isActive: true },
          { id: 'opt_yg', label: '18K Champagne Gold', value: '18K Champagne Gold', hexColor: '#F5E6D3', displayOrder: 3, isActive: true },
        ],
        isRequired: true,
        isVisibleOnProductPage: true,
        isFilterable: true,
        isSearchable: true,
        isVariantDefining: true,
        isInternalOnly: false,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'attr_fragrance_concentration',
        code: 'fragrance_concentration',
        label: 'Fragrance Concentration',
        fieldType: 'select',
        options: [
          { id: 'opt_extrait', label: 'Extrait de Parfum (35% Oil)', value: 'Extrait de Parfum', displayOrder: 1, isActive: true },
          { id: 'opt_edp', label: 'Eau de Parfum (22% Oil)', value: 'Eau de Parfum', displayOrder: 2, isActive: true },
        ],
        isRequired: false,
        isVisibleOnProductPage: true,
        isFilterable: true,
        isSearchable: true,
        isVariantDefining: false,
        isInternalOnly: false,
        displayOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedAttributes.forEach((a) => this.customAttributes.set(a.id, a));

    // 3. Seed Reusable Product Types
    const seedProductTypes: ProductType[] = [
      {
        id: 'pt_high_jewellery',
        code: 'high-jewellery',
        name: 'Haute Joaillerie & Diamonds',
        description: 'Fine diamond chokers, bangles, rings, and solitaire sets.',
        attributeIds: ['attr_gemstone_cut', 'attr_metal_finish'],
        variantAttributeIds: ['attr_metal_finish', 'attr_gemstone_cut'],
        hasVariants: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'pt_perfume',
        code: 'perfume',
        name: 'Haute Parfumerie & Extraits',
        description: 'Artisanal flacons and pure extraits.',
        attributeIds: ['attr_fragrance_concentration'],
        variantAttributeIds: [],
        hasVariants: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'pt_handbags',
        code: 'handbags',
        name: 'Bespoke Handbags & Minaudières',
        description: 'Fine leather and gold-framed minaudières.',
        attributeIds: ['attr_metal_finish'],
        variantAttributeIds: ['attr_metal_finish'],
        hasVariants: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedProductTypes.forEach((pt) => this.productTypes.set(pt.id, pt));

    // 4. Seed Products, Categories, Collections, Brands from master catalogue
    MOCK_PRODUCTS.forEach((p) => this.products.set(p.id, p));
    MOCK_CATEGORIES.forEach((c) => this.categories.set(c.id, c));

    const seedCollections: Collection[] = [
      {
        id: 'col_signature',
        slug: 'signature-collection',
        name: 'The Signature Collection',
        subtitle: 'Crown Jewels of SEJAL',
        description: 'Bespoke diamond suites and molten rose gold masterworks.',
        bannerImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200',
        featured: true,
      },
      {
        id: 'col_bridal',
        slug: 'bridal-edit',
        name: 'The Royal Bridal Sanctuary',
        subtitle: 'High Joaillerie & Custom Zardozi Drapes',
        description: 'Heirloom creations curated for royal weddings and gala ceremonies.',
        bannerImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200',
        featured: true,
      },
    ];
    seedCollections.forEach((col) => this.collections.set(col.id, col));

    const seedBrands: Brand[] = [
      {
        id: 'brd_sejal_sig',
        slug: 'sejal-signature',
        name: 'SEJAL Signature Joaillerie',
        description: 'High jewellery designed by Sejal Gupta in Mumbai and Antwerp.',
        logo: '/favicon.svg',
        origin: 'India / Belgium',
      },
    ];
    seedBrands.forEach((b) => this.brands.set(b.id, b));

    // 5. Seed Inventory for all SKUs from mockProducts
    MOCK_PRODUCTS.forEach((product) => {
      product.variants.forEach((variant) => {
        const sku = variant.sku;
        const stockQty = (variant as any).stock || (variant as any).stockQuantity || 6;
        
        const item: InventoryItem = {
          id: `inv_${sku.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          productId: product.id,
          productName: product.name,
          variantId: variant.id,
          sku: sku,
          variantTitle: variant.title,
          totalQuantity: stockQty,
          reservedQuantity: 0,
          availableQuantity: stockQty,
          soldQuantity: 0,
          damagedQuantity: 0,
          returnedQuantity: 0,
          lowStockThreshold: 2,
          isLowStock: stockQty <= 2,
          isOutOfStock: stockQty === 0,
          updatedAt: new Date().toISOString(),
        };

        this.inventory.set(sku, item);
      });
    });

    // 6. Seed Dynamic Homepage Sections (CMS-Controlled)
    const seedSections: HomepageSection[] = [
      { id: 'sec_hero', type: 'hero', title: 'Curated Luxury, Just for Her.', isEnabled: true, sortOrder: 1, config: {}, updatedAt: new Date().toISOString() },
      { id: 'sec_pillars', type: 'value_pillars', title: 'The SEJAL Promise & Guarantees', isEnabled: true, sortOrder: 2, config: {}, updatedAt: new Date().toISOString() },
      { id: 'sec_sig', type: 'signature_collection', title: 'The Signature Masterpieces', isEnabled: true, sortOrder: 3, config: { collectionSlug: 'signature-collection' }, updatedAt: new Date().toISOString() },
      { id: 'sec_portals', type: 'category_portals', title: 'Discover Your World of Luxury', isEnabled: true, sortOrder: 4, config: {}, updatedAt: new Date().toISOString() },
      { id: 'sec_new', type: 'new_arrivals', title: 'New Arrivals & Limited Drops', isEnabled: true, sortOrder: 5, config: {}, updatedAt: new Date().toISOString() },
      { id: 'sec_edit', type: 'curated_edit', title: 'The SEJAL Edit: Modern Aristocracy', isEnabled: true, sortOrder: 6, config: {}, updatedAt: new Date().toISOString() },
      { id: 'sec_gifting', type: 'gifting_experience', title: 'The Art of Gifting & Unboxing Ceremony', isEnabled: true, sortOrder: 7, config: {}, updatedAt: new Date().toISOString() },
      { id: 'sec_story', type: 'founder_story', title: 'The Vision of Sejal Gupta', isEnabled: true, sortOrder: 8, config: {}, updatedAt: new Date().toISOString() },
      { id: 'sec_prive', type: 'prive_salon', title: 'SEJAL Privé: An Inner Sanctuary', isEnabled: true, sortOrder: 9, config: {}, updatedAt: new Date().toISOString() },
      { id: 'sec_showroom', type: 'flagship_showroom', title: 'Flagship Architecture: Mumbai & Dubai', isEnabled: true, sortOrder: 10, config: {}, updatedAt: new Date().toISOString() },
      { id: 'sec_news', type: 'newsletter', title: 'By Private Invitation Only', isEnabled: true, sortOrder: 11, config: {}, updatedAt: new Date().toISOString() },
    ];
    seedSections.forEach((s) => this.homepageSections.set(s.id, s));

    // 7. Seed Banners
    const seedBanners: Banner[] = [
      {
        id: 'bnr_hero_main',
        title: 'Haute Joaillerie & Pure Silk Drapes',
        subtitle: 'The 2026 Royal Edition is now unveiled',
        placement: 'homepage_hero',
        desktopMediaUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600',
        mobileMediaUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800',
        ctaText: 'DISCOVER THE SELECTION',
        destinationUrl: '/shop',
        priority: 10,
        isActive: true,
        altText: 'The Royal Autumn Diamond Collection',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedBanners.forEach((b) => this.banners.set(b.id, b));

    // 8. Seed Modular Landing Pages
    const seedLandingPages: LandingPage[] = [
      {
        id: 'lp_bridal_edit',
        slug: 'bridal-edit',
        title: 'The Royal Bridal Sanctuary',
        tagline: 'High Joaillerie & Custom Zardozi Drapes for the Modern Aristocrat',
        blocks: [
          {
            id: 'blk_1',
            type: 'hero_banner',
            title: 'An Heirloom For Generations',
            content: 'Hand-crafted bridal suites featuring natural VVS diamonds and molten 18K gold.',
            mediaUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600',
            sortOrder: 1,
          },
          {
            id: 'blk_2',
            type: 'collection_spotlight',
            title: 'Curated Bridal Suites',
            collectionSlug: 'bridal-edit',
            sortOrder: 2,
          },
          {
            id: 'blk_3',
            type: 'call_to_action',
            title: 'Schedule a Private Bridal Salon Consultation',
            content: 'Meet privately with Sejal Gupta in Mumbai, Dubai, or via encrypted video link.',
            ctaText: 'BOOK PRIVATE CONCIERGE',
            ctaUrl: '/account?tab=concierge',
            sortOrder: 3,
          },
        ],
        isPublished: true,
        metaTitle: 'The Royal Bridal Sanctuary | SEJAL.PRO',
        metaDescription: 'Discover bespoke bridal jewellery and couture masterworks.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedLandingPages.forEach((lp) => this.landingPages.set(lp.id, lp));

    // 9. Seed Editorial Journal Articles
    const seedEditorials: EditorialArticle[] = [
      {
        id: 'art_high_joaillerie',
        slug: 'the-art-of-high-joaillerie',
        title: 'The Alchemy of Rare Stones: Behind the Maison SEJAL Atelier',
        subtitle: 'How Antwerp diamonds and Jaipur gemstone masters unite to create heirloom choker silhouettes.',
        author: 'Sejal Gupta, Founder',
        category: 'High Jewellery',
        coverImageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
        excerpt: 'An inside look at the 180 hours of micro-pave hand craftsmanship behind The Aura Choker.',
        bodyMarkdown: `### The Sovereignty of Pure Craftsmanship\n\nEvery gemstone chosen for a Maison SEJAL creation is hand-inspected under 10x magnification by our chief gemologists in Antwerp and Geneva.\n\n> "Jewellery is not merely adornment; it is an intimate armour of grace and self-possession." — *Sejal Gupta*\n\n### The Micro-Pave Protocol\nEach diamond is seated into microscopic prongs carved directly from solid 18-karat rose gold, ensuring seamless reflection and velvet-smooth skin contact.`,
        readTimeMinutes: 5,
        relatedProductIds: ['prod-1'],
        tags: ['High Jewellery', 'Diamonds', 'Behind the Craft'],
        isPublished: true,
        publishedAt: '2026-08-15T10:00:00Z',
        metaTitle: 'The Alchemy of Rare Stones | The SEJAL Journal',
        metaDescription: 'Inside the Maison SEJAL high jewellery atelier with founder Sejal Gupta.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedEditorials.forEach((e) => this.editorials.set(e.id, e));

    // 10. Seed Marketing Coupons
    const seedCoupons: CouponRule[] = [
      {
        id: 'cpn_prive10',
        code: 'PRIVE10',
        description: 'Complimentary 10% Privé Welcome Courtesy',
        discountType: 'percentage',
        discountValue: 10,
        currency: 'INR',
        minCartValueINR: 50000,
        maxDiscountINR: 50000,
        usageCount: 14,
        perCustomerLimit: 1,
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        allowStacking: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cpn_royal20',
        code: 'ROYAL20',
        description: '20% Salon Privilege for High Joaillerie',
        discountType: 'percentage',
        discountValue: 20,
        currency: 'INR',
        minCartValueINR: 200000,
        maxDiscountINR: 100000,
        usageCount: 3,
        perCustomerLimit: 1,
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        allowStacking: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedCoupons.forEach((c) => this.coupons.set(c.code, c));

    // 11. Seed Campaigns
    const seedCampaigns: Campaign[] = [
      {
        id: 'cmp_festive_2026',
        code: 'SEJAL-ROYAL-FESTIVE-26',
        name: 'The Royal Autumn & Festive Edit 2026',
        description: 'Seasonal luxury launch spotlighting bespoke high jewellery suites and zardozi silk drapes.',
        landingPageSlug: 'bridal-edit',
        collectionSlug: 'signature-collection',
        featuredProductIds: ['prod-1', 'prod-8'],
        bannerId: 'bnr_hero_main',
        couponCode: 'PRIVE10',
        targetAudience: 'VIP Privé & Global Connoisseurs',
        utmCampaignTag: 'autumn_festive_2026',
        startDate: '2026-08-01T00:00:00Z',
        endDate: '2026-10-31T23:59:59Z',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedCampaigns.forEach((cmp) => this.campaigns.set(cmp.id, cmp));

    // 12. Seed International Shipping Rules
    this.shippingRules = [
      {
        id: 'rule_india_domestic',
        country: 'India',
        countryCode: 'IN',
        zone: 'Domestic Armoured',
        minOrderValueINR: 0,
        freeShippingThresholdINR: 10000,
        standardRateINR: 0, // Complimentary for SEJAL
        expressRateINR: 2500,
        carrier: 'sejal_armoured',
        estimatedDeliveryDaysMin: 2,
        estimatedDeliveryDaysMax: 4,
        taxRatePercentage: 18,
        dutiesIncluded: true,
      },
      {
        id: 'rule_uae_gcc',
        country: 'United Arab Emirates',
        countryCode: 'AE',
        zone: 'GCC Luxury Priority',
        minOrderValueINR: 0,
        freeShippingThresholdINR: 50000,
        standardRateINR: 4500,
        expressRateINR: 8500,
        carrier: 'dhl_express',
        estimatedDeliveryDaysMin: 2,
        estimatedDeliveryDaysMax: 3,
        taxRatePercentage: 5,
        dutiesIncluded: true,
      },
      {
        id: 'rule_usa_na',
        country: 'United States',
        countryCode: 'US',
        zone: 'North America Priority Air',
        minOrderValueINR: 0,
        freeShippingThresholdINR: 75000,
        standardRateINR: 6500,
        expressRateINR: 12000,
        carrier: 'fedex_priority',
        estimatedDeliveryDaysMin: 3,
        estimatedDeliveryDaysMax: 5,
        taxRatePercentage: 0,
        dutiesIncluded: true,
      },
      {
        id: 'rule_aus_oceania',
        country: 'Australia',
        countryCode: 'AU',
        zone: 'Oceania Express',
        minOrderValueINR: 0,
        freeShippingThresholdINR: 75000,
        standardRateINR: 7000,
        expressRateINR: 13500,
        carrier: 'dhl_express',
        estimatedDeliveryDaysMin: 4,
        estimatedDeliveryDaysMax: 6,
        taxRatePercentage: 10,
        dutiesIncluded: true,
      },
    ];

    // 12. Seed Phase 5 Customer 360 Profiles
    const seedCrmProfiles: Customer360Profile[] = [
      {
        id: 'cust_sheikha_uae',
        email: 'sheikha.alsabah@dubairoyal.ae',
        phone: '+971 50 123 4567',
        firstName: 'Sheikha',
        lastName: 'Al-Sabah',
        country: 'United Arab Emirates',
        preferredCurrency: 'AED',
        totalOrdersCount: 3,
        lifetimeSpendINR: 4850000,
        averageOrderValueINR: 1616666,
        firstOrderDate: '2026-04-12T10:00:00Z',
        lastOrderDate: '2026-08-15T14:30:00Z',
        viewedProductIds: ['prod-1', 'prod-2', 'prod-7'],
        wishlistProductIds: ['prod-1', 'prod-7'],
        cartProductIds: [],
        preferredCategories: ['high-jewellery', 'couture-drapes'],
        preferredBrands: ['SEJAL Signature Joaillerie'],
        priveTier: 'Diamond High Salon',
        privePoints: 48500,
        isPriveEligible: true,
        assignedConciergeStaff: 'Senior Gemologist Rhea Kapoor',
        conciergeRequestsCount: 2,
        lastConciergeContactDate: '2026-08-16T12:00:00Z',
        totalReturnsCount: 0,
        totalRefundedINR: 0,
        returnRatePercentage: 0,
        acquisitionSource: 'influencer',
        firstUtmSource: 'instagram',
        firstUtmMedium: 'story_link',
        firstUtmCampaign: 'uae_royal_launch_2026',
        attributedInfluencerId: 'inf_sheikha',
        consent: {
          marketingEmail: true,
          marketingWhatsApp: true,
          marketingSMS: true,
          frequencyPreference: 'vip_invites_only',
          lastConsentUpdated: '2026-04-12T10:00:00Z',
          consentSource: 'concierge_direct',
        },
        activeSegmentIds: ['seg_prive_uae', 'seg_jewellery_connoisseurs'],
        createdAt: '2026-04-12T10:00:00Z',
        updatedAt: '2026-08-16T12:00:00Z',
      },
      {
        id: 'cust_gayatridevi_in',
        email: 'gayatridevi@jaipur-heritage.in',
        phone: '+91 98200 88990',
        firstName: 'Princess Gayatri',
        lastName: 'Devi',
        country: 'India',
        preferredCurrency: 'INR',
        totalOrdersCount: 2,
        lifetimeSpendINR: 1850000,
        averageOrderValueINR: 925000,
        firstOrderDate: '2026-05-20T11:00:00Z',
        lastOrderDate: '2026-08-20T16:00:00Z',
        viewedProductIds: ['prod-1', 'prod-3', 'prod-5'],
        wishlistProductIds: ['prod-3'],
        cartProductIds: [],
        preferredCategories: ['high-jewellery', 'royal-heritage-silks'],
        preferredBrands: ['SEJAL Signature Joaillerie'],
        priveTier: 'Gold Privé',
        privePoints: 18500,
        isPriveEligible: true,
        assignedConciergeStaff: 'Senior Gemologist Rhea Kapoor',
        conciergeRequestsCount: 1,
        totalReturnsCount: 0,
        totalRefundedINR: 0,
        returnRatePercentage: 0,
        acquisitionSource: 'organic',
        consent: {
          marketingEmail: true,
          marketingWhatsApp: true,
          marketingSMS: false,
          frequencyPreference: 'weekly_curation',
          lastConsentUpdated: '2026-05-20T11:00:00Z',
          consentSource: 'account_portal',
        },
        activeSegmentIds: ['seg_jewellery_connoisseurs'],
        createdAt: '2026-05-20T11:00:00Z',
        updatedAt: '2026-08-20T16:00:00Z',
      },
    ];
    seedCrmProfiles.forEach((p) => this.crmProfiles.set(p.id, p));

    // 13. Seed Dynamic Segments
    const seedSegments: DynamicSegment[] = [
      {
        id: 'seg_prive_uae',
        name: 'UAE Privé Royalty & VIPs',
        description: 'Clients in UAE with lifetime spend exceeding ₹1,000,000 (AED ~44,000).',
        logic: 'ALL',
        rules: [
          { field: 'country', operator: 'equals', value: 'United Arab Emirates' },
          { field: 'lifetimeSpendINR', operator: 'greater_than_or_equal', value: 1000000 },
        ],
        memberCount: 1,
        isSystemSegment: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastCalculatedAt: new Date().toISOString(),
      },
      {
        id: 'seg_jewellery_connoisseurs',
        name: 'High Jewellery Connoisseurs',
        description: 'Clients who have purchased or browsed high jewellery creations.',
        logic: 'ANY',
        rules: [
          { field: 'categoryAffinity', operator: 'contains', value: 'high-jewellery' },
          { field: 'lifetimeSpendINR', operator: 'greater_than_or_equal', value: 500000 },
        ],
        memberCount: 2,
        isSystemSegment: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastCalculatedAt: new Date().toISOString(),
      },
      {
        id: 'seg_abandoned_cart_high_value',
        name: 'High-Value Abandoned Bag (₹200k+)',
        description: 'Prospects with unpurchased selections awaiting in luxury bag.',
        logic: 'ALL',
        rules: [
          { field: 'hasAbandonedCart', operator: 'is_true', value: true },
        ],
        memberCount: 0,
        isSystemSegment: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastCalculatedAt: new Date().toISOString(),
      },
    ];
    seedSegments.forEach((s) => this.dynamicSegments.set(s.id, s));

    // 14. Seed Notification Templates
    const seedTemplates: NotificationTemplate[] = [
      {
        id: 'tmpl_abandoned_cart_sejal',
        name: 'Your SEJAL Selection Awaits (Abandoned Cart)',
        category: 'abandoned_cart',
        channel: 'email',
        subjectTemplate: 'Your SEJAL Selection Awaits, {{customer_name}}',
        bodyTemplate: 'Dear {{customer_name}},\n\nYour curated selection of {{product_name}} remains reserved in the Maison SEJAL vault for a limited window.\n\nShould you wish to complete your private acquisition or request bespoke styling guidance, your selection is prepared.\n\nWarmest regards,\nMaison SEJAL Privé Concierge',
        supportedVariables: ['customer_name', 'product_name', 'cart_url', 'currency'],
        isTransactional: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'tmpl_abandoned_cart_whatsapp',
        name: 'WhatsApp Concierge Whisper (Abandoned Bag)',
        category: 'abandoned_cart',
        channel: 'whatsapp',
        bodyTemplate: 'Maison SEJAL Privé: Dear {{customer_name}}, your private selection of {{product_name}} awaits your review. Would you like our gemologist concierge to assist with your bespoke order?',
        supportedVariables: ['customer_name', 'product_name'],
        isTransactional: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'tmpl_prive_invitation',
        name: 'Maison SEJAL Privé Elevation Invitation',
        category: 'prive_invitation',
        channel: 'email',
        subjectTemplate: 'An Invitation to Maison SEJAL Diamond High Salon',
        bodyTemplate: 'Dear {{customer_name}},\n\nIn recognition of your exceptional patronage with Maison SEJAL, Founder Sejal Gupta cordially invites you to the Diamond High Salon.\n\nYour Privé privileges include dedicated white-glove concierge access, private salon preview invitations in Dubai and Mumbai, and bespoke heirloom crafting allocations.',
        supportedVariables: ['customer_name', 'prive_tier'],
        isTransactional: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedTemplates.forEach((t) => this.notificationTemplates.set(t.id, t));

    // 15. Seed Marketing Workflows
    const seedWorkflows: MarketingWorkflow[] = [
      {
        id: 'wf_abandoned_cart_luxury',
        name: 'Quiet Luxury Abandoned Selection Recovery',
        description: 'Subtle, respectful abandoned-cart recovery workflow with purchase exit checks.',
        triggerType: 'cart_abandoned',
        isActive: true,
        frequencyCapHours: 48,
        quietHoursEnforced: true,
        totalEnrolledCount: 14,
        totalConvertedCount: 6,
        totalRevenueGeneratedINR: 4250000,
        steps: [
          {
            id: 'step_1_delay',
            stepType: 'delay',
            delayMinutes: 120, // 2 Hours
            nextStepId: 'step_2_cond',
          },
          {
            id: 'step_2_cond',
            stepType: 'condition',
            condition: {
              field: 'hasPurchasedSinceTrigger',
              operator: 'is_false',
              value: false,
            },
            nextStepId: 'step_3_email',
            onConditionFalseGotoStepId: undefined, // Exit
          },
          {
            id: 'step_3_email',
            stepType: 'action',
            action: {
              channel: 'email',
              templateId: 'tmpl_abandoned_cart_sejal',
            },
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    seedWorkflows.forEach((wf) => this.marketingWorkflows.set(wf.id, wf));

    // 16. Seed Influencers & Creators
    const seedInfluencers: InfluencerProfile[] = [
      {
        id: 'inf_sheikha',
        handle: '@sheikha_style',
        fullName: 'Sheikha Noor Al-Khalifa',
        email: 'noor@sheikhastyle.com',
        phone: '+971 55 998 8112',
        country: 'United Arab Emirates',
        uniqueCode: 'SEJALXSHEIKHA',
        referralSlug: '/invite/sheikha',
        commissionModel: 'percentage',
        commissionRate: 10,
        status: 'active',
        totalClicks: 1420,
        totalOrdersCount: 8,
        totalGrossRevenueINR: 5600000,
        totalRefundedRevenueINR: 0,
        netEligibleRevenueINR: 5600000,
        totalCommissionEarnedINR: 560000,
        totalCommissionPaidINR: 350000,
        pendingCommissionINR: 210000,
        createdAt: '2026-03-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'inf_natasha',
        handle: '@natasharoyal',
        fullName: 'Natasha Poonawalla Edit',
        email: 'natasha@royalstyling.in',
        phone: '+91 98111 22334',
        country: 'India',
        uniqueCode: 'NATASHAPRIVE',
        referralSlug: '/invite/natasha',
        commissionModel: 'percentage',
        commissionRate: 8,
        status: 'active',
        totalClicks: 2150,
        totalOrdersCount: 11,
        totalGrossRevenueINR: 8400000,
        totalRefundedRevenueINR: 650000,
        netEligibleRevenueINR: 7750000,
        totalCommissionEarnedINR: 620000,
        totalCommissionPaidINR: 450000,
        pendingCommissionINR: 170000,
        createdAt: '2026-02-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];
    seedInfluencers.forEach((inf) => this.influencers.set(inf.id, inf));

    // 17. Seed Affiliates
    const seedAffiliates: AffiliateProfile[] = [
      {
        id: 'aff_vogue_me',
        companyName: 'Vogue Middle East Luxury Guild',
        contactPerson: 'Kareem Al-Sayed',
        email: 'partnerships@vogue.me',
        phone: '+971 4 332 9900',
        websiteUrl: 'https://en.vogue.me',
        uniqueCode: 'VOGUEMIDDLEEAST',
        referralSlug: '/partner/vogue-me',
        commissionPercentage: 8,
        status: 'active',
        totalClicks: 4500,
        totalOrdersCount: 18,
        totalGrossRevenueINR: 12400000,
        netEligibleRevenueINR: 12400000,
        totalCommissionEarnedINR: 992000,
        pendingPayoutINR: 320000,
        createdAt: '2026-01-10T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];
    seedAffiliates.forEach((aff) => this.affiliates.set(aff.id, aff));
  }
}

export const store = new CommerceStore();
