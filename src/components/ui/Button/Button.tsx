import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'prive' | 'icon' | 'gem';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const getPadding = () => {
    if (variant === 'icon') {
      return size === 'sm' ? '8px' : size === 'lg' ? '14px' : '10px';
    }
    switch (size) {
      case 'sm':
        return '9px 20px';
      case 'lg':
        return '16px 36px';
      case 'md':
      default:
        return '12px 28px';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return '0.75rem';
      case 'lg':
        return '0.925rem';
      case 'md':
      default:
        return '0.8125rem';
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'var(--sejal-blush)',
          color: 'var(--sejal-espresso)',
          border: '1px solid var(--sejal-rose-gold)',
          boxShadow: '0 2px 10px rgba(183, 110, 121, 0.1)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--sejal-espresso)',
          border: '1px solid var(--sejal-rose-gold)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--sejal-espresso)',
          border: 'none',
        };
      case 'prive':
        return {
          background: 'linear-gradient(135deg, #1A1014 0%, #3B141E 50%, #1A1014 100%)',
          color: '#F5E6D3',
          border: '1px solid #D4AF37',
          boxShadow: '0 4px 22px rgba(212, 175, 55, 0.28)',
        };
      case 'gem':
        return {
          background: 'linear-gradient(135deg, #D44265 0%, #B76E79 50%, #8B4B5B 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 20px rgba(212, 66, 101, 0.35)',
        };
      case 'icon':
        return {
          backgroundColor: 'transparent',
          color: 'var(--sejal-espresso)',
          borderRadius: '50%',
          border: '1px solid var(--sejal-border)',
        };
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #24161C 0%, #1A1014 100%)',
          color: '#FFF9FA',
          border: '1px solid rgba(183, 110, 121, 0.45)',
          boxShadow: '0 4px 18px rgba(183, 110, 121, 0.18)',
        };
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-300 select-none ${className}`}
      disabled={disabled || isLoading}
      style={{
        padding: getPadding(),
        fontSize: getFontSize(),
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        borderRadius: '2px',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.45 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        gap: '8px',
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.75s linear infinite',
          }}
        />
      ) : (
        <>
          {leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
