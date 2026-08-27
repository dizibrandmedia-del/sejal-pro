import React from 'react';
import { Crown, Sparkles, Shield, Calendar, Phone, ArrowRight, Check } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';
import { Button } from '../components/ui/Button/Button';

export const PrivePage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#1A1215', color: '#FAF6F0', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Editorial Banner */}
      <div style={{ padding: '80px 0 64px 0', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Crown size={20} color="#D4AF37" />
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600 }}>
              BY INVITATION ONLY
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: '0 0 16px 0',
            }}
          >
            SEJAL PRIVÉ
          </h1>

          <p style={{ fontSize: '1rem', color: '#F5E6D3', lineHeight: 1.8, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 300 }}>
            The private salon for connoisseurs of fine art, high joaillerie, and bespoke couture. Experience uncompromising discretion and personal curation.
          </p>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <a href="/account?tab=concierge">
              <Button variant="prive" size="lg" rightIcon={<ArrowRight size={16} />}>
                REQUEST PRIVATE SALON ACCESS
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {/* Privé Tier Privileges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', margin: '48px 0' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '32px', borderRadius: '2px' }}>
              <Crown size={24} color="#D4AF37" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#FFFFFF', margin: '0 0 10px 0' }}>
                Bespoke Joaillerie Commissions
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#D8A7B1', lineHeight: 1.7, margin: 0 }}>
                Direct access to our master gem setters to acquire unheated natural stones and create one-of-a-kind parures.
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '32px', borderRadius: '2px' }}>
              <Calendar size={24} color="#D4AF37" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#FFFFFF', margin: '0 0 10px 0' }}>
                Private Flagship Salon Viewings
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#D8A7B1', lineHeight: 1.7, margin: 0 }}>
                Exclusive appointments at our Mumbai & Dubai private salons with Champagne and bespoke styling.
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '32px', borderRadius: '2px' }}>
              <Shield size={24} color="#D4AF37" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#FFFFFF', margin: '0 0 10px 0' }}>
                Dedicated Styling Liaison
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#D8A7B1', lineHeight: 1.7, margin: 0 }}>
                Direct private WhatsApp and telephone line to your dedicated SEJAL styling director worldwide.
              </p>
            </div>
          </div>

          {/* Contact Direct Strip */}
          <div
            style={{
              backgroundColor: 'rgba(183, 110, 121, 0.12)',
              border: '1px solid #B76E79',
              borderRadius: '2px',
              padding: '24px 32px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600, display: 'block' }}>
                CONFIDENTIAL DIRECT LINE
              </span>
              <span style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 600 }}>
                +91 8005056531 • Sejal@Sejal.Pro
              </span>
            </div>

            <a href="/account?tab=concierge">
              <Button size="md" variant="prive">
                BOOK APPOINTMENT
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
