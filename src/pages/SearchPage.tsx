import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { productService } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid/ProductGrid';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';

export const SearchPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeSearch, setActiveSearch] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(query);
  };

  const results = productService.filterAndSortProducts({ searchQuery: activeSearch });
  const allProducts = productService.getAllProducts();

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Search Header */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--sejal-border-light)', padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.6875rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            SEJAL CATALOG SEARCH
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: 'var(--sejal-espresso)', margin: '0 0 20px 0' }}>
            {activeSearch ? `Results for “${activeSearch}”` : 'Search Creations'}
          </h1>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Search gemstones, materials, collections, perfumes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px 14px 44px',
                  fontSize: '0.9rem',
                  border: '1px solid var(--sejal-border)',
                  borderRadius: '2px',
                  outline: 'none',
                }}
              />
              <Search size={18} color="var(--sejal-text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--sejal-espresso)',
                color: 'var(--sejal-cream)',
                padding: '0 24px',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '24px' }}>
        <Breadcrumb items={[{ label: 'Search Results' }]} />

        <div style={{ marginTop: '24px' }}>
          <ProductGrid
            products={results}
            title={results.length > 0 ? `Showing ${results.length} Matches` : undefined}
            onClearFilters={() => {
              setQuery('');
              setActiveSearch('');
            }}
          />

          {/* Zero results fallback recommendation */}
          {results.length === 0 && (
            <div style={{ marginTop: '64px', borderTop: '1px solid var(--sejal-border-light)', paddingTop: '40px' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', textAlign: 'center', marginBottom: '24px' }}>
                Featured Curations You May Adore
              </h3>
              <ProductGrid products={allProducts.slice(0, 4)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
