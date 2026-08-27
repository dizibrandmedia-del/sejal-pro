import React from 'react';
import { ProductCard } from '../../product/ProductCard/ProductCard';
import { Product } from '../../../types/product';
import { Sparkles } from 'lucide-react';

interface NewArrivalsSectionProps {
  products: Product[];
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  const newItems = products.filter((p) => p.isNewArrival || p.isLimitedEdition).slice(0, 4);

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={14} color="var(--sejal-rose-gold)" />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.6875rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--sejal-rose-gold)',
                  fontWeight: 600,
                }}
              >
                THE LATEST DISCOVERIES
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--sejal-espresso)',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              New Arrivals & Limited Drops
            </h2>
          </div>

          <a
            href="/shop"
            style={{
              fontSize: '0.8125rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--sejal-espresso)',
              borderBottom: '2px solid var(--sejal-rose-gold)',
              paddingBottom: '2px',
            }}
          >
            EXPLORE ALL RELEASES →
          </a>
        </div>

        {/* Product Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {newItems.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};
