import { store } from '../db/store';
import { Product, ProductVariant, Category, Collection, Brand } from '../../src/types/product';
import { ProductType, CustomAttribute } from '../../src/types/admin';
import { auditLogEngine } from './auditLogEngine';

export class CatalogueEngine {
  // ==========================================
  // 1. PRODUCT TYPE BUILDER (Dynamic & Reusable)
  // ==========================================

  public listProductTypes(): ProductType[] {
    return Array.from(store.productTypes.values());
  }

  public getProductType(id: string): ProductType | undefined {
    return store.productTypes.get(id);
  }

  public createProductType(params: {
    name: string;
    code: string;
    description: string;
    attributeIds: string[];
    variantAttributeIds: string[];
    hasVariants: boolean;
    actor?: string;
  }): ProductType {
    const id = `pt_${params.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    if (store.productTypes.has(id)) {
      throw new Error(`Product type with code "${params.code}" already exists.`);
    }

    const newType: ProductType = {
      id,
      code: params.code,
      name: params.name,
      description: params.description,
      attributeIds: params.attributeIds,
      variantAttributeIds: params.variantAttributeIds,
      hasVariants: params.hasVariants,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.productTypes.set(newType.id, newType);

    auditLogEngine.logAudit({
      entityType: 'ProductType',
      entityId: newType.id,
      referenceCode: newType.code,
      action: 'PRODUCT_TYPE_CREATED',
      actor: params.actor || 'Product Manager',
      reason: `Created product type: ${newType.name}`,
    });

    return newType;
  }

  public updateProductType(id: string, updates: Partial<ProductType>, actor?: string): ProductType {
    const pt = store.productTypes.get(id);
    if (!pt) throw new Error(`Product type ${id} not found.`);

    Object.assign(pt, updates, { updatedAt: new Date().toISOString() });
    store.productTypes.set(pt.id, pt);

    auditLogEngine.logAudit({
      entityType: 'ProductType',
      entityId: pt.id,
      referenceCode: pt.code,
      action: 'PRODUCT_TYPE_UPDATED',
      actor: actor || 'Product Manager',
      reason: `Updated product type: ${pt.name}`,
    });

    return pt;
  }

  public deleteProductType(id: string, actor?: string): boolean {
    const pt = store.productTypes.get(id);
    if (!pt) throw new Error(`Product type ${id} not found.`);

    store.productTypes.delete(id);

    auditLogEngine.logAudit({
      entityType: 'ProductType',
      entityId: id,
      referenceCode: pt.code,
      action: 'PRODUCT_TYPE_DELETED',
      actor: actor || 'Product Manager',
      reason: `Deleted product type: ${pt.name}`,
    });

    return true;
  }

  // ==========================================
  // 2. CUSTOM ATTRIBUTE BUILDER
  // ==========================================

  public listAttributes(): CustomAttribute[] {
    return Array.from(store.customAttributes.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getAttribute(id: string): CustomAttribute | undefined {
    return store.customAttributes.get(id);
  }

  public createAttribute(params: {
    code: string;
    label: string;
    fieldType: any;
    description?: string;
    options?: any[];
    unit?: string;
    isRequired?: boolean;
    isVisibleOnProductPage?: boolean;
    isFilterable?: boolean;
    isSearchable?: boolean;
    isVariantDefining?: boolean;
    isInternalOnly?: boolean;
    actor?: string;
  }): CustomAttribute {
    const id = `attr_${params.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    if (store.customAttributes.has(id)) {
      throw new Error(`Attribute with code "${params.code}" already exists.`);
    }

    const newAttr: CustomAttribute = {
      id,
      code: params.code,
      label: params.label,
      fieldType: params.fieldType,
      description: params.description,
      options: params.options || [],
      unit: params.unit,
      isRequired: params.isRequired ?? false,
      isVisibleOnProductPage: params.isVisibleOnProductPage ?? true,
      isFilterable: params.isFilterable ?? true,
      isSearchable: params.isSearchable ?? true,
      isVariantDefining: params.isVariantDefining ?? false,
      isInternalOnly: params.isInternalOnly ?? false,
      displayOrder: store.customAttributes.size + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.customAttributes.set(newAttr.id, newAttr);

    auditLogEngine.logAudit({
      entityType: 'Attribute',
      entityId: newAttr.id,
      referenceCode: newAttr.code,
      action: 'ATTRIBUTE_CREATED',
      actor: params.actor || 'Product Manager',
      reason: `Created attribute: ${newAttr.label} (${newAttr.fieldType})`,
    });

    return newAttr;
  }

  public updateAttribute(id: string, updates: Partial<CustomAttribute>, actor?: string): CustomAttribute {
    const attr = store.customAttributes.get(id);
    if (!attr) throw new Error(`Attribute ${id} not found.`);

    Object.assign(attr, updates, { updatedAt: new Date().toISOString() });
    store.customAttributes.set(attr.id, attr);

    auditLogEngine.logAudit({
      entityType: 'Attribute',
      entityId: attr.id,
      referenceCode: attr.code,
      action: 'ATTRIBUTE_UPDATED',
      actor: actor || 'Product Manager',
      reason: `Updated attribute: ${attr.label}`,
    });

    return attr;
  }

  // ==========================================
  // 3. PRODUCT & VARIANT MANAGEMENT
  // ==========================================

  public listProducts(filters?: { category?: string; collection?: string; search?: string; status?: string }): Product[] {
    let list = Array.from(store.products.values());

    if (filters?.category) {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters?.collection) {
      list = list.filter((p) => p.collection === filters.collection);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getProduct(idOrSlug: string): Product | undefined {
    const byId = store.products.get(idOrSlug);
    if (byId) return byId;

    for (const p of store.products.values()) {
      if (p.slug === idOrSlug || p.sku === idOrSlug) return p;
    }
    return undefined;
  }

  public createProduct(payload: any, actor: string = 'Product Manager'): Product {
    const slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = payload.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Ensure SKU uniqueness
    if (Array.from(store.products.values()).some((p) => p.sku === payload.sku)) {
      throw new Error(`Product with SKU "${payload.sku}" already exists.`);
    }

    const newProduct: Product = {
      id,
      slug,
      sku: payload.sku,
      name: payload.name,
      subtitle: payload.subtitle,
      brand: payload.brand || 'SEJAL Signature',
      productType: payload.productType || 'high-jewellery',
      category: payload.category,
      subcategory: payload.subcategory,
      collection: payload.collection,
      tags: payload.tags || [],
      basePriceINR: Number(payload.basePriceINR) || 0,
      salePriceINR: payload.salePriceINR ? Number(payload.salePriceINR) : undefined,
      compareAtPriceINR: payload.compareAtPriceINR ? Number(payload.compareAtPriceINR) : undefined,
      availability: payload.availability || 'in-stock',
      stock: Number(payload.stock) || 4,
      isLimitedEdition: Boolean(payload.isLimitedEdition),
      isSignature: Boolean(payload.isSignature),
      isBestseller: Boolean(payload.isBestseller),
      isNewArrival: Boolean(payload.isNewArrival),
      shortDescription: payload.shortDescription || '',
      story: payload.story || '',
      details: payload.details || [],
      materials: payload.materials || [],
      craftsmanship: payload.craftsmanship || '',
      dimensions: payload.dimensions,
      careGuide: payload.careGuide || '',
      packagingDetails: payload.packagingDetails || 'Signature rose gold coffret',
      media: payload.media || [],
      variants: payload.variants || [],
      attributes: payload.attributes || [],
      rating: payload.rating || 5.0,
      reviewsCount: payload.reviewsCount || 0,
      seo: payload.seo || {
        metaTitle: `${payload.name} | SEJAL.PRO Luxury`,
        metaDescription: payload.shortDescription || '',
        canonicalUrl: `https://sejal.pro/product/${slug}`,
        keywords: payload.tags || [],
      },
      createdAt: new Date().toISOString(),
    };

    store.products.set(newProduct.id, newProduct);

    // Synchronize into Inventory Store
    if (newProduct.variants && newProduct.variants.length > 0) {
      newProduct.variants.forEach((v) => {
        store.inventory.set(v.sku, {
          id: `inv_${v.sku.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          productId: newProduct.id,
          productName: newProduct.name,
          variantId: v.id,
          sku: v.sku,
          variantTitle: v.title,
          totalQuantity: v.stock || 4,
          reservedQuantity: 0,
          availableQuantity: v.stock || 4,
          soldQuantity: 0,
          damagedQuantity: 0,
          returnedQuantity: 0,
          lowStockThreshold: 2,
          isLowStock: (v.stock || 4) <= 2,
          isOutOfStock: (v.stock || 4) <= 0,
          updatedAt: new Date().toISOString(),
        });
      });
    } else {
      store.inventory.set(newProduct.sku, {
        id: `inv_${newProduct.sku.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        productId: newProduct.id,
        productName: newProduct.name,
        variantId: 'var_default',
        sku: newProduct.sku,
        variantTitle: 'Default Masterpiece',
        totalQuantity: newProduct.stock,
        reservedQuantity: 0,
        availableQuantity: newProduct.stock,
        soldQuantity: 0,
        damagedQuantity: 0,
        returnedQuantity: 0,
        lowStockThreshold: 2,
        isLowStock: newProduct.stock <= 2,
        isOutOfStock: newProduct.stock <= 0,
        updatedAt: new Date().toISOString(),
      });
    }

    auditLogEngine.logAudit({
      entityType: 'Product',
      entityId: newProduct.id,
      referenceCode: newProduct.sku,
      action: 'PRODUCT_CREATED',
      actor,
      reason: `Created luxury product: ${newProduct.name} (Base Price: ₹${newProduct.basePriceINR})`,
    });

    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>, actor: string = 'Product Manager'): Product {
    const product = store.products.get(id);
    if (!product) throw new Error(`Product ${id} not found.`);

    const oldPrice = product.basePriceINR;
    Object.assign(product, updates);
    store.products.set(product.id, product);

    if (updates.basePriceINR && updates.basePriceINR !== oldPrice) {
      auditLogEngine.logAudit({
        entityType: 'Product',
        entityId: product.id,
        referenceCode: product.sku,
        action: 'PRODUCT_PRICE_CHANGED',
        previousState: `₹${oldPrice}`,
        newState: `₹${updates.basePriceINR}`,
        actor,
        reason: 'Authorized price adjustment.',
      });
    } else {
      auditLogEngine.logAudit({
        entityType: 'Product',
        entityId: product.id,
        referenceCode: product.sku,
        action: 'PRODUCT_UPDATED',
        actor,
        reason: `Updated product metadata for ${product.name}`,
      });
    }

    return product;
  }

  public duplicateProduct(id: string, actor: string = 'Product Manager'): Product {
    const source = store.products.get(id);
    if (!source) throw new Error(`Source product ${id} not found.`);

    const copySuffix = `copy_${Date.now().toString().slice(-4)}`;
    const newSku = `${source.sku}-${copySuffix.toUpperCase()}`;
    const newSlug = `${source.slug}-${copySuffix}`;

    const duplicated: Product = JSON.parse(JSON.stringify(source));
    duplicated.id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    duplicated.name = `${source.name} (Copy)`;
    duplicated.sku = newSku;
    duplicated.slug = newSlug;
    duplicated.createdAt = new Date().toISOString();

    if (duplicated.variants) {
      duplicated.variants.forEach((v, idx) => {
        v.id = `var_${Date.now()}_${idx}`;
        v.sku = `${v.sku}-${copySuffix.toUpperCase()}`;
      });
    }

    store.products.set(duplicated.id, duplicated);

    auditLogEngine.logAudit({
      entityType: 'Product',
      entityId: duplicated.id,
      referenceCode: duplicated.sku,
      action: 'PRODUCT_DUPLICATED',
      actor,
      reason: `Duplicated from ${source.sku}`,
    });

    return duplicated;
  }

  public deleteProduct(id: string, actor: string = 'Product Manager'): boolean {
    const product = store.products.get(id);
    if (!product) throw new Error(`Product ${id} not found.`);

    store.products.delete(id);

    auditLogEngine.logAudit({
      entityType: 'Product',
      entityId: id,
      referenceCode: product.sku,
      action: 'PRODUCT_DELETED',
      actor,
      reason: `Deleted product ${product.name}`,
    });

    return true;
  }

  // ==========================================
  // 4. CATEGORIES, COLLECTIONS & BRANDS
  // ==========================================

  public listCategories(): Category[] {
    return Array.from(store.categories.values()).sort((a, b) => a.order - b.order);
  }

  public createCategory(params: any, actor: string = 'Product Manager'): Category {
    const slug = params.slug || params.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `cat_${slug}`;

    const newCat: Category = {
      id,
      slug,
      name: params.name,
      tagline: params.tagline,
      description: params.description || '',
      editorialImage: params.editorialImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
      bannerImage: params.bannerImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
      subcategories: params.subcategories || [],
      order: params.order || store.categories.size + 1,
    };

    store.categories.set(newCat.id, newCat);

    auditLogEngine.logAudit({
      entityType: 'Category',
      entityId: newCat.id,
      referenceCode: newCat.slug,
      action: 'CATEGORY_CREATED',
      actor,
      reason: `Created category: ${newCat.name}`,
    });

    return newCat;
  }

  public listCollections(): Collection[] {
    return Array.from(store.collections.values());
  }

  public createCollection(params: any, actor: string = 'Marketing Manager'): Collection {
    const slug = params.slug || params.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `col_${slug}`;

    const newCol: Collection = {
      id,
      slug,
      name: params.name,
      subtitle: params.subtitle || 'Curated luxury edit',
      description: params.description || '',
      bannerImage: params.bannerImage || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200',
      featured: params.featured ?? true,
    };

    store.collections.set(newCol.id, newCol);

    auditLogEngine.logAudit({
      entityType: 'Collection',
      entityId: newCol.id,
      referenceCode: newCol.slug,
      action: 'COLLECTION_CREATED',
      actor,
      reason: `Created collection: ${newCol.name}`,
    });

    return newCol;
  }

  public listBrands(): Brand[] {
    return Array.from(store.brands.values());
  }

  public createBrand(params: any, actor: string = 'Product Manager'): Brand {
    const slug = params.slug || params.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const id = `brd_${slug}`;

    const newBrand: Brand = {
      id,
      slug,
      name: params.name,
      description: params.description || '',
      logo: params.logo || '/favicon.svg',
      origin: params.origin || 'India / Geneva',
    };

    store.brands.set(newBrand.id, newBrand);
    return newBrand;
  }
}

export const catalogueEngine = new CatalogueEngine();
