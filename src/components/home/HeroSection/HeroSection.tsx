import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button/Button';

export const HeroSection: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#1A1215',
        color: '#FAF6F0',
      }}
    >
      {/* Background Image with Cinematic Gradient Mask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          opacity: 0.42,
          transform: 'scale(1.02)',
          transition: 'transform 8s ease',
        }}
      />

      {/* Layered Gradient Overlays for Luxury Contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(26, 18, 21, 0.4) 0%, rgba(26, 18, 21, 0.85) 100%)',
        }}
      />

      {/* Hero Content Container */}
      <div
        className="container animate-fade-in"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '860px',
          padding: '64px 20px',
        }}
      >
        {/* Subtle Brand Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            backgroundColor: 'rgba(183, 110, 121, 0.2)',
            border: '1px solid rgba(183, 110, 121, 0.4)',
            borderRadius: '20px',
            marginBottom: '24px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Sparkles size={14} color="#D4AF37" />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.6875rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#F5E6D3',
              fontWeight: 600,
            }}
          >
            HAUTE JOAILLERIE & LIFESTYLE
          </span>
        </div>

        {/* Primary Headline */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.75rem, 6vw, 4.75rem)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            color: '#FFFFFF',
            marginBottom: '20px',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          Curated Luxury, <br />
          <span
            style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #FDF2F4 0%, #E8B4B8 45%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Just for Her.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p
          style={{
            fontSize: 'clamp(0.925rem, 2vw, 1.15rem)',
            color: '#F5E6D3',
            maxWidth: '620px',
            margin: '0 auto 36px auto',
            lineHeight: 1.7,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 300,
            letterSpacing: '0.02em',
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}
        >
          An international sanctuary of rare natural diamonds, pure mulberry silk, sculpted Italian leather, and Grasse extrait de parfum.
        </p>

        {/* Dual Luxury CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <a href="/shop">
            <Button
              size="lg"
              style={{
                backgroundColor: '#B76E79',
                borderColor: '#B76E79',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(183, 110, 121, 0.35)',
              }}
              rightIcon={<ArrowRight size={16} />}
            >
              DISCOVER THE EDIT
            </Button>
          </a>

          <a href="/prive">
            <Button
              variant="outline"
              size="lg"
              style={{
                color: '#F5E6D3',
                borderColor: 'rgba(245, 230, 211, 0.6)',
                backgroundColor: 'rgba(26, 18, 21, 0.4)',
                backdropFilter: 'blur(8px)',
              }}
            >
              SEJAL PRIVÉ SALON
            </Button>
          </a>
        </div>
      </div>

      {/* Bottom Scroll Indicator Pill */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          opacity: 0.7,
        }}
      >
        <span style={{ fontSize: '0.625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5E6D3' }}>
          EXPLORE
        </span>
        <div style={{ width: '1px', height: '24px', backgroundColor: '#B76E79' }} />
      </div>
    </section>
  );
};
