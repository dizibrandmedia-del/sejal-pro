import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'signature' | 'limited' | 'coveted' | 'new' | 'prive' | 'rubellite' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', className = '' }) => {
  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'limited':
        return {
          background: 'linear-gradient(135deg, #8B4B5B 0%, #5E2633 100%)',
          color: '#FAF4F5',
          border: '1px solid #B76E79',
          boxShadow: '0 2px 8px rgba(139, 75, 91, 0.25)',
        };
      case 'signature':
        return {
          backgroundColor: '#FFF4F6',
          color: '#B76E79',
          border: '1px solid rgba(183, 110, 121, 0.4)',
        };
      case 'rubellite':
        return {
          background: 'linear-gradient(135deg, #D44265 0%, #B76E79 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: '0 2px 10px rgba(212, 66, 101, 0.3)',
        };
      case 'coveted':
        return {
          backgroundColor: '#F5E6D3',
          color: '#1A1014',
          border: '1px solid #DEC2A1',
        };
      case 'prive':
        return {
          background: 'linear-gradient(135deg, #1A1014 0%, #2D1A23 100%)',
          color: '#F5E6D3',
          border: '1px solid #D4AF37',
          boxShadow: '0 2px 10px rgba(212, 175, 55, 0.25)',
        };
      case 'new':
        return {
          backgroundColor: '#FFFFFF',
          color: '#1A1014',
          border: '1px solid rgba(183, 110, 121, 0.3)',
        };
      case 'default':
      default:
        return {
          backgroundColor: '#FCE8EC',
          color: '#1A1014',
          border: '1px solid rgba(183, 110, 121, 0.25)',
        };
    }
  };

  return (
    <span
      className={`inline-block select-none ${className}`}
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        fontSize: '0.625rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        borderRadius: '2px',
        ...getStyles(),
      }}
    >
      {label}
    </span>
  );
};
