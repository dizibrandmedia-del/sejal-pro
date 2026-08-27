import React from 'react';
import { Crown, Sparkles, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import { Button } from '../../ui/Button/Button';

export const PriveSection: React.FC = () => {
  return (
    <section
      style={{
        padding: '96px 0',
        backgroundColor: '#1A1215',
        color: '#FAF6F0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Gold Glow Background */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(183, 110, 121, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            border: '1px solid rgba(212, 175, 55, 0.35)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '4px',
            padding: '48px 40px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Privé Overview */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Crown size={18} color="#D4AF37" />
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
                  BY INVITATION ONLY
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                  margin: '0 0 16px 0',
                }}
              >
                SEJAL PRIVÉ
              </h2>

              <p style={{ fontSize: '0.95rem', color: '#F5E6D3', lineHeight: 1.7, margin: '0 0 24px 0' }}>
                A private sanctuary reserved for our most distinguished patrons. Experience bespoke haute joaillerie commissions, personal wardrobe styling, and confidential private salon previews.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                <a href="/prive">
                  <Button variant="prive" size="lg" rightIcon={<ArrowRight size={16} />}>
                    REQUEST SALON ACCESS
                  </Button>
                </a>
                <a href="/account?tab=concierge">
                  <Button
                    variant="outline"
                    size="lg"
                    style={{ color: '#FAF6F0', borderColor: 'rgba(255,255,255,0.3)' }}
                    leftIcon={<Calendar size={15} />}
                  >
                    BOOK STYLING APPOINTMENT
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Column: Privé Tier Benefits Box */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(183, 110, 121, 0.3)',
                padding: '28px',
                borderRadius: '2px',
              }}
            >
              <h4
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.45rem',
                  color: '#D4AF37',
                  marginBottom: '16px',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                  paddingBottom: '8px',
                }}
              >
                Privé Salon Privileges
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Sparkles size={16} color="#B76E79" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600, display: 'block' }}>
                      Bespoke High Joaillerie Commissions
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#D8A7B1' }}>
                      Collaborate directly with master gemologists to source rare certified stones.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Sparkles size={16} color="#B76E79" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600, display: 'block' }}>
                      Armoured Vault Delivery & Dedicated Advisor
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#D8A7B1' }}>
                      Direct private line to your personal SEJAL styling director worldwide.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Sparkles size={16} color="#B76E79" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600, display: 'block' }}>
                      Pre-Release Haute Lookbook Allotments
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#D8A7B1' }}>
                      Guaranteed allocations for limited numbered couture and horology releases.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
