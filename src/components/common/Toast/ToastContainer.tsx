import React from 'react';
import { useToast } from '../../../context/ToastContext';
import { Sparkles, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100vw - 48px)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 size={18} color="var(--sejal-success)" />;
            case 'error':
              return <AlertCircle size={18} color="var(--sejal-error)" />;
            case 'info':
              return <Info size={18} color="var(--sejal-info)" />;
            case 'luxury':
            default:
              return <Sparkles size={18} color="var(--sejal-rose-gold)" />;
          }
        };

        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              pointerEvents: 'auto',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--sejal-border)',
              borderRadius: '2px',
              padding: '14px 18px',
              boxShadow: '0 12px 32px rgba(26, 18, 21, 0.15)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              position: 'relative',
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon()}</div>

            <div style={{ flex: 1 }}>
              <h4
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--sejal-espresso)',
                  margin: 0,
                  letterSpacing: '0.02em',
                }}
              >
                {toast.title}
              </h4>
              {toast.description && (
                <p
                  style={{
                    fontSize: '0.785rem',
                    color: 'var(--sejal-text-secondary)',
                    margin: '3px 0 0 0',
                    lineHeight: 1.5,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--sejal-text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
