import { Router, Request, Response } from 'express';
import { cmsEngine } from '../services/cmsEngine';
import { store } from '../db/store';

export const cmsRouter = Router();

// ==========================================
// 1. DYNAMIC HOMEPAGE SECTIONS
// ==========================================

cmsRouter.get('/homepage/sections', (req: Request, res: Response) => {
  const includeAll = req.query.includeAll === 'true';
  const sections = cmsEngine.getHomepageSections(includeAll);
  return res.status(200).json({ success: true, data: sections });
});

cmsRouter.patch('/homepage/sections/:id', (req: Request, res: Response) => {
  try {
    const { updates, actor } = req.body;
    const updated = cmsEngine.updateSection(req.params.id, updates, actor);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

cmsRouter.post('/homepage/sections/reorder', (req: Request, res: Response) => {
  try {
    const { orderedIds, actor } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, error: 'orderedIds array is required.' });
    }
    const reordered = cmsEngine.reorderSections(orderedIds, actor);
    return res.status(200).json({ success: true, data: reordered });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. BANNERS
// ==========================================

cmsRouter.get('/banners', (req: Request, res: Response) => {
  const activeOnly = req.query.activeOnly === 'true';
  const banners = cmsEngine.listBanners(activeOnly);
  return res.status(200).json({ success: true, data: banners });
});

cmsRouter.post('/banners', (req: Request, res: Response) => {
  try {
    const created = cmsEngine.createBanner(req.body.banner, req.body.actor);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

cmsRouter.patch('/banners/:id', (req: Request, res: Response) => {
  try {
    const updated = cmsEngine.updateBanner(req.params.id, req.body.updates, req.body.actor);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

cmsRouter.delete('/banners/:id', (req: Request, res: Response) => {
  cmsEngine.deleteBanner(req.params.id, req.body.actor);
  return res.status(200).json({ success: true, message: 'Banner deleted.' });
});

// ==========================================
// 3. LANDING PAGES
// ==========================================

cmsRouter.get('/landing-pages', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: cmsEngine.listLandingPages() });
});

cmsRouter.get('/landing-pages/:slug', (req: Request, res: Response) => {
  const page = cmsEngine.getLandingPage(req.params.slug);
  if (!page) return res.status(404).json({ success: false, error: 'Landing page not found.' });
  return res.status(200).json({ success: true, data: page });
});

cmsRouter.post('/landing-pages', (req: Request, res: Response) => {
  try {
    const created = cmsEngine.createLandingPage(req.body.landingPage, req.body.actor);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

cmsRouter.patch('/landing-pages/:id', (req: Request, res: Response) => {
  try {
    const updated = cmsEngine.updateLandingPage(req.params.id, req.body.updates, req.body.actor);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. EDITORIAL JOURNAL
// ==========================================

cmsRouter.get('/editorials', (req: Request, res: Response) => {
  const publishedOnly = req.query.publishedOnly === 'true';
  const articles = cmsEngine.listArticles(publishedOnly);
  return res.status(200).json({ success: true, data: articles });
});

cmsRouter.get('/editorials/:slug', (req: Request, res: Response) => {
  const article = cmsEngine.getArticle(req.params.slug);
  if (!article) return res.status(404).json({ success: false, error: 'Article not found.' });
  return res.status(200).json({ success: true, data: article });
});

cmsRouter.post('/editorials', (req: Request, res: Response) => {
  try {
    const created = cmsEngine.createArticle(req.body.article, req.body.actor);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. SEO SITEMAP & ROBOTS
// ==========================================

cmsRouter.get('/seo/sitemap.xml', (_req: Request, res: Response) => {
  const baseUrl = 'https://sejal.pro';
  const staticUrls = ['/', '/shop', '/story', '/prive', '/gifting', '/journal'];
  const productUrls = Array.from(store.products.values()).map((p) => `/product/${p.slug}`);
  const categoryUrls = Array.from(store.categories.values()).map((c) => `/category/${c.slug}`);
  const landingUrls = Array.from(store.landingPages.values()).map((lp) => `/${lp.slug}`);

  const allUrls = [...staticUrls, ...categoryUrls, ...landingUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${baseUrl}${u}</loc>
    <changefreq>daily</changefreq>
    <priority>${u === '/' ? '1.0' : u.startsWith('/product/') ? '0.8' : '0.6'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  return res.status(200).send(xml);
});

cmsRouter.get('/seo/robots.txt', (_req: Request, res: Response) => {
  const robots = `User-agent: *
Allow: /
Disallow: /account
Disallow: /checkout
Disallow: /admin
Disallow: /api/

Sitemap: https://sejal.pro/api/cms/seo/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send(robots);
});
