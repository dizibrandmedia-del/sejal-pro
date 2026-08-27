import React from 'react';
import { ArrowRight, Sparkles, Phone, Mail } from 'lucide-react';
import { Button } from '../../ui/Button/Button';

export const FounderStorySection: React.FC = () => {
  return (
    <section style={{ padding: '96px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Founder Editorial Portrait */}
          <div style={{ position: 'relative' }}>
            <div
              className="arch-top"
              style={{
                position: 'relative',
                aspectRatio: '3 / 4',
                overflow: 'hidden',
                backgroundColor: '#FAF6F0',
                border: '1px solid var(--sejal-border)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop"
                alt="Sejal Gupta — Founder of SEJAL.PRO"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Overlapping Founder Card */}
            <div
              style={{
                position: 'absolute',
                bottom: '-24px',
                left: '20px',
                right: '20px',
                backgroundColor: '#1A1215',
                color: '#FAF6F0',
                padding: '18px 24px',
                borderRadius: '2px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
                border: '1px solid #B76E79',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#FFFFFF', margin: 0 }}>
                  Sejal Gupta
                </h5>
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600 }}>
                  FOUNDER & CREATIVE DIRECTOR
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D8A7B1', display: 'block' }}>
                  SANCTUARY CONCIERGE
                </span>
                <span style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 500 }}>
                  +91 8005056531
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Founder's Vision */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                OUR HERITAGE & PHILOSOPHY
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                fontWeight: 400,
                color: 'var(--sejal-espresso)',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              "We do not create for the crowd. We curate only for Her."
            </h2>

            <p style={{ fontSize: '0.95rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.8, margin: 0 }}>
              SEJAL was established with a singular, uncompromising vision: to elevate luxury beyond commercial excess into a realm of pure emotional resonance, exquisite craftsmanship, and timeless grace.
            </p>

            <p style={{ fontSize: '0.9rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.7, margin: 0 }}>
              From Antwerp diamond ateliers to Florentine leather workshops and Grasse perfumeries, every creation bearing our crown is vetted with strict adherence to <em>Ultra Luxury Premium Only</em> standards.
            </p>

            <div
              style={{
                backgroundColor: '#FAF0F2',
                borderLeft: '3px solid var(--sejal-rose-gold)',
                padding: '16px 20px',
                marginTop: '8px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.15rem',
                  fontStyle: 'italic',
                  color: 'var(--sejal-espresso)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                "Timeless Luxury • Refined Elegance • Exquisite Quality."
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--sejal-rose-gold)', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                — Sejal Gupta
              </span>
            </div>

            <div style={{ marginTop: '12px' }}>
              <a href="/story">
                <Button size="md" rightIcon={<ArrowRight size={15} />}>
                  READ THE COMPLETE STORY
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
