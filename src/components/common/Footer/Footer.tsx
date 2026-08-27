import React, { useState } from 'react';
import { ShieldCheck, Truck, Gift, Sparkles, Mail, Phone, ArrowRight, Instagram, Facebook } from 'lucide-react';
import { Logo } from '../../ui/Logo/Logo';
import { FOOTER_COLUMNS } from '../../../config/navigation';
import { useToast } from '../../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Newsletter Invitation', 'Please enter a valid email address.', 'error');
      return;
    }
    showToast(
      'Invitation Confirmed',
      'You are now enrolled in the SEJAL Privé seasonal chronicles.',
      'luxury'
    );
    setEmail('');
  };

  return (
    <footer
      style={{
        backgroundColor: '#1A1215',
        color: '#FAF6F0',
        borderTop: '1px solid rgba(183, 110, 121, 0.25)',
        paddingTop: '64px',
        paddingBottom: '80px',
        position: 'relative',
      }}
    >
      {/* 1. Trust & Brand Pillars Bar */}
      <div
        className="container"
        style={{
          borderBottom: '1px solid rgba(183, 110, 121, 0.2)',
          paddingBottom: '48px',
          marginBottom: '56px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              backgroundColor: 'rgba(183, 110, 121, 0.15)',
              padding: '10px',
              borderRadius: '50%',
              color: '#D4AF37',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <h5
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#F5E6D3',
                marginBottom: '4px',
                letterSpacing: '0.04em',
              }}
            >
              Certified Haute Joaillerie
            </h5>
            <p style={{ fontSize: '0.785rem', color: '#D8A7B1', margin: 0, lineHeight: 1.5 }}>
              100% Conflict-free natural diamonds, hallmarked 18K/22K gold, accompanied by GIA grading certificates.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              backgroundColor: 'rgba(183, 110, 121, 0.15)',
              padding: '10px',
              borderRadius: '50%',
              color: '#D4AF37',
              flexShrink: 0,
            }}
          >
            <Gift size={22} />
          </div>
          <div>
            <h5
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#F5E6D3',
                marginBottom: '4px',
                letterSpacing: '0.04em',
              }}
            >
              The Art of Unboxing
            </h5>
            <p style={{ fontSize: '0.785rem', color: '#D8A7B1', margin: 0, lineHeight: 1.5 }}>
              Signature rigid blush coffrets, double-face silk satin ribbons, monogrammed tissue, and bespoke wax seals.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              backgroundColor: 'rgba(183, 110, 121, 0.15)',
              padding: '10px',
              borderRadius: '50%',
              color: '#D4AF37',
              flexShrink: 0,
            }}
          >
            <Truck size={22} />
          </div>
          <div>
            <h5
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#F5E6D3',
                marginBottom: '4px',
                letterSpacing: '0.04em',
              }}
            >
              White-Glove Insured Delivery
            </h5>
            <p style={{ fontSize: '0.785rem', color: '#D8A7B1', margin: 0, lineHeight: 1.5 }}>
              Complimentary armored transit across India, UAE, USA, and Australia with discreet security seals.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              backgroundColor: 'rgba(183, 110, 121, 0.15)',
              padding: '10px',
              borderRadius: '50%',
              color: '#D4AF37',
              flexShrink: 0,
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h5
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#F5E6D3',
                marginBottom: '4px',
                letterSpacing: '0.04em',
              }}
            >
              SEJAL Privé Concierge
            </h5>
            <p style={{ fontSize: '0.785rem', color: '#D8A7B1', margin: 0, lineHeight: 1.5 }}>
              Direct access to personal styling advisors, private salon viewings, and bespoke masterwork commissions.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '56px',
        }}
      >
        {/* Col 1: Brand & Founder */}
        <div style={{ gridColumn: 'span 1' }}>
          <Logo variant="full" size="md" light={true} />
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#D8A7B1',
              marginTop: '16px',
              lineHeight: 1.7,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            An ultra-luxury lifestyle sanctuary crafted exclusively for the woman of refined elegance.
          </p>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#F5E6D3' }}>
              <Phone size={14} color="#B76E79" />
              <span>Direct: +91 8005056531</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#F5E6D3' }}>
              <Mail size={14} color="#B76E79" />
              <span>Concierge: Sejal@Sejal.Pro</span>
            </div>
          </div>
        </div>

        {/* Col 2: The Maison */}
        <div>
          <h5
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B76E79',
              marginBottom: '18px',
              fontWeight: 600,
            }}
          >
            THE MAISON
          </h5>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FOOTER_COLUMNS.maison.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  style={{
                    fontSize: '0.8125rem',
                    color: '#FAF6F0',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#D4AF37')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#FAF6F0')}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Bespoke Services */}
        <div>
          <h5
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B76E79',
              marginBottom: '18px',
              fontWeight: 600,
            }}
          >
            BESPOKE SERVICES
          </h5>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FOOTER_COLUMNS.services.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  style={{
                    fontSize: '0.8125rem',
                    color: '#FAF6F0',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#D4AF37')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#FAF6F0')}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Customer Care */}
        <div>
          <h5
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B76E79',
              marginBottom: '18px',
              fontWeight: 600,
            }}
          >
            CLIENT SANCTUARY
          </h5>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FOOTER_COLUMNS.care.map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  style={{
                    fontSize: '0.8125rem',
                    color: '#FAF6F0',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#D4AF37')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#FAF6F0')}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 5: VIP Privé Invitation / Newsletter */}
        <div style={{ minWidth: '240px' }}>
          <h5
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B76E79',
              marginBottom: '18px',
              fontWeight: 600,
            }}
          >
            SEJAL PRIVÉ INVITATION
          </h5>
          <p style={{ fontSize: '0.785rem', color: '#D8A7B1', lineHeight: 1.6, marginBottom: '16px' }}>
            Receive private salon previews, seasonal lookbooks, and invitation-only drops.
          </p>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Enter your private email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 14px',
                  fontSize: '0.8125rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(183, 110, 121, 0.3)',
                  borderRadius: '2px',
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#D4AF37',
                  padding: '6px',
                  cursor: 'pointer',
                }}
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#9E8A92' }}>
              Discreet & confidential. Never shared with third parties.
            </span>
          </form>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div
        className="container"
        style={{
          borderTop: '1px solid rgba(183, 110, 121, 0.15)',
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.75rem',
          color: '#9E8A92',
        }}
      >
        <div>
          © 2026 SEJAL.PRO. All Worldwide Rights Reserved. Founded by Sejal Gupta.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>India</span>
          <span>•</span>
          <span>United Arab Emirates</span>
          <span>•</span>
          <span>United States</span>
          <span>•</span>
          <span>Australia</span>
        </div>
      </div>
    </footer>
  );
};
