import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';
import { Payment } from '../../../types/payment';

export const PaymentAdminPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<Payment[]>('/payments/ledger');
      setPayments(res.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalCaptured = payments.filter((p) => p.status === 'Captured' || p.status === 'Partially Refunded').reduce((s, p) => s + p.amountINR, 0);
  const totalRefunded = payments.reduce((s, p) => s + p.refundedAmountINR, 0);
  const netSettlement = totalCaptured - totalRefunded;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Payments, Gateways & Cryptographic Reconciliation
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Authoritative Razorpay HMAC-SHA256 signature verification ledger and settlement balancing.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} />
          <span>Reconcile Ledger</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>TOTAL CAPTURED</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
            ₹{totalCaptured.toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>TOTAL REFUNDED</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#DC2626', marginTop: '4px' }}>
            ₹{totalRefunded.toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>NET RECONCILED VAULT</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16A34A', marginTop: '4px' }}>
            ₹{netSettlement.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>Payment Reference</th>
              <th style={{ padding: '12px 16px' }}>Order Reference</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 16px' }}>Gateway Method</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>HMAC Verified</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>{p.id}</td>
                <td style={{ padding: '12px 16px' }}>
                  <code style={{ fontSize: '0.75rem', color: '#334155' }}>{p.orderNumber}</code>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>₹{p.amountINR?.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 16px', color: '#64748B' }}>{p.method}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: p.isSignatureVerified ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                    <ShieldCheck size={13} /> {p.isSignatureVerified ? 'CRYPTOGRAPHIC MATCH' : 'UNVERIFIED'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: p.status === 'Captured' ? '#16A34A' : '#F59E0B' }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
