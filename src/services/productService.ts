import { Product, Category } from '../types/product';
import { FilterParams } from '../types/common';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_CATEGORIES } from '../data/mockCategories';

class ProductService {
  private products: Product[] = [...MOCK_PRODUCTS];
  private categories: Category[] = [...MOCK_CATEGORIES];

  public getAllProducts(): Product[] {
    return [...this.products];
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug || p.id === slug);
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getCategories(): Category[] {
    return [...this.categories];
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  public getFeaturedProducts(): Product[] {
    return this.products.filter((p) => p.isSignature || p.isBestseller);
  }

  public getNewArrivals(): Product[] {
    return this.products.filter((p) => p.isNewArrival);
  }

  public getRelatedProducts(productId: string): Product[] {
    const target = this.getProductById(productId);
    if (!target) return this.products.slice(0, 4);

    if (target.relatedProductIds && target.relatedProductIds.length > 0) {
      const explicit = this.products.filter((p) => target.relatedProductIds?.includes(p.id));
      if (explicit.length > 0) return explicit;
    }

    // Fallback: Same category
    return this.products
      .filter((p) => p.id !== productId && p.category === target.category)
      .slice(0, 4);
  }

  public filterAndSortProducts(params: FilterParams): Product[] {
    let result = [...this.products];

    // Category filter
    if (params.category && params.category !== 'all') {
      result = result.filter((p) => p.category === params.category);
    }

    // Subcategory filter
    if (params.subcategory && params.subcategory !== 'all') {
      result = result.filter((p) => p.subcategory === params.subcategory);
    }

    // Collection filter
    if (params.collection && params.collection.length > 0) {
      result = result.filter((p) => p.collection && params.collection?.includes(p.collection));
    }

    // Brand filter
    if (params.brand && params.brand.length > 0) {
      result = result.filter((p) => params.brand?.includes(p.brand));
    }

    // Price Range filter (INR)
    if (params.priceRange) {
      const [min, max] = params.priceRange;
      result = result.filter((p) => p.basePriceINR >= min && p.basePriceINR <= max);
    }

    // Colors filter
    if (params.colors && params.colors.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) =>
          v.options.some((o) => o.name.toLowerCase().includes('color') && params.colors?.some((c) => o.value.toLowerCase().includes(c.toLowerCase())))
        )
      );
    }

    // Materials filter
    if (params.materials && params.materials.length > 0) {
      result = result.filter((p) =>
        p.materials.some((mat) => params.materials?.some((m) => mat.toLowerCase().includes(m.toLowerCase())))
      );
    }

    // In Stock Only
    if (params.inStockOnly) {
      result = result.filter((p) => p.availability === 'in-stock');
    }

    // Search Query
    if (params.searchQuery && params.searchQuery.trim() !== '') {
      const query = params.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.shortDescription.toLowerCase().includes(query)
      );
    }

    // Sorting
    switch (params.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.basePriceINR - b.basePriceINR);
        break;
      case 'price-desc':
        result.sort((a, b) => b.basePriceINR - a.basePriceINR);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'editorial':
      case 'featured':
      default:
        result.sort((a, b) => (b.isSignature ? 1 : 0) - (a.isSignature ? 1 : 0));
        break;
    }

    return result;
  }

  public getSearchSuggestions(query: string): {
    products: Product[];
    categories: Category[];
    popularTerms: string[];
  } {
    const trimmed = query.toLowerCase().trim();
    if (!trimmed) {
      return {
        products: this.products.slice(0, 4),
        categories: this.categories.slice(0, 3),
        popularTerms: ['Diamond Choker', 'Mulberry Silk', 'Rose Gold', 'Extrait de Parfum', 'Moonphase', 'Minaudière'],
      };
    }

    const matchedProducts = this.products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.tags.some((t) => t.toLowerCase().includes(trimmed)) ||
          p.brand.toLowerCase().includes(trimmed)
      )
      .slice(0, 5);

    const matchedCategories = this.categories.filter(
      (c) => c.name.toLowerCase().includes(trimmed) || c.subcategories.some((s) => s.name.toLowerCase().includes(trimmed))
    );

    return {
      products: matchedProducts,
      categories: matchedCategories,
      popularTerms: ['Diamond Choker', 'Mulberry Silk', 'Rose Gold', 'Extrait de Parfum', 'Moonphase'].filter((t) =>
        t.toLowerCase().includes(trimmed)
      ),
    };
  }
}

export const productService = new ProductService();
