import React from 'react';
import { ProductVariant } from '../../../types/product';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
  className = '',
}) => {
  if (variants.length <= 1) return null;

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--sejal-espresso)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            SELECT EDITION / VARIANT:
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--sejal-rose-gold)', fontWeight: 500 }}>
            {selectedVariant.title}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {variants.map((variant) => {
            const isSelected = selectedVariant.id === variant.id;
            const colorOption = variant.options.find((o) => o.hexColor);

            return (
              <button
                key={variant.id}
                onClick={() => onSelectVariant(variant)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '2px',
                  border: isSelected ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-border)',
                  backgroundColor: isSelected ? '#1A1215' : '#FFFFFF',
                  color: isSelected ? '#FAF6F0' : 'var(--sejal-espresso)',
                  fontSize: '0.8125rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {colorOption?.hexColor && (
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: colorOption.hexColor,
                      border: '1px solid rgba(0,0,0,0.15)',
                    }}
                  />
                )}
                <span>{variant.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
