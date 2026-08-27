import React from 'react';
import { Gift, Sparkles, Heart, Check, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';
import { Button } from '../components/ui/Button/Button';

export const GiftingPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Banner */}
      <div
        style={{
          position: 'relative',
          padding: '80px 0 64px 0',
          backgroundColor: '#FAF0F2',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Gift size={16} color="var(--sejal-rose-gold)" />
            <span style={{ fontSize: '0.6875rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
              THE CEREMONY OF GIVING
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              color: 'var(--sejal-espresso)',
              lineHeight: 1.15,
              margin: '0 0 16px 0',
            }}
          >
            The Art of Luxury Gifting
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.7, fontWeight: 300 }}>
            Every selection from Maison SEJAL is presented as an unforgettable token of adoration. Rigid keepsake coffrets, double-face satin ribbons, monogrammed tissue paper, and handwritten calligraphy.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '24px' }}>
        <Breadcrumb items={[{ label: 'Luxury Gifting' }]} />

        {/* Gifting Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px', margin: '48px 0' }}>
          <div style={{ backgroundColor: '#FAF6F0', padding: '32px', borderRadius: '2px', border: '1px solid var(--sejal-border-light)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', color: 'var(--sejal-espresso)', marginBottom: '10px' }}>
              Complimentary Signature Gifting
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
              Every single order placed on SEJAL.PRO automatically includes our full signature presentation: double-face satin ribbon, scented tissue, gold wax seal, and personal calligraphy card.
            </p>
            <a href="/shop">
              <Button size="sm">EXPLORE THE EDIT</Button>
            </a>
          </div>

          <div style={{ backgroundColor: '#FAF6F0', padding: '32px', borderRadius: '2px', border: '1px solid var(--sejal-border-light)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', color: 'var(--sejal-espresso)', marginBottom: '10px' }}>
              Bridal Trousseau & Registries
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
              Curate an unforgettable bespoke trousseau of high joaillerie parures, pure silk gowns, and crystal home sanctum decor with personal concierge assistance.
            </p>
            <a href="/account?tab=concierge">
              <Button variant="outline" size="sm">
                ENQUIRE BRIDAL
              </Button>
            </a>
          </div>

          <div style={{ backgroundColor: '#FAF6F0', padding: '32px', borderRadius: '2px', border: '1px solid var(--sejal-border-light)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', color: 'var(--sejal-espresso)', marginBottom: '10px' }}>
              Corporate & Royal Commissions
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
              Custom engraved leather goods, limited-edition fragrance discovery coffrets, and bespoke jewel pieces crafted for institutional patronage.
            </p>
            <a href="/account?tab=concierge">
              <Button variant="outline" size="sm">
                CORPORATE LIAISON
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
