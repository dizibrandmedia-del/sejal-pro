import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  showText?: boolean;
  size?: number;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  count,
  showText = true,
  size = 13,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.75rem',
        color: 'var(--sejal-text-secondary)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = value >= star;
          return (
            <Star
              key={star}
              size={size}
              fill={filled ? '#D4AF37' : 'none'}
              stroke={filled ? '#D4AF37' : '#C5A880'}
              strokeWidth={1.5}
            />
          );
        })}
      </div>

      {showText && (
        <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)', marginLeft: '2px' }}>
          {value.toFixed(1)} {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  );
};
