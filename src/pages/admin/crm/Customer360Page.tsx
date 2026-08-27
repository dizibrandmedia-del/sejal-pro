import React, { useState, useEffect } from 'react';
import { Users, Crown, Clock, Mail, Phone, ShoppingBag, ShieldCheck, Search, Filter } from 'lucide-react';
import { crmService } from '../../../services/crmService';
import { Customer360Profile, CustomerTimelineEvent } from '../../../types/crm';
import { useToast } from '../../../context/ToastContext';

export const Customer360Page: React.FC = () => {
  const [profiles, setProfiles] = useState<Customer360Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Customer360Profile | null>(null);
  const [timeline, setTimeline] = useState<CustomerTimelineEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, [selectedCountry]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await crmService.getCustomers({
        country: selectedCountry === 'ALL' ? undefined : selectedCountry,
      });
      setProfiles(data);
      if (data.length > 0 && !selectedProfile) {
        loadDetail(data[0]);
      }
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (p: Customer360Profile) => {
    setSelectedProfile(p);
    try {
      const tl = await crmService.getCustomerTimeline(p.email);
      setTimeline(tl);
    } catch {
      setTimeline([]);
    }
  };

  const handleConsentToggle = async (key: keyof Customer360Profile['consent'], val: boolean) => {
    if (!selectedProfile) return;
    try {
      const updated = await crmService.updateConsent(selectedProfile.id, { [key]: val });
      setSelectedProfile(updated);
      setProfiles(profiles.map((p) => (p.id === updated.id ? updated : p)));
      showToast('Consent Updated', `Saved preferences for ${updated.firstName}`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const filtered = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.firstName.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.phone.includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#0F172A', letterSpacing: '0.05em', margin: 0 }}>
          CUSTOMER 360 & PRIVÉ PROFILES
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
          Unified customer relationship hub, activity timelines, Privé VIP tiers, and consent management.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Left: Customer Roster */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by client name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#F8FAFC' }}
            >
              <option value="ALL">All Territories</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          {/* Customer Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '8px 10px' }}>Client</th>
                  <th style={{ padding: '8px 10px' }}>Privé Tier</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Lifetime Spend</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Orders</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isSelected = selectedProfile?.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => loadDetail(p)}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#F8FAFC' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{p.firstName} {p.lastName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{p.email} • {p.country}</div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          backgroundColor: p.priveTier.includes('Diamond') ? '#FDF2F8' : p.priveTier.includes('Gold') ? '#FEFCE8' : '#F1F5F9',
                          color: p.priveTier.includes('Diamond') ? '#BE185D' : p.priveTier.includes('Gold') ? '#854D0E' : '#334155',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}>
                          {p.priveTier}
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                        ₹{p.lifetimeSpendINR.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#64748B' }}>
                        {p.totalOrdersCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Customer 360 & Timeline */}
        {selectedProfile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 360 Profile Header Card */}
            <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#B76E79', letterSpacing: '0.1em', fontWeight: 700 }}>
                    {selectedProfile.priveTier.toUpperCase()}
                  </span>
                  <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', margin: '4px 0' }}>
                    {selectedProfile.firstName} {selectedProfile.lastName}
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{selectedProfile.email} • {selectedProfile.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>LIFETIME SPEND</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#E2E8F0' }}>
                    ₹{selectedProfile.lifetimeSpendINR.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px', borderTop: '1px solid #334155', paddingTop: '12px', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>AOV</span>
                  <strong>₹{selectedProfile.averageOrderValueINR.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Privé Points</span>
                  <strong>{selectedProfile.privePoints.toLocaleString()} pts</strong>
                </div>
                <div>
                  <span style={{ color: '#94A3B8', display: 'block' }}>Acquisition</span>
                  <strong style={{ textTransform: 'capitalize' }}>{selectedProfile.acquisitionSource}</strong>
                </div>
              </div>
            </div>

            {/* Consent & Communication Controls */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
                MARKETING CONSENT & PREFERENCES
              </h3>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedProfile.consent.marketingEmail}
                    onChange={(e) => handleConsentToggle('marketingEmail', e.target.checked)}
                  />
                  Email Opt-In
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedProfile.consent.marketingWhatsApp}
                    onChange={(e) => handleConsentToggle('marketingWhatsApp', e.target.checked)}
                  />
                  WhatsApp Direct
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedProfile.consent.marketingSMS}
                    onChange={(e) => handleConsentToggle('marketingSMS', e.target.checked)}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>

            {/* Activity Timeline */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px', flex: 1 }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} /> CLIENT ACTIVITY TIMELINE
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
                {timeline.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center', padding: '20px' }}>
                    No recorded timeline activity yet.
                  </div>
                ) : (
                  timeline.map((evt) => (
                    <div key={evt.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', borderLeft: '2px solid #E2E8F0', paddingLeft: '12px', position: 'relative' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>{evt.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{evt.description}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '2px' }}>
                          {new Date(evt.timestamp).toLocaleString()} • {evt.channel}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
