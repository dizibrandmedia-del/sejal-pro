import React, { useState, useEffect } from 'react';
import { Award, DollarSign, ExternalLink, Plus, Percent, RefreshCw } from 'lucide-react';
import { crmService } from '../../../services/crmService';
import { InfluencerProfile, CommissionLedgerEntry } from '../../../types/attribution';
import { useToast } from '../../../context/ToastContext';

export const InfluencerManagerPage: React.FC = () => {
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);
  const [ledger, setLedger] = useState<CommissionLedgerEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [handle, setHandle] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [uniqueCode, setUniqueCode] = useState('');
  const [referralSlug, setReferralSlug] = useState('');
  const [commissionRate, setCommissionRate] = useState(10);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [infList, ledgerList] = await Promise.all([
        crmService.getInfluencers(),
        crmService.getCommissionLedger(),
      ]);
      setInfluencers(infList);
      setLedger(ledgerList.filter((l) => l.beneficiaryType === 'influencer'));
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await crmService.saveInfluencer({
        handle,
        fullName,
        email,
        phone,
        country,
        uniqueCode: uniqueCode.toUpperCase(),
        referralSlug: referralSlug.startsWith('/') ? referralSlug : `/${referralSlug}`,
        commissionModel: 'percentage',
        commissionRate,
        status: 'active',
      });
      setInfluencers([...influencers, created]);
      setIsCreating(false);
      showToast('Creator Registered', `Added ${created.fullName} (${created.uniqueCode})`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#0F172A', letterSpacing: '0.05em', margin: 0 }}>
            CREATOR & INFLUENCER PARTNERSHIPS
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Exclusive luxury creator links, promo codes, commission ledgers, and return deductions.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={15} /> {isCreating ? 'Cancel' : 'Register Creator'}
        </button>
      </div>

      {/* KPI Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>ACTIVE CREATORS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
            {influencers.length}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
            UAE & India Luxury Curators
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>ATTRIBUTED GROSS SALES</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
            ₹{influencers.reduce((s, i) => s + i.totalGrossRevenueINR, 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#059669', marginTop: '4px', display: 'block' }}>
            Authoritative order revenue
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>PENDING COMMISSIONS</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#B45309', marginTop: '4px' }}>
            ₹{influencers.reduce((s, i) => s + i.pendingCommissionINR, 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
            30-day return window hold
          </span>
        </div>
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <form
          onSubmit={handleSave}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Register New Creator / Influencer
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sheikha Noor Al-Khalifa"
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Social Handle *
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@sheikha_style"
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Unique Promo Code *
              </label>
              <input
                type="text"
                value={uniqueCode}
                onChange={(e) => setUniqueCode(e.target.value.toUpperCase())}
                placeholder="SEJALXSHEIKHA"
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="noor@sheikhastyle.com"
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Referral Slug
              </label>
              <input
                type="text"
                value={referralSlug}
                onChange={(e) => setReferralSlug(e.target.value)}
                placeholder="/invite/sheikha"
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Commission Percentage (%)
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                min={1}
                max={50}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              alignSelf: 'flex-start',
              padding: '10px 24px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Register & Activate Link
          </button>
        </form>
      )}

      {/* Influencers Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
          Creator Performance Roster ({influencers.length})
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                <th style={{ padding: '8px 12px' }}>Creator</th>
                <th style={{ padding: '8px 12px' }}>Code / Link</th>
                <th style={{ padding: '8px 12px' }}>Commission</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Clicks</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Orders</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Gross Revenue</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Net Commission</th>
              </tr>
            </thead>
            <tbody>
              {influencers.map((inf) => (
                <tr key={inf.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{inf.fullName}</div>
                    <code style={{ fontSize: '0.65rem', color: '#64748B' }}>{inf.handle} • {inf.country}</code>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '3px', fontWeight: 700, color: '#0F172A' }}>
                      {inf.uniqueCode}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#3B82F6', marginTop: '2px' }}>
                      sejal.pro{inf.referralSlug}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{inf.commissionRate}%</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#64748B' }}>{inf.totalClicks}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>{inf.totalOrdersCount}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                    ₹{inf.totalGrossRevenueINR.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                    ₹{inf.totalCommissionEarnedINR.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
