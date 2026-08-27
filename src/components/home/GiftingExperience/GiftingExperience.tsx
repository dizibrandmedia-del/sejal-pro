import React, { useState } from 'react';
import { Gift, Sparkles, Heart, Check, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button/Button';

export const GiftingExperience: React.FC = () => {
  const [selectedPackaging, setSelectedPackaging] = useState<'coffret' | 'prive-velvet' | 'bridal-trunk'>('coffret');

  return (
    <section style={{ padding: '96px 0', backgroundColor: '#FAF0F2', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px auto' }}>
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
            THE CEREMONY OF GIVING
          </span>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              color: 'var(--sejal-espresso)',
              lineHeight: 1.15,
              margin: '0 0 14px 0',
            }}
          >
            The Art of Gifting & Unboxing
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.7 }}>
            Every selection from SEJAL is presented as an unforgettable ritual. Rigid keepsake coffrets, scented monogrammed tissue paper, double-face satin ribbons, and personalized calligraphy cards.
          </p>
        </div>

        {/* Visual Showcase Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          {/* Packaging Visual Cards */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--sejal-border)',
              borderRadius: '2px',
              padding: '32px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Packaging Preview Visual */}
            <div
              style={{
                aspectRatio: '4 / 3',
                backgroundColor: '#FAF6F0',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '24px',
                border: '1px solid var(--sejal-border-light)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"
                alt="SEJAL Signature Rose Gold Packaging Box and Ribbons"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Floating Wax Seal Graphic */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#B76E79',
                  color: '#FFFFFF',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(183, 110, 121, 0.5)',
                  border: '2px solid #FAF6F0',
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                SEAL
              </div>
            </div>

            {/* Packaging Layers Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--sejal-blush)', color: 'var(--sejal-espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                  1
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--sejal-espresso)', fontWeight: 500 }}>
                  Rigid Blush Box with Hot-Stamped Rose Gold Monogram
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--sejal-blush)', color: 'var(--sejal-espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                  2
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--sejal-espresso)', fontWeight: 500 }}>
                  Scented Monogrammed Tissue Paper & Gold Foil Round Sticker
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--sejal-blush)', color: 'var(--sejal-espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                  3
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--sejal-espresso)', fontWeight: 500 }}>
                  Personalized Calligraphy Card & Luxury Shopping Bag with Satin Ribbons
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Gifting Concierge & Customization */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--sejal-border)',
                padding: '28px',
                borderRadius: '2px',
              }}
            >
              <h4
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: 'var(--sejal-espresso)',
                  marginBottom: '8px',
                }}
              >
                Complimentary with Every Selection
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                Whether surprising a loved one or indulging in personal adornment, SEJAL includes our full ceremony of gifting at no additional charge.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--sejal-espresso)' }}>
                  <Check size={16} color="var(--sejal-rose-gold)" />
                  <span>Complimentary personalized handwritten card with your custom words</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--sejal-espresso)' }}>
                  <Check size={16} color="var(--sejal-rose-gold)" />
                  <span>Discreet outer packaging for security and delightful surprises</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--sejal-espresso)' }}>
                  <Check size={16} color="var(--sejal-rose-gold)" />
                  <span>Price tags and invoices completely concealed from recipient</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a href="/gifting">
                  <Button size="md" rightIcon={<ArrowRight size={15} />}>
                    EXPLORE GIFTING SERVICES
                  </Button>
                </a>
                <a href="/shop">
                  <Button variant="outline" size="md">
                    CHOOSE A GIFT SELECTION
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
