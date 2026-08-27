import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../../../types/product';

interface CategoryPortalsProps {
  categories: Category[];
}

export const CategoryPortals: React.FC<CategoryPortalsProps> = ({ categories }) => {
  return (
    <section style={{ padding: '80px 0', backgroundColor: '#FAF6F0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
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
            DISCOVER YOUR WORLD
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
            The Universes of SEJAL
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6 }}>
            Immerse yourself into curated chambers of high joaillerie, haute silk, leathercraft, and niche perfumery.
          </p>
        </div>

        {/* Arched Category Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
          }}
        >
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="arch-card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '420px',
                overflow: 'hidden',
                backgroundColor: '#1A1215',
                boxShadow: 'var(--shadow-md)',
                textDecoration: 'none',
              }}
            >
              {/* Background Editorial Image */}
              <img
                src={cat.editorialImage}
                alt={cat.name}
                loading="lazy"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.82,
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'scale(1.06)';
                  (e.target as HTMLElement).style.opacity = '0.95';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'scale(1)';
                  (e.target as HTMLElement).style.opacity = '0.82';
                }}
              />

              {/* Gradient Overlay for Text Readability */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(26, 18, 21, 0.1) 0%, rgba(26, 18, 21, 0.85) 100%)',
                }}
              />

              {/* Top Right Arrow Indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  zIndex: 2,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <ArrowUpRight size={20} />
              </div>

              {/* Bottom Card Content */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  marginTop: 'auto',
                  padding: '32px 28px',
                  color: '#FAF6F0',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.6875rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#E8B4B8',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  {cat.subcategories.length} SUB-COLLECTIONS
                </span>

                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '2rem',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    margin: '0 0 6px 0',
                    lineHeight: 1.15,
                  }}
                >
                  {cat.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#F5E6D3',
                    margin: '0 0 14px 0',
                    lineHeight: 1.5,
                  }}
                >
                  {cat.tagline || cat.description.slice(0, 75) + '...'}
                </p>

                <span
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#D4AF37',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  DISCOVER UNIVERSE →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
