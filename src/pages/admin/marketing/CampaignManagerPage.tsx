import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Calendar, Tag, ArrowRight } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { Campaign } from '../../../types/admin';
import { useToast } from '../../../context/ToastContext';

export const CampaignManagerPage: React.FC = () => {
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [landingPageSlug, setLandingPageSlug] = useState('bridal-edit');
  const [couponCode, setCouponCode] = useState('PRIVE10');

  const fetchCampaigns = async () => {
    try {
      const data = await adminService.getCampaigns();
      setCampaigns(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      showToast('Validation Error', 'Campaign name is required.', 'error');
      return;
    }

    try {
      await adminService.createCampaign({
        name,
        description,
        landingPageSlug,
        couponCode,
        targetAudience: 'VIP Privé Clients',
      });

      showToast('Campaign Created', `Campaign "${name}" is scheduled and live.`, 'success');
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchCampaigns();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Omni-Channel Campaign Orchestration
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Coordinate hero banners, landing pages, luxury collections, and promo privileges in one unified lifecycle.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={15} />
          <span>+ LAUNCH CAMPAIGN</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {campaigns.map((cmp) => (
          <div key={cmp.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: '#0F172A', display: 'block' }}>{cmp.name}</strong>
                <code style={{ fontSize: '0.7rem', color: '#64748B' }}>TAG: #{cmp.utmCampaignTag}</code>
              </div>
              <span style={{ fontSize: '0.65rem', backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 6px', borderRadius: '2px', fontWeight: 600 }}>
                {cmp.status.toUpperCase()}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '6px 0 14px 0' }}>{cmp.description}</p>

            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
              {cmp.landingPageSlug && (
                <span style={{ color: '#334155' }}>
                  🎯 Landing Page: <code>/{cmp.landingPageSlug}</code>
                </span>
              )}
              {cmp.couponCode && (
                <span style={{ color: '#334155' }}>
                  🏷️ Linked Coupon: <strong>{cmp.couponCode}</strong>
                </span>
              )}
              <span style={{ color: '#64748B', fontSize: '0.7rem', marginTop: '4px' }}>
                Audience: {cmp.targetAudience}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Launch Integrated Campaign</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>CAMPAIGN NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. The Royal Diwali Edit 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>DESCRIPTION</label>
                <input
                  type="text"
                  placeholder="e.g. Multi-touchpoint festival launch"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>LINKED LANDING PAGE</label>
                <input
                  type="text"
                  placeholder="bridal-edit"
                  value={landingPageSlug}
                  onChange={(e) => setLandingPageSlug(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>LINKED PRIVÉ COUPON</label>
                <input
                  type="text"
                  placeholder="PRIVE10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', textTransform: 'uppercase' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
