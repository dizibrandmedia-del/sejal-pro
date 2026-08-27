import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '560px',
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
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(26, 18, 21, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className={`animate-fade-in ${className}`}
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--sejal-border)',
          borderRadius: '4px',
          boxShadow: '0 24px 60px rgba(26, 18, 21, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div
            style={{
              padding: '24px 28px 16px 28px',
              borderBottom: '1px solid var(--sejal-border-light)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {title && (
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.65rem',
                    fontWeight: 500,
                    color: 'var(--sejal-espresso)',
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--sejal-text-muted)',
                    marginTop: '4px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                color: 'var(--sejal-text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Without title header close button fallback */}
        {!title && !subtitle && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid var(--sejal-border)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        )}

        {/* Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
};
