import React from 'react';
import { useCurrency } from '../../../context/CurrencyContext';

interface PriceProps {
  amountINR: number;
  compareAtINR?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Price: React.FC<PriceProps> = ({
  amountINR,
  compareAtINR,
  size = 'md',
  className = '',
}) => {
  const { formatPrice } = useCurrency();

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return '0.875rem';
      case 'lg':
        return '1.35rem';
      case 'xl':
        return '1.75rem';
      case 'md':
      default:
        return '1.05rem';
    }
  };

  const hasDiscount = compareAtINR && compareAtINR > amountINR;

  return (
    <div
      className={`inline-flex items-baseline gap-2 ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '8px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <span
        style={{
          fontSize: getFontSize(),
          fontWeight: 600,
          color: 'var(--sejal-espresso)',
          letterSpacing: '0.02em',
        }}
      >
        {formatPrice(amountINR)}
      </span>

      {hasDiscount && (
        <span
          style={{
            fontSize: '0.85em',
            textDecoration: 'line-through',
            color: 'var(--sejal-text-muted)',
            fontWeight: 400,
          }}
        >
          {formatPrice(compareAtINR)}
        </span>
      )}
    </div>
  );
};
