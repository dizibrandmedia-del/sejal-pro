import React, { useState } from 'react';
import { ProductCard } from '../../product/ProductCard/ProductCard';
import { Product } from '../../../types/product';
import { ArrowRight } from 'lucide-react';

interface SignatureSectionProps {
  products: Product[];
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'high-jewellery' | 'leather-goods' | 'niche-fragrance'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return p.isSignature || p.isBestseller;
    return p.category === activeTab;
  }).slice(0, 4);

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.6875rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--sejal-rose-gold)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '8px',
            }}
          >
            CURATED MASTERWORKS
          </span>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--sejal-espresso)',
              lineHeight: 1.15,
              margin: '0 0 12px 0',
            }}
          >
            The Signature Collection
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6 }}>
            Enduring icons crafted with sovereign poise. Limited by nature, treasured for a lifetime.
          </p>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '24px',
            }}
          >
            {[
              { id: 'all', label: 'All Signatures' },
              { id: 'high-jewellery', label: 'High Joaillerie' },
              { id: 'leather-goods', label: 'Haute Leather' },
              { id: 'niche-fragrance', label: 'Parfumerie Privée' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    borderRadius: '2px',
                    border: isSelected ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-border-light)',
                    backgroundColor: isSelected ? 'var(--sejal-espresso)' : '#FAF6F0',
                    color: isSelected ? '#FAF6F0' : 'var(--sejal-espresso)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* View All CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a
            href="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8125rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--sejal-espresso)',
              borderBottom: '2px solid var(--sejal-rose-gold)',
              paddingBottom: '4px',
              transition: 'color 0.2s',
            }}
          >
            <span>DISCOVER THE COMPLETE REPERTORY</span>
            <ArrowRight size={16} color="var(--sejal-rose-gold)" />
          </a>
        </div>
      </div>
    </section>
  );
};
