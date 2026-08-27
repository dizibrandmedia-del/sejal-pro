import React, { useState } from 'react';
import { Modal } from '../../ui/Modal/Modal';
import { Input, Checkbox } from '../../ui/Form/Form';
import { Button } from '../../ui/Button/Button';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Sparkles, Shield, User, Lock, Mail, Phone } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [optIn, setOptIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      showToast('Validation Error', 'Please enter your email or phone number.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await login(emailOrPhone);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !registerEmail.trim() || !registerPhone.trim()) {
      showToast('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    if (registerPassword !== confirmPassword) {
      showToast('Password Error', 'Passwords do not match.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await register(name, registerEmail, registerPhone);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Reset Link Dispatched', 'A secure password reset link has been sent to your email.', 'luxury');
    setMode('login');
  };

  const handleDemoVipLogin = () => {
    login('vip@sejal.pro');
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={
        mode === 'login'
          ? 'SEJAL PRIVÉ LOGIN'
          : mode === 'register'
          ? 'CREATE YOUR PRIVÉ ACCOUNT'
          : 'RECOVER PASSWORD'
      }
      subtitle={
        mode === 'login'
          ? 'Access your private salon selections, addresses, and order vault.'
          : mode === 'register'
          ? 'Join the private world of SEJAL with 1,000 complimentary welcome points.'
          : 'Enter your registered email to receive recovery instructions.'
      }
      maxWidth="480px"
    >
      {/* Quick Demo VIP Login Pill */}
      <div
        style={{
          backgroundColor: '#FAF0F2',
          border: '1px dashed var(--sejal-rose-gold)',
          borderRadius: '2px',
          padding: '10px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={14} color="var(--sejal-rose-gold)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sejal-espresso)' }}>
            VIP Test Account: vip@sejal.pro
          </span>
        </div>
        <button
          type="button"
          onClick={handleDemoVipLogin}
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: 'var(--sejal-rose-gold)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          1-CLICK LOGIN →
        </button>
      </div>

      {/* Tabs */}
      {mode !== 'forgot' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid var(--sejal-border)',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              padding: '10px 0',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: mode === 'login' ? 'var(--sejal-espresso)' : 'var(--sejal-text-muted)',
              borderBottom: mode === 'login' ? '2px solid var(--sejal-espresso)' : 'none',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
            }}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              padding: '10px 0',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: mode === 'register' ? 'var(--sejal-espresso)' : 'var(--sejal-text-muted)',
              borderBottom: mode === 'register' ? '2px solid var(--sejal-espresso)' : 'none',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
            }}
          >
            REGISTER
          </button>
        </div>
      )}

      {/* 1. Login Form */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            label="Email or Phone Number"
            type="text"
            placeholder="e.g. client@domain.com or +91 8005056531"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Checkbox label="Remember me" defaultChecked />
            <button
              type="button"
              onClick={() => setMode('forgot')}
              style={{
                fontSize: '0.75rem',
                color: 'var(--sejal-rose-gold)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Forgot Password?
            </button>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            SIGN IN TO MY SEJAL
          </Button>
        </form>
      )}

      {/* 2. Register Form */}
      {mode === 'register' && (
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            label="Full Name"
            type="text"
            placeholder="e.g. Gayatri Devi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. client@domain.com"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 8005056531"
            value={registerPhone}
            onChange={(e) => setRegisterPhone(e.target.value)}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Checkbox
            label="Enrol in SEJAL Privé for complimentary white-glove invitations and 1,000 points."
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
          />

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            COMPLETE PRIVÉ ENROLLMENT
          </Button>
        </form>
      )}

      {/* 3. Forgot Password Form */}
      {mode === 'forgot' && (
        <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Registered Email Address"
            type="email"
            placeholder="e.g. client@domain.com"
            required
          />

          <Button type="submit" fullWidth size="lg">
            SEND RECOVERY INSTRUCTIONS
          </Button>

          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              fontSize: '0.75rem',
              color: 'var(--sejal-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginTop: '4px',
              textDecoration: 'underline',
            }}
          >
            ← Return to Sign In
          </button>
        </form>
      )}
    </Modal>
  );
};
