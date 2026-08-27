import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../../types/product';
import { Price } from '../../ui/Price/Price';

interface SejalEditSectionProps {
  products: Product[];
}

export const SejalEditSection: React.FC<SejalEditSectionProps> = ({ products }) => {
  const featured = products.find((p) => p.slug === 'empress-silk-crepe-evening-gown') || products[3];

  return (
    <section style={{ padding: '96px 0', backgroundColor: '#1A1215', color: '#FAF6F0' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '56px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Editorial Story Visual */}
          <div style={{ position: 'relative' }}>
            <div
              className="arch-top"
              style={{
                position: 'relative',
                aspectRatio: '3 / 4',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                border: '1px solid rgba(183, 110, 121, 0.3)',
              }}
            >
              <img
                src={featured?.media[0]?.url || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop'}
                alt="The SEJAL Edit"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Overlapping Floating Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#1A1215',
                padding: '16px 24px',
                borderRadius: '2px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                border: '1px solid var(--sejal-rose-gold)',
                maxWidth: '260px',
              }}
            >
              <span style={{ fontSize: '0.625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600, display: 'block' }}>
                EDITORIAL FOCUS
              </span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: '#1A1215' }}>
                The Empress Silhouette
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Text & Product Tag */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#D4AF37" />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#D4AF37',
                  fontWeight: 600,
                }}
              >
                VOL. IV • AUTUMN/WINTER CHRONICLES
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                fontWeight: 400,
                color: '#FFFFFF',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              The SEJAL Edit: <br />
              <span style={{ fontStyle: 'italic', color: '#E8B4B8' }}>Liquid Silk & High Joaillerie</span>
            </h2>

            <p style={{ fontSize: '0.95rem', color: '#F5E6D3', lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
              "True luxury is felt before it is seen. It is the touch of forty-momme pure mulberry silk whispering against the skin, and the silent weight of diamonds hand-cut to mirror starlight."
            </p>

            <p style={{ fontSize: '0.85rem', color: '#D8A7B1', lineHeight: 1.7, margin: 0 }}>
              Curated by founder Sejal Gupta, The Edit explores the harmonious alchemy between sculptural evening couture and heirloom diamond jewellery.
            </p>

            {/* Featured Product Pill */}
            {featured && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(183, 110, 121, 0.3)',
                  padding: '16px 20px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#E8B4B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    FEATURED IN THE EDIT:
                  </span>
                  <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#FFFFFF', margin: '2px 0 4px 0' }}>
                    {featured.name}
                  </h5>
                  <Price amountINR={featured.basePriceINR} size="md" />
                </div>

                <a
                  href={`/product/${featured.slug}`}
                  style={{
                    backgroundColor: '#B76E79',
                    color: '#FFFFFF',
                    padding: '10px 18px',
                    fontSize: '0.725rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>SHOP THE LOOK</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            )}

            <div>
              <a
                href="/journal"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#F5E6D3',
                  borderBottom: '1px solid #D4AF37',
                  paddingBottom: '4px',
                }}
              >
                <span>READ THE COMPLETE JOURNAL</span>
                <ArrowRight size={16} color="#D4AF37" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
