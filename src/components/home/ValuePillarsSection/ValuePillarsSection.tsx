import React from 'react';
import { Gem, Gift, ShieldCheck, Headphones } from 'lucide-react';

export const ValuePillarsSection: React.FC = () => {
  const pillars = [
    {
      icon: <Gem size={26} color="#B76E79" />,
      title: 'Curated Haute Quality',
      description: 'Masterpieces hand-selected for uncompromising craftsmanship, rare natural gems, and timeless design.',
    },
    {
      icon: <Gift size={26} color="#B76E79" />,
      title: 'Signature Rose Gold Packaging',
      description: 'Every selection arrives in bespoke rigid blush coffrets, double-face silk ribbons, and handwritten cards.',
    },
    {
      icon: <ShieldCheck size={26} color="#B76E79" />,
      title: 'Worldwide Insured Express',
      description: 'Complimentary tamper-proof armored global delivery across India, UAE, USA, and Australia.',
    },
    {
      icon: <Headphones size={26} color="#B76E79" />,
      title: '24/7 White-Glove Concierge',
      description: 'Dedicated client advisors and private salon styling consultations available at your command.',
    },
  ];

  return (
    <section style={{ padding: '48px 0', backgroundColor: '#FAF6F0', borderBottom: '1px solid var(--sejal-border-light)' }}>
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
        }}
      >
        {pillars.map((p, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '16px',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--sejal-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {p.icon}
            </div>

            <h4
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--sejal-espresso)',
                marginBottom: '6px',
                letterSpacing: '0.02em',
              }}
            >
              {p.title}
            </h4>

            <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
