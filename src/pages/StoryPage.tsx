import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';
import { Button } from '../components/ui/Button/Button';

export const StoryPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Editorial Banner */}
      <div
        style={{
          position: 'relative',
          padding: '80px 0 64px 0',
          backgroundColor: '#1A1215',
          color: '#FAF6F0',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1600&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            opacity: 0.3,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={14} color="#D4AF37" />
            <span style={{ fontSize: '0.6875rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600 }}>
              MAISON PHILOSOPHY
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 400,
              color: '#FFFFFF',
              lineHeight: 1.15,
              margin: '0 0 16px 0',
            }}
          >
            The Heritage & Vision of SEJAL
          </h1>

          <p style={{ fontSize: '1rem', color: '#F5E6D3', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 300 }}>
            "Curated Luxury, Just for Her." A modern temple of refined elegance, sovereign beauty, and uncompromising artisanal integrity.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '24px' }}>
        <Breadcrumb items={[{ label: 'Our Story' }]} />

        {/* Founder Narrative Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
            margin: '48px 0 80px 0',
          }}
        >
          <div>
            <span style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              THE FOUNDER'S CALLING
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', color: 'var(--sejal-espresso)', lineHeight: 1.2, margin: '0 0 16px 0' }}>
              Born from a Devotion to Sovereign Feminine Grace
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
              SEJAL was founded by <strong>Sejal Gupta</strong> to create a world where luxury is no longer defined by mass commercialization, but by deep personal connection, exquisite rarity, and timeless grace.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
              "Every jewel, silk thread, and extrait de parfum we curate is designed to be a talisman of self-sovereignty. When a woman wears SEJAL, she does not wear a brand—she wears her own crowned majesty."
            </p>

            <div style={{ backgroundColor: '#FAF0F2', borderLeft: '3px solid var(--sejal-rose-gold)', padding: '16px 20px', borderRadius: '2px' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--sejal-espresso)', display: 'block' }}>
                "TIMELESS LUXURY | REFINED ELEGANCE | EXQUISITE QUALITY"
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--sejal-rose-gold)', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                — Sejal Gupta, Founder
              </span>
            </div>
          </div>

          <div className="arch-card" style={{ position: 'relative', height: '480px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop"
              alt="Artisanal High Joaillerie Crafting"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Craftsmanship Pillars */}
        <div style={{ padding: '64px 0', borderTop: '1px solid var(--sejal-border-light)' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: 'var(--sejal-espresso)' }}>
              The Four Pillars of the Maison
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            <div style={{ backgroundColor: '#FAF6F0', padding: '28px', borderRadius: '2px', border: '1px solid var(--sejal-border-light)' }}>
              <span style={{ fontSize: '1.4rem', color: 'var(--sejal-rose-gold)', fontFamily: "'Cinzel', serif", fontWeight: 700 }}>01</span>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: 'var(--sejal-espresso)', margin: '8px 0' }}>
                Uncompromising Gemology
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                100% Conflict-free natural diamonds, unheated sapphires, and rare Morganites cut in Antwerp and Jaipur.
              </p>
            </div>

            <div style={{ backgroundColor: '#FAF6F0', padding: '28px', borderRadius: '2px', border: '1px solid var(--sejal-border-light)' }}>
              <span style={{ fontSize: '1.4rem', color: 'var(--sejal-rose-gold)', fontFamily: "'Cinzel', serif", fontWeight: 700 }}>02</span>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: 'var(--sejal-espresso)', margin: '8px 0' }}>
                Pure Italian & Como Silk
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Heavyweight 40-momme mulberry silk crepe and Scottish cashmere loomed by heritage European mills.
              </p>
            </div>

            <div style={{ backgroundColor: '#FAF6F0', padding: '28px', borderRadius: '2px', border: '1px solid var(--sejal-border-light)' }}>
              <span style={{ fontSize: '1.4rem', color: 'var(--sejal-rose-gold)', fontFamily: "'Cinzel', serif", fontWeight: 700 }}>03</span>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: 'var(--sejal-espresso)', margin: '8px 0' }}>
                Grasse Haute Parfumerie
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Formulated at 35% to 40% pure oil concentrations in Grasse, France for extraordinary depth and projection.
              </p>
            </div>

            <div style={{ backgroundColor: '#FAF6F0', padding: '28px', borderRadius: '2px', border: '1px solid var(--sejal-border-light)' }}>
              <span style={{ fontSize: '1.4rem', color: 'var(--sejal-rose-gold)', fontFamily: "'Cinzel', serif", fontWeight: 700 }}>04</span>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: 'var(--sejal-espresso)', margin: '8px 0' }}>
                Bespoke White-Glove Care
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Armored delivery, tamper-proof wax seal unboxing rituals, and private lifetime salon servicing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
