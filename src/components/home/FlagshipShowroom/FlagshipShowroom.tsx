import React from 'react';
import { MapPin, Clock, Phone, Sparkles } from 'lucide-react';

export const FlagshipShowroom: React.FC = () => {
  return (
    <section style={{ padding: '96px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
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
            FLAGSHIP ARCHITECTURE
          </span>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              color: 'var(--sejal-espresso)',
              lineHeight: 1.15,
              margin: '0 0 12px 0',
            }}
          >
            The World of SEJAL
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6 }}>
            Step inside our physical sanctuaries where curved rose gold arches, fluted blush marble, and soft champagne illumination showcase our creations.
          </p>
        </div>

        {/* Boutique Gallery Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {/* Main Grand Salon */}
          <div
            className="arch-card"
            style={{
              position: 'relative',
              height: '360px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
              alt="SEJAL Private Salon Interior"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(26, 18, 21, 0.85) 100%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFFFFF',
              }}
            >
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.45rem', margin: 0 }}>
                The Grand Haute Salon
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#D8A7B1' }}>
                Private viewing suites with calibrated gemological lighting
              </span>
            </div>
          </div>

          {/* Couture & Silk Chamber */}
          <div
            className="arch-card"
            style={{
              position: 'relative',
              height: '360px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop"
              alt="SEJAL Couture Drapes"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(26, 18, 21, 0.85) 100%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFFFFF',
              }}
            >
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.45rem', margin: 0 }}>
                The Fragrance & Silk Organ
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#D8A7B1' }}>
                Bespoke scent formulation and made-to-measure couture fittings
              </span>
            </div>
          </div>
        </div>

        {/* Global Boutique Locations Bar */}
        <div
          style={{
            backgroundColor: '#FAF6F0',
            border: '1px solid var(--sejal-border)',
            borderRadius: '2px',
            padding: '28px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <MapPin size={15} color="var(--sejal-rose-gold)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sejal-espresso)' }}>
                MUMBAI SALON
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', margin: 0 }}>
              The Luxury Pavilion, Bandra Kurla Complex, Mumbai
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <MapPin size={15} color="var(--sejal-rose-gold)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sejal-espresso)' }}>
                DUBAI SANCTUARY
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', margin: 0 }}>
              The Royal Atlantis Residences, Palm Jumeirah, Dubai
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <MapPin size={15} color="var(--sejal-rose-gold)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sejal-espresso)' }}>
                NEW YORK ATELIER
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', margin: 0 }}>
              Madison Avenue Privé Salon, Upper East Side, New York
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
