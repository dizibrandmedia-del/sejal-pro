import React, { useState } from 'react';
import { Gift, Sparkles, Check } from 'lucide-react';
import { GiftPackagingOption as IGiftPackaging } from '../../../types/cart';

interface GiftPackagingOptionProps {
  giftPackaging: IGiftPackaging;
  onChange: (updated: IGiftPackaging) => void;
}

export const GiftPackagingOption: React.FC<GiftPackagingOptionProps> = ({
  giftPackaging,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(giftPackaging.enabled);

  const handleToggle = (enabled: boolean) => {
    setIsOpen(enabled);
    onChange({
      ...giftPackaging,
      enabled,
    });
  };

  return (
    <div
      style={{
        backgroundColor: '#FAF0F2',
        border: '1px solid var(--sejal-border)',
        borderRadius: '2px',
        padding: '16px 18px',
        marginTop: '16px',
      }}
    >
      {/* Header Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              backgroundColor: 'var(--sejal-espresso)',
              color: '#F5E6D3',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Gift size={16} />
          </div>
          <div>
            <h5
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--sejal-espresso)',
                margin: 0,
              }}
            >
              The Art of Gifting
            </h5>
            <span style={{ fontSize: '0.725rem', color: 'var(--sejal-rose-gold)', fontWeight: 500 }}>
              Complimentary Signature Rose Gold Box & Wax Seal
            </span>
          </div>
        </div>

        <button
          onClick={() => handleToggle(!giftPackaging.enabled)}
          style={{
            padding: '6px 14px',
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
            borderRadius: '2px',
            border: giftPackaging.enabled ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-rose-gold)',
            backgroundColor: giftPackaging.enabled ? 'var(--sejal-espresso)' : 'transparent',
            color: giftPackaging.enabled ? '#FAF6F0' : 'var(--sejal-espresso)',
            cursor: 'pointer',
          }}
        >
          {giftPackaging.enabled ? 'INCLUDED ✓' : '+ ADD GIFTING'}
        </button>
      </div>

      {/* Expanded Customization Form */}
      {giftPackaging.enabled && (
        <div className="animate-fade-in" style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--sejal-border-light)' }}>
          {/* Packaging Box Selection */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--sejal-espresso)',
                marginBottom: '6px',
              }}
            >
              SIGNATURE PRESENTATION:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onChange({ ...giftPackaging, boxType: 'signature-rose-gold' })}
                style={{
                  padding: '8px 12px',
                  borderRadius: '2px',
                  border: giftPackaging.boxType === 'signature-rose-gold' ? '1px solid var(--sejal-rose-gold)' : '1px solid var(--sejal-border)',
                  backgroundColor: giftPackaging.boxType === 'signature-rose-gold' ? '#FFFFFF' : 'transparent',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {giftPackaging.boxType === 'signature-rose-gold' && <Check size={12} color="var(--sejal-rose-gold)" />}
                <span>Rose Gold Ribbon Coffret</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...giftPackaging, boxType: 'prive-velvet' })}
                style={{
                  padding: '8px 12px',
                  borderRadius: '2px',
                  border: giftPackaging.boxType === 'prive-velvet' ? '1px solid var(--sejal-rose-gold)' : '1px solid var(--sejal-border)',
                  backgroundColor: giftPackaging.boxType === 'prive-velvet' ? '#FFFFFF' : 'transparent',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {giftPackaging.boxType === 'prive-velvet' && <Check size={12} color="var(--sejal-rose-gold)" />}
                <span>Privé Deep Mauve Velvet</span>
              </button>
            </div>
          </div>

          {/* Calligraphy Note Message */}
          <div style={{ marginBottom: '10px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--sejal-espresso)',
                marginBottom: '6px',
              }}
            >
              HANDWRITTEN CALLIGRAPHY NOTE:
            </label>
            <textarea
              placeholder="Enter your personal message for the recipient..."
              value={giftPackaging.giftMessage || ''}
              onChange={(e) => onChange({ ...giftPackaging, giftMessage: e.target.value })}
              rows={3}
              maxLength={250}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.8125rem',
                fontFamily: "'Cormorant Garamond', serif",
                borderRadius: '2px',
                border: '1px solid var(--sejal-border)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                resize: 'none',
              }}
            />
            <span style={{ fontSize: '0.65rem', color: 'var(--sejal-text-muted)', display: 'block', textAlign: 'right' }}>
              {(giftPackaging.giftMessage || '').length}/250 characters
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
