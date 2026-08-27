import React, { useState } from 'react';
import { Lock, Shield, KeyRound, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess }) => {
  const { login, verify2FA, requires2FA } = useAdminAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('sejal@sejal.pro');
  const [password, setPassword] = useState('SejalPrivé2026!');
  const [totpCode, setTotpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (requires2FA) {
        await verify2FA(totpCode);
        showToast('Access Granted', '2FA verified. Welcome to SEJAL Operations Command.', 'success');
        onSuccess();
      } else {
        const loggedIn = await login(email, password);
        if (loggedIn) {
          showToast('Access Granted', 'Welcome to SEJAL Operations Command.', 'success');
          onSuccess();
        } else {
          showToast('2FA Challenge', 'Please enter the 6-digit TOTP code from your authenticator device.', 'info');
        }
      }
    } catch (err: any) {
      showToast('Authentication Failed', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0B1120',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: '8px',
          padding: '36px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/images/sejal-emblem.png"
            alt="SEJAL Crown Emblem"
            style={{ height: '76px', width: 'auto', objectFit: 'contain', margin: '0 auto 12px auto', filter: 'drop-shadow(0 4px 14px rgba(212,175,55,0.4))' }}
          />
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.15em', color: '#FFFFFF', marginBottom: '4px' }}>
            SEJAL<span style={{ color: '#D4AF37' }}>.PRO</span>
          </div>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94A3B8', display: 'block' }}>
            OPERATIONS & ATELIER COMMAND
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!requires2FA ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                  ADMINISTRATIVE EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                  MASTER PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>
            </>
          ) : (
            <div style={{ backgroundColor: '#1E293B', border: '1px solid #D4AF37', padding: '16px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', marginBottom: '8px' }}>
                <KeyRound size={16} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>2FA VERIFICATION CODE</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0 0 12px 0' }}>
                Enter the 6-digit authentication token (e.g. <code>202688</code>)
              </p>
              <input
                type="text"
                autoFocus
                placeholder="202688"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.trim())}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0F172A',
                  border: '1px solid #D4AF37',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  fontSize: '1.25rem',
                  letterSpacing: '0.25em',
                  textAlign: 'center',
                  fontWeight: 700,
                  outline: 'none',
                }}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#D4AF37',
              color: '#0B1120',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>{isLoading ? 'AUTHENTICATING...' : requires2FA ? 'VERIFY 2FA & ENTER' : 'SIGN IN TO COMMAND'}</span>
            {!isLoading && <ArrowRight size={15} />}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #1E293B', textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Shield size={11} /> 256-Bit TLS Encrypted Staff Channel
          </span>
        </div>
      </div>
    </div>
  );
};
