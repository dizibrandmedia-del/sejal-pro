import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../../types/common';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem',
        letterSpacing: '0.06em',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: 'var(--sejal-text-muted)',
      }}
    >
      <a
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--sejal-text-secondary)',
        }}
      >
        <Home size={13} />
        <span>SEJAL</span>
      </a>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} style={{ opacity: 0.6 }} />
            {isLast || !item.url ? (
              <span
                style={{
                  color: isLast ? 'var(--sejal-espresso)' : 'var(--sejal-text-secondary)',
                  fontWeight: isLast ? 600 : 400,
                  maxWidth: '240px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.url}
                style={{
                  color: 'var(--sejal-text-secondary)',
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
