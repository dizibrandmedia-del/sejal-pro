import React, { useState } from 'react';
import { LayoutGrid, Grid2X2, Grid3X3, Sparkles } from 'lucide-react';
import { Product } from '../../../types/product';
import { ProductCard } from '../ProductCard/ProductCard';
import { QuickViewModal } from '../QuickViewModal/QuickViewModal';
import { Skeleton } from '../../ui/Skeleton/Skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onClearFilters?: () => void;
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onClearFilters,
  title,
  subtitle,
}) => {
  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const getGridStyle = (): React.CSSProperties => {
    switch (columns) {
      case 2:
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px',
        };
      case 4:
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px',
        };
      case 3:
      default:
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        };
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Top Header / View Density Toggles */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          gap: '16px',
        }}
      >
        <div>
          {title && (
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                fontWeight: 500,
                color: 'var(--sejal-espresso)',
                margin: 0,
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-muted)', marginTop: '4px' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Column Switchers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            VIEW:
          </span>
          <button
            onClick={() => setColumns(2)}
            style={{
              padding: '6px',
              borderRadius: '2px',
              border: `1px solid ${columns === 2 ? 'var(--sejal-rose-gold)' : 'var(--sejal-border-light)'}`,
              backgroundColor: columns === 2 ? 'var(--sejal-blush)' : '#FFFFFF',
              cursor: 'pointer',
              color: 'var(--sejal-espresso)',
            }}
            aria-label="2 Columns"
          >
            <Grid2X2 size={16} />
          </button>
          <button
            onClick={() => setColumns(3)}
            style={{
              padding: '6px',
              borderRadius: '2px',
              border: `1px solid ${columns === 3 ? 'var(--sejal-rose-gold)' : 'var(--sejal-border-light)'}`,
              backgroundColor: columns === 3 ? 'var(--sejal-blush)' : '#FFFFFF',
              cursor: 'pointer',
              color: 'var(--sejal-espresso)',
            }}
            aria-label="3 Columns"
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setColumns(4)}
            style={{
              padding: '6px',
              borderRadius: '2px',
              border: `1px solid ${columns === 4 ? 'var(--sejal-rose-gold)' : 'var(--sejal-border-light)'}`,
              backgroundColor: columns === 4 ? 'var(--sejal-blush)' : '#FFFFFF',
              cursor: 'pointer',
              color: 'var(--sejal-espresso)',
            }}
            aria-label="4 Columns"
            className="hidden lg:inline-flex"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div style={getGridStyle()}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '2px' }}>
              <Skeleton height="340px" borderRadius="2px" />
              <div style={{ marginTop: '14px' }}>
                <Skeleton height="14px" width="40%" />
                <div style={{ marginTop: '8px' }}>
                  <Skeleton height="20px" width="80%" />
                </div>
                <div style={{ marginTop: '12px' }}>
                  <Skeleton height="18px" width="30%" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Display */}
      {!isLoading && products.length > 0 && (
        <div style={getGridStyle()}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div
          style={{
            padding: '64px 20px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--sejal-border-light)',
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FAF0F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--sejal-rose-gold)',
            }}
          >
            <Sparkles size={24} />
          </div>

          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem',
              color: 'var(--sejal-espresso)',
              marginBottom: '8px',
            }}
          >
            No Masterpieces Match Your Selection
          </h3>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--sejal-text-secondary)',
              maxWidth: '420px',
              margin: '0 auto 24px auto',
            }}
          >
            Please adjust your filters or search keywords to discover other creations from the Maison.
          </p>

          {onClearFilters && (
            <button
              onClick={onClearFilters}
              style={{
                backgroundColor: 'var(--sejal-espresso)',
                color: 'var(--sejal-cream)',
                padding: '12px 28px',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              RESET ALL FILTERS
            </button>
          )}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
