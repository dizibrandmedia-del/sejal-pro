import React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }

    showToast(
      'Invitation Accepted',
      'You are now registered for the SEJAL Privé seasonal lookbook release.',
      'luxury'
    );
    setEmail('');
  };

  return (
    <section
      style={{
        padding: '80px 0',
        backgroundColor: '#FAF0F2',
        borderTop: '1px solid var(--sejal-border-light)',
      }}
    >
      <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
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
            DISCREET DISPATCHES
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--sejal-espresso)',
            lineHeight: 1.15,
            margin: '0 0 12px 0',
          }}
        >
          Enter the Private World of SEJAL
        </h2>

        <p style={{ fontSize: '0.9rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.7, marginBottom: '28px' }}>
          Be the first to receive invitation-only salon drops, gemological discoveries, and private editorial chronicles.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--sejal-border)',
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <input
              type="email"
              placeholder="Enter your confidential email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '14px 18px',
                fontSize: '0.875rem',
                border: 'none',
                outline: 'none',
                color: 'var(--sejal-espresso)',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--sejal-espresso)',
                color: 'var(--sejal-cream)',
                padding: '0 24px',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>SUBSCRIBE</span>
              <ArrowRight size={14} color="#F5E6D3" />
            </button>
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--sejal-text-muted)' }}>
            We honour your privacy. Strict confidentiality guaranteed.
          </span>
        </form>
      </div>
    </section>
  );
};
