import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  width?: string;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
  width = '480px',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-drawer)',
        backgroundColor: 'rgba(26, 18, 21, 0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
        transition: 'background-color 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        className={`drawer-panel ${className}`}
        style={{
          width: '100%',
          maxWidth: width,
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: position === 'right' ? '-10px 0 40px rgba(26, 18, 21, 0.2)' : '10px 0 40px rgba(26, 18, 21, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: `${position === 'right' ? 'slideInRight' : 'slideInLeft'} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Drawer Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--sejal-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAF6F0',
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: 'var(--sejal-espresso)',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--sejal-text-muted)',
                  marginTop: '2px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: '0.08em',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--sejal-espresso)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close panel"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
