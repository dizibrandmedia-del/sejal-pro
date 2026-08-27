import { Router, Request, Response } from 'express';
import { catalogueEngine } from '../services/catalogueEngine';
import { cmsEngine } from '../services/cmsEngine';

export const catalogueRouter = Router();

// ==========================================
// 1. PRODUCTS
// ==========================================

catalogueRouter.get('/products', (req: Request, res: Response) => {
  try {
    const { category, collection, search, status } = req.query;
    const products = catalogueEngine.listProducts({
      category: category as string,
      collection: collection as string,
      search: search as string,
      status: status as string,
    });
    return res.status(200).json({ success: true, data: products, count: products.length });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

catalogueRouter.get('/products/:id', (req: Request, res: Response) => {
  try {
    const product = catalogueEngine.getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

catalogueRouter.post('/products', (req: Request, res: Response) => {
  try {
    const { product, actor } = req.body;
    if (!product || !product.name || !product.sku || !product.basePriceINR) {
      return res.status(400).json({ success: false, error: 'Missing mandatory fields (name, sku, basePriceINR).' });
    }

    const created = catalogueEngine.createProduct(product, actor || 'Product Manager');
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

catalogueRouter.patch('/products/:id', (req: Request, res: Response) => {
  try {
    const { updates, actor } = req.body;
    const updated = catalogueEngine.updateProduct(req.params.id, updates, actor || 'Product Manager');
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

catalogueRouter.post('/products/:id/duplicate', (req: Request, res: Response) => {
  try {
    const { actor } = req.body;
    const duplicated = catalogueEngine.duplicateProduct(req.params.id, actor || 'Product Manager');
    return res.status(201).json({ success: true, data: duplicated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

catalogueRouter.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const { actor } = req.body;
    catalogueEngine.deleteProduct(req.params.id, actor || 'Product Manager');
    return res.status(200).json({ success: true, message: `Product ${req.params.id} deleted.` });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. PRODUCT TYPES & ATTRIBUTES
// ==========================================

catalogueRouter.get('/product-types', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: catalogueEngine.listProductTypes() });
});

catalogueRouter.post('/product-types', (req: Request, res: Response) => {
  try {
    const { name, code, description, attributeIds, variantAttributeIds, hasVariants, actor } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, error: 'Name and code are required.' });
    }

    const created = catalogueEngine.createProductType({
      name,
      code,
      description: description || '',
      attributeIds: attributeIds || [],
      variantAttributeIds: variantAttributeIds || [],
      hasVariants: hasVariants ?? true,
      actor,
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

catalogueRouter.patch('/product-types/:id', (req: Request, res: Response) => {
  try {
    const updated = catalogueEngine.updateProductType(req.params.id, req.body.updates, req.body.actor);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

catalogueRouter.get('/attributes', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: catalogueEngine.listAttributes() });
});

catalogueRouter.post('/attributes', (req: Request, res: Response) => {
  try {
    const created = catalogueEngine.createAttribute(req.body);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

catalogueRouter.patch('/attributes/:id', (req: Request, res: Response) => {
  try {
    const updated = catalogueEngine.updateAttribute(req.params.id, req.body.updates, req.body.actor);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. CATEGORIES, COLLECTIONS & BRANDS
// ==========================================

catalogueRouter.get('/categories', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: catalogueEngine.listCategories() });
});

catalogueRouter.post('/categories', (req: Request, res: Response) => {
  try {
    const created = catalogueEngine.createCategory(req.body.category, req.body.actor);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

catalogueRouter.get('/collections', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: catalogueEngine.listCollections() });
});

catalogueRouter.post('/collections', (req: Request, res: Response) => {
  try {
    const created = catalogueEngine.createCollection(req.body.collection, req.body.actor);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

catalogueRouter.get('/brands', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: catalogueEngine.listBrands() });
});

catalogueRouter.post('/brands', (req: Request, res: Response) => {
  try {
    const created = catalogueEngine.createBrand(req.body.brand, req.body.actor);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. MEDIA LIBRARY
// ==========================================

catalogueRouter.get('/media', (req: Request, res: Response) => {
  const { folder, search } = req.query;
  const list = cmsEngine.listMedia({ folder: folder as string, search: search as string });
  return res.status(200).json({ success: true, data: list, count: list.length });
});

catalogueRouter.post('/media', (req: Request, res: Response) => {
  try {
    const uploaded = cmsEngine.uploadMedia(req.body);
    return res.status(201).json({ success: true, data: uploaded });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

catalogueRouter.delete('/media/:id', (req: Request, res: Response) => {
  cmsEngine.deleteMedia(req.params.id);
  return res.status(200).json({ success: true, message: 'Media asset deleted.' });
});
