import React, { useState, useEffect } from 'react';
import { Globe, Plus, ExternalLink, DollarSign, Download } from 'lucide-react';
import { crmService } from '../../../services/crmService';
import { AffiliateProfile } from '../../../types/attribution';
import { useToast } from '../../../context/ToastContext';

export const AffiliateManagerPage: React.FC = () => {
  const [affiliates, setAffiliates] = useState<AffiliateProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const [referralSlug, setReferralSlug] = useState('');
  const [commissionPercentage, setCommissionPercentage] = useState(8);
  const { showToast } = useToast();

  useEffect(() => {
    loadAffiliates();
  }, []);

  const loadAffiliates = async () => {
    try {
      const data = await crmService.getAffiliates();
      setAffiliates(data);
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await crmService.saveAffiliate({
        companyName,
        contactPerson,
        email,
        phone: '',
        websiteUrl: '',
        uniqueCode: uniqueCode.toUpperCase(),
        referralSlug: referralSlug.startsWith('/') ? referralSlug : `/${referralSlug}`,
        commissionPercentage,
        status: 'active',
      });
      setAffiliates([...affiliates, created]);
      setIsCreating(false);
      showToast('Affiliate Registered', `Partner ${created.companyName} active`, 'success');
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
            AFFILIATE & MEDIA GUILD PARTNERS
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Curated luxury publication partners, editorial links, and conversion revenue attribution.
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
          <Plus size={15} /> {isCreating ? 'Cancel' : 'Add Partner'}
        </button>
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
            Register New Affiliate Publication Partner
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Publication / Guild Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Vogue Middle East"
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Partner Lead / Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Kareem Al-Sayed"
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Unique Partner Code *
              </label>
              <input
                type="text"
                value={uniqueCode}
                onChange={(e) => setUniqueCode(e.target.value.toUpperCase())}
                placeholder="VOGUEGLOBAL"
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Referral Path
              </label>
              <input
                type="text"
                value={referralSlug}
                onChange={(e) => setReferralSlug(e.target.value)}
                placeholder="/partner/vogue-me"
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Commission Percentage (%)
              </label>
              <input
                type="number"
                value={commissionPercentage}
                onChange={(e) => setCommissionPercentage(Number(e.target.value))}
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
            Register Partner
          </button>
        </form>
      )}

      {/* Affiliates Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
          Affiliate Guild Roster ({affiliates.length})
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                <th style={{ padding: '8px 12px' }}>Partner Guild</th>
                <th style={{ padding: '8px 12px' }}>Code / Tracking Link</th>
                <th style={{ padding: '8px 12px' }}>Rate</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Clicks</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Orders</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Gross Attributed</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Commission Earned</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((aff) => (
                <tr key={aff.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{aff.companyName}</div>
                    <span style={{ fontSize: '0.65rem', color: '#64748B' }}>Contact: {aff.contactPerson}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '3px', fontWeight: 700, color: '#0F172A' }}>
                      {aff.uniqueCode}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#3B82F6', marginTop: '2px' }}>
                      sejal.pro{aff.referralSlug}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{aff.commissionPercentage}%</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#64748B' }}>{aff.totalClicks}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>{aff.totalOrdersCount}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                    ₹{aff.totalGrossRevenueINR.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                    ₹{aff.totalCommissionEarnedINR.toLocaleString('en-IN')}
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
