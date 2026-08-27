import { apiClient } from './apiClient';
import { HomepageSection, Banner, LandingPage, EditorialArticle } from '../types/cms';

export class CmsService {
  public async getActiveHomepageSections(): Promise<HomepageSection[]> {
    try {
      const res = await apiClient.get<HomepageSection[]>('/cms/homepage/sections');
      return res.data;
    } catch {
      return [];
    }
  }

  public async getBanners(activeOnly: boolean = true): Promise<Banner[]> {
    try {
      const res = await apiClient.get<Banner[]>('/cms/banners', { activeOnly: String(activeOnly) });
      return res.data;
    } catch {
      return [];
    }
  }

  public async getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
    try {
      const res = await apiClient.get<LandingPage>(`/cms/landing-pages/${slug}`);
      return res.data;
    } catch {
      return null;
    }
  }

  public async getEditorialBySlug(slug: string): Promise<EditorialArticle | null> {
    try {
      const res = await apiClient.get<EditorialArticle>(`/cms/editorials/${slug}`);
      return res.data;
    } catch {
      return null;
    }
  }

  public async getPublishedEditorials(): Promise<EditorialArticle[]> {
    try {
      const res = await apiClient.get<EditorialArticle[]>('/cms/editorials', { publishedOnly: 'true' });
      return res.data;
    } catch {
      return [];
    }
  }
}

export const cmsService = new CmsService();
