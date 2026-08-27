import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#FAF6F0',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '560px' }}>
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '5rem',
            color: 'var(--sejal-rose-gold)',
            fontWeight: 700,
            display: 'block',
            lineHeight: 1,
            marginBottom: '12px',
          }}
        >
          404
        </span>

        <span
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--sejal-espresso)',
            fontWeight: 600,
            display: 'block',
            marginBottom: '8px',
          }}
        >
          A COVETED CREATION UNFOUND
        </span>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            color: 'var(--sejal-espresso)',
            margin: '0 0 16px 0',
          }}
        >
          This Page Has Been Archived
        </h1>

        <p style={{ fontSize: '0.925rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.7, margin: '0 auto 32px auto' }}>
          The requested salon room or creation could not be found. Allow our curators to guide you back to our active catalog.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
          <a href="/">
            <Button size="lg">RETURN TO HOME</Button>
          </a>
          <a href="/shop">
            <Button variant="outline" size="lg" rightIcon={<ArrowRight size={15} />}>
              EXPLORE THE EDIT
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
