import { store } from '../db/store';
import { HomepageSection, Banner, LandingPage, EditorialArticle, MediaAsset } from '../../src/types/cms';
import { auditLogEngine } from './auditLogEngine';

export class CmsEngine {
  // ==========================================
  // 1. DYNAMIC HOMEPAGE SECTION BUILDER
  // ==========================================

  public getHomepageSections(includeDisabled: boolean = false): HomepageSection[] {
    const now = new Date().getTime();
    let sections = Array.from(store.homepageSections.values()).sort((a, b) => a.sortOrder - b.sortOrder);

    if (!includeDisabled) {
      sections = sections.filter((s) => {
        if (!s.isEnabled) return false;
        if (s.scheduleStart && new Date(s.scheduleStart).getTime() > now) return false;
        if (s.scheduleEnd && new Date(s.scheduleEnd).getTime() < now) return false;
        return true;
      });
    }

    return sections;
  }

  public updateSection(id: string, updates: Partial<HomepageSection>, actor: string = 'Content Manager'): HomepageSection {
    const sec = store.homepageSections.get(id);
    if (!sec) throw new Error(`Homepage section ${id} not found.`);

    Object.assign(sec, updates, { updatedAt: new Date().toISOString() });
    store.homepageSections.set(sec.id, sec);

    auditLogEngine.logAudit({
      entityType: 'HomepageSection',
      entityId: sec.id,
      referenceCode: sec.type,
      action: 'HOMEPAGE_SECTION_UPDATED',
      actor,
      reason: `Updated section "${sec.title}" (Enabled: ${sec.isEnabled}, Order: ${sec.sortOrder})`,
    });

    return sec;
  }

  public reorderSections(orderedIds: string[], actor: string = 'Content Manager'): HomepageSection[] {
    orderedIds.forEach((id, idx) => {
      const sec = store.homepageSections.get(id);
      if (sec) {
        sec.sortOrder = idx + 1;
        sec.updatedAt = new Date().toISOString();
        store.homepageSections.set(id, sec);
      }
    });

    auditLogEngine.logAudit({
      entityType: 'HomepageSection',
      entityId: 'homepage_layout',
      referenceCode: 'reorder',
      action: 'HOMEPAGE_REORDERED',
      actor,
      reason: `Reordered ${orderedIds.length} homepage sections`,
    });

    return this.getHomepageSections(true);
  }

  // ==========================================
  // 2. BANNER MANAGEMENT
  // ==========================================

  public listBanners(activeOnly: boolean = false): Banner[] {
    const now = new Date().getTime();
    let banners = Array.from(store.banners.values()).sort((a, b) => b.priority - a.priority);

    if (activeOnly) {
      banners = banners.filter((b) => {
        if (!b.isActive) return false;
        if (b.scheduleStart && new Date(b.scheduleStart).getTime() > now) return false;
        if (b.scheduleEnd && new Date(b.scheduleEnd).getTime() < now) return false;
        return true;
      });
    }

    return banners;
  }

  public createBanner(params: any, actor: string = 'Marketing Manager'): Banner {
    const id = `bnr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const banner: Banner = {
      id,
      title: params.title,
      subtitle: params.subtitle,
      placement: params.placement || 'homepage_hero',
      desktopMediaUrl: params.desktopMediaUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600',
      mobileMediaUrl: params.mobileMediaUrl || params.desktopMediaUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800',
      ctaText: params.ctaText || 'EXPLORE THE EDIT',
      destinationUrl: params.destinationUrl || '/shop',
      scheduleStart: params.scheduleStart,
      scheduleEnd: params.scheduleEnd,
      priority: Number(params.priority) || 1,
      isActive: params.isActive ?? true,
      altText: params.altText || params.title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.banners.set(banner.id, banner);

    auditLogEngine.logAudit({
      entityType: 'Banner',
      entityId: banner.id,
      referenceCode: banner.placement,
      action: 'BANNER_CREATED',
      actor,
      reason: `Created banner: ${banner.title}`,
    });

    return banner;
  }

  public updateBanner(id: string, updates: Partial<Banner>, actor: string = 'Marketing Manager'): Banner {
    const banner = store.banners.get(id);
    if (!banner) throw new Error(`Banner ${id} not found.`);

    Object.assign(banner, updates, { updatedAt: new Date().toISOString() });
    store.banners.set(banner.id, banner);

    auditLogEngine.logAudit({
      entityType: 'Banner',
      entityId: banner.id,
      referenceCode: banner.placement,
      action: 'BANNER_UPDATED',
      actor,
      reason: `Updated banner: ${banner.title}`,
    });

    return banner;
  }

  public deleteBanner(id: string, actor: string = 'Marketing Manager'): boolean {
    store.banners.delete(id);
    return true;
  }

  // ==========================================
  // 3. MODULAR LANDING PAGE BUILDER
  // ==========================================

  public listLandingPages(): LandingPage[] {
    return Array.from(store.landingPages.values());
  }

  public getLandingPage(slug: string): LandingPage | undefined {
    for (const page of store.landingPages.values()) {
      if (page.slug === slug || page.id === slug) return page;
    }
    return undefined;
  }

  public createLandingPage(params: any, actor: string = 'Marketing Manager'): LandingPage {
    const slug = params.slug || params.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `lp_${slug}`;

    if (store.landingPages.has(id)) {
      throw new Error(`Landing page with slug "${slug}" already exists.`);
    }

    const newPage: LandingPage = {
      id,
      slug,
      title: params.title,
      tagline: params.tagline,
      blocks: params.blocks || [],
      isPublished: params.isPublished ?? true,
      scheduleStart: params.scheduleStart,
      scheduleEnd: params.scheduleEnd,
      metaTitle: params.metaTitle || `${params.title} | SEJAL.PRO Luxury`,
      metaDescription: params.metaDescription || params.tagline || '',
      ogImageUrl: params.ogImageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.landingPages.set(newPage.id, newPage);

    auditLogEngine.logAudit({
      entityType: 'LandingPage',
      entityId: newPage.id,
      referenceCode: newPage.slug,
      action: 'LANDING_PAGE_CREATED',
      actor,
      reason: `Created landing page: ${newPage.title} (/${newPage.slug})`,
    });

    return newPage;
  }

  public updateLandingPage(id: string, updates: Partial<LandingPage>, actor: string = 'Marketing Manager'): LandingPage {
    const page = store.landingPages.get(id);
    if (!page) throw new Error(`Landing page ${id} not found.`);

    Object.assign(page, updates, { updatedAt: new Date().toISOString() });
    store.landingPages.set(page.id, page);

    auditLogEngine.logAudit({
      entityType: 'LandingPage',
      entityId: page.id,
      referenceCode: page.slug,
      action: 'LANDING_PAGE_UPDATED',
      actor,
      reason: `Updated landing page: ${page.title}`,
    });

    return page;
  }

  // ==========================================
  // 4. EDITORIAL JOURNAL CMS
  // ==========================================

  public listArticles(publishedOnly: boolean = false): EditorialArticle[] {
    let list = Array.from(store.editorials.values());
    if (publishedOnly) {
      list = list.filter((a) => a.isPublished);
    }
    return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  public getArticle(slug: string): EditorialArticle | undefined {
    for (const a of store.editorials.values()) {
      if (a.slug === slug || a.id === slug) return a;
    }
    return undefined;
  }

  public createArticle(params: any, actor: string = 'Content Manager'): EditorialArticle {
    const slug = params.slug || params.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newArticle: EditorialArticle = {
      id,
      slug,
      title: params.title,
      subtitle: params.subtitle || '',
      author: params.author || 'Maison SEJAL Editorial Board',
      category: params.category || 'High Jewellery',
      coverImageUrl: params.coverImageUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200',
      excerpt: params.excerpt || '',
      bodyMarkdown: params.bodyMarkdown || '',
      readTimeMinutes: Number(params.readTimeMinutes) || 4,
      relatedProductIds: params.relatedProductIds || [],
      tags: params.tags || [],
      isPublished: params.isPublished ?? true,
      publishedAt: params.publishedAt || new Date().toISOString(),
      metaTitle: params.metaTitle || `${params.title} | The SEJAL Journal`,
      metaDescription: params.metaDescription || params.excerpt || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.editorials.set(newArticle.id, newArticle);

    auditLogEngine.logAudit({
      entityType: 'Editorial',
      entityId: newArticle.id,
      referenceCode: newArticle.slug,
      action: 'ARTICLE_CREATED',
      actor,
      reason: `Created journal article: ${newArticle.title}`,
    });

    return newArticle;
  }

  // ==========================================
  // 5. MEDIA LIBRARY
  // ==========================================

  public listMedia(filter?: { folder?: string; search?: string }): MediaAsset[] {
    let list = Array.from(store.mediaAssets.values());
    if (filter?.folder) {
      list = list.filter((m) => m.folder === filter.folder);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.altText.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public uploadMedia(params: any): MediaAsset {
    const id = `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const asset: MediaAsset = {
      id,
      name: params.name || 'Luxury Asset',
      url: params.url,
      fileType: params.fileType || 'image/jpeg',
      sizeBytes: Number(params.sizeBytes) || 240000,
      width: params.width || 1200,
      height: params.height || 1500,
      tags: params.tags || ['luxury', 'editorial'],
      folder: params.folder || 'products',
      altText: params.altText || params.name || 'SEJAL Creation',
      createdAt: new Date().toISOString(),
    };

    store.mediaAssets.set(asset.id, asset);
    return asset;
  }

  public deleteMedia(id: string): boolean {
    return store.mediaAssets.delete(id);
  }
}

export const cmsEngine = new CmsEngine();
