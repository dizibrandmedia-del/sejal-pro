import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, X, Sparkles } from 'lucide-react';
import { productService } from '../services/productService';
import { FilterParams, SortOption } from '../types/common';
import { ProductGrid } from '../components/product/ProductGrid/ProductGrid';
import { FilterDrawer } from '../components/shop/FilterDrawer/FilterDrawer';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';

export const ShopPage: React.FC = () => {
  // Parse URL query params
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  const categoryParam = searchParams.get('category') || undefined;
  const subcategoryParam = searchParams.get('subcategory') || undefined;
  const collectionParam = searchParams.get('collection') ? [searchParams.get('collection')!] : undefined;

  const [filters, setFilters] = useState<FilterParams>({
    category: categoryParam,
    subcategory: subcategoryParam,
    collection: collectionParam,
    sortBy: 'featured',
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categories = productService.getCategories();
  const allProducts = productService.getAllProducts();

  // Extract unique brands, colors, materials for filters
  const availableBrands = Array.from(new Set(allProducts.map((p) => p.brand)));
  const availableColors = [
    { name: 'Rose Gold', hex: '#B76E79' },
    { name: 'Blush Pink', hex: '#F7DDE0' },
    { name: 'Champagne', hex: '#F5E6D3' },
    { name: 'Dark Espresso', hex: '#1A1215' },
    { name: 'Pearl White', hex: '#FFF7F2' },
    { name: 'White Gold', hex: '#E5E8EB' },
  ];
  const availableMaterials = [
    '18K Rose Gold',
    'Natural Diamonds',
    'Brazilian Morganite',
    '100% Mulberry Silk',
    'Mongolian Cashmere',
    'Tuscan Box Calfskin',
    'Mother-of-Pearl',
    'Crystal Glass',
  ];

  const activeCategory = filters.category ? productService.getCategoryBySlug(filters.category) : undefined;
  const activeSubcategory = filters.subcategory && activeCategory
    ? activeCategory.subcategories.find((s) => s.slug === filters.subcategory)
    : undefined;

  const filteredProducts = productService.filterAndSortProducts(filters);

  // Active filter count
  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.subcategory ? 1 : 0) +
    (filters.brand ? filters.brand.length : 0) +
    (filters.colors ? filters.colors.length : 0) +
    (filters.materials ? filters.materials.length : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const handleRemoveFilter = (key: keyof FilterParams, value?: string) => {
    if (key === 'brand' && value && filters.brand) {
      const updated = filters.brand.filter((b) => b !== value);
      setFilters({ ...filters, brand: updated.length ? updated : undefined });
    } else if (key === 'colors' && value && filters.colors) {
      const updated = filters.colors.filter((c) => c !== value);
      setFilters({ ...filters, colors: updated.length ? updated : undefined });
    } else if (key === 'materials' && value && filters.materials) {
      const updated = filters.materials.filter((m) => m !== value);
      setFilters({ ...filters, materials: updated.length ? updated : undefined });
    } else {
      setFilters({ ...filters, [key]: undefined });
    }
  };

  const handleSortChange = (sortBy: SortOption) => {
    setFilters({ ...filters, sortBy });
  };

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* 1. Editorial Category Banner */}
      <div
        style={{
          position: 'relative',
          padding: '64px 0 48px 0',
          backgroundColor: '#1A1215',
          color: '#FAF6F0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${activeCategory?.bannerImage || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            opacity: 0.35,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={14} color="#D4AF37" />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.6875rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#D4AF37',
                fontWeight: 600,
              }}
            >
              {activeCategory ? activeCategory.name.toUpperCase() : 'THE COMPLETE EDIT'}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 400,
              color: '#FFFFFF',
              lineHeight: 1.15,
              margin: '0 0 12px 0',
            }}
          >
            {activeSubcategory ? activeSubcategory.name : activeCategory ? activeCategory.name : 'The Curated Catalog'}
          </h1>

          <p
            style={{
              fontSize: '0.925rem',
              color: '#F5E6D3',
              lineHeight: 1.7,
              margin: '0 auto',
              maxWidth: '600px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            {activeCategory?.description ||
              'Discover our complete repertory of high joaillerie, haute silk couture, leather creations, and niche extrait de parfum.'}
          </p>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="container" style={{ paddingTop: '24px' }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Shop', url: '/shop' },
            ...(activeCategory ? [{ label: activeCategory.name, url: `/shop?category=${activeCategory.slug}` }] : []),
            ...(activeSubcategory ? [{ label: activeSubcategory.name }] : []),
          ]}
        />

        {/* Action Controls Bar (Filter Drawer Trigger, Active Count, Sort Dropdown) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--sejal-border-light)',
            borderRadius: '2px',
            padding: '14px 20px',
            margin: '16px 0 24px 0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Left: Filter Trigger Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                backgroundColor: activeFilterCount > 0 ? 'var(--sejal-espresso)' : '#FAF6F0',
                color: activeFilterCount > 0 ? '#FAF6F0' : 'var(--sejal-espresso)',
                border: '1px solid var(--sejal-border)',
                borderRadius: '2px',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={15} />
              <span>FILTER SELECTIONS</span>
              {activeFilterCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--sejal-rose-gold)',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.65rem',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-muted)' }}>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Creation' : 'Creations'}
            </span>
          </div>

          {/* Right: Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sejal-text-muted)', fontWeight: 600 }}>
              SORT BY:
            </span>
            <select
              value={filters.sortBy || 'featured'}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              style={{
                padding: '8px 14px',
                fontSize: '0.8125rem',
                backgroundColor: '#FAF6F0',
                border: '1px solid var(--sejal-border)',
                borderRadius: '2px',
                color: 'var(--sejal-espresso)',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              <option value="featured">Featured / Signatures</option>
              <option value="newest">Newest Releases</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--sejal-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              ACTIVE FILTERS:
            </span>

            {filters.category && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--sejal-rose-gold)',
                  color: 'var(--sejal-espresso)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                }}
              >
                <span>Category: {activeCategory?.name || filters.category}</span>
                <button
                  onClick={() => handleRemoveFilter('category')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sejal-text-muted)' }}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.subcategory && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--sejal-rose-gold)',
                  color: 'var(--sejal-espresso)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                }}
              >
                <span>Subcategory: {activeSubcategory?.name || filters.subcategory}</span>
                <button
                  onClick={() => handleRemoveFilter('subcategory')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sejal-text-muted)' }}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.colors?.map((col) => (
              <span
                key={col}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--sejal-rose-gold)',
                  color: 'var(--sejal-espresso)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                }}
              >
                <span>Color: {col}</span>
                <button
                  onClick={() => handleRemoveFilter('colors', col)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sejal-text-muted)' }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {filters.materials?.map((mat) => (
              <span
                key={mat}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--sejal-rose-gold)',
                  color: 'var(--sejal-espresso)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                }}
              >
                <span>Material: {mat}</span>
                <button
                  onClick={() => handleRemoveFilter('materials', mat)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sejal-text-muted)' }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            <button
              onClick={() => setFilters({ sortBy: 'featured' })}
              style={{
                fontSize: '0.75rem',
                color: 'var(--sejal-rose-gold)',
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: 600,
                marginLeft: '4px',
              }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* 3. Product Grid Display */}
        <ProductGrid
          products={filteredProducts}
          onClearFilters={() => setFilters({ sortBy: 'featured' })}
        />
      </div>

      {/* 4. Multi-Facet Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onUpdateFilters={(newFilters) => setFilters(newFilters)}
        categories={categories}
        availableBrands={availableBrands}
        availableColors={availableColors}
        availableMaterials={availableMaterials}
      />
    </div>
  );
};
