import React from 'react';

interface LogoProps {
  variant?: 'full' | 'horizontal' | 'monogram' | 'compact';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  light = false,
  className = '',
  showTagline = true,
}) => {
  // Height map for the master logo
  const heightMap = {
    xs: { fullHeight: 46, horizontalHeight: 28, iconSize: 26, text: '1.05rem', tag: '0.45rem', gap: '8px' },
    sm: { fullHeight: 58, horizontalHeight: 36, iconSize: 32, text: '1.25rem', tag: '0.52rem', gap: '10px' },
    md: { fullHeight: 74, horizontalHeight: 48, iconSize: 44, text: '1.65rem', tag: '0.62rem', gap: '12px' },
    lg: { fullHeight: 96, horizontalHeight: 64, iconSize: 56, text: '2.15rem', tag: '0.75rem', gap: '16px' },
    xl: { fullHeight: 128, horizontalHeight: 84, iconSize: 74, text: '2.85rem', tag: '0.9rem', gap: '20px' },
  };

  const current = heightMap[size];

  // Metallic drop-shadow filters
  const filterStyle = light
    ? 'drop-shadow(0 2px 12px rgba(212, 175, 55, 0.4)) drop-shadow(0 4px 18px rgba(183, 110, 121, 0.3)) brightness(1.08)'
    : 'drop-shadow(0 3px 10px rgba(183, 110, 121, 0.18))';

  // 1. Monogram Only
  if (variant === 'monogram') {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${className}`}
        style={{ cursor: 'pointer' }}
      >
        <img
          src="/images/sejal-emblem.png"
          alt="SEJAL Crowned Monogram"
          style={{
            height: `${current.iconSize}px`,
            width: 'auto',
            objectFit: 'contain',
            filter: filterStyle,
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    );
  }

  // 2. Horizontal Lockup
  if (variant === 'horizontal' || variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center select-none ${className}`}
        style={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: current.gap,
          textDecoration: 'none',
        }}
      >
        <img
          src="/images/sejal-emblem.png"
          alt="SEJAL Crown Emblem"
          style={{
            height: `${current.horizontalHeight}px`,
            width: 'auto',
            objectFit: 'contain',
            filter: filterStyle,
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
          <span
            style={{
              fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: current.text,
              letterSpacing: '0.24em',
              lineHeight: 1,
              color: light ? '#FFFFFF' : '#2A1810',
              background: light
                ? 'linear-gradient(135deg, #FFFFFF 0%, #FCE7EB 50%, #E8B4B8 100%)'
                : 'linear-gradient(135deg, #331A21 0%, #6E2D3B 45%, #B76E79 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              display: 'inline-block',
            }}
          >
            S E J A L
          </span>

          {showTagline && size !== 'xs' && (
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: current.tag,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: light ? '#F5D0D6' : '#B76E79',
                fontWeight: 600,
                marginTop: '3px',
                opacity: 0.95,
              }}
            >
              Curated Luxury, Just for Her
            </span>
          )}
        </div>
      </div>
    );
  }

  // 3. Full Master Emblem Lockup (Default)
  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ textAlign: 'center', cursor: 'pointer' }}
    >
      <img
        src="/images/sejal-logo-final.png"
        alt="SEJAL — Curated Luxury, Just for Her"
        style={{
          height: `${current.fullHeight}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          filter: filterStyle,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
    </div>
  );
};
