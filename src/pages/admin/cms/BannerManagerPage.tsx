import React, { useState, useEffect } from 'react';
import { Plus, Flag, Trash2, Edit2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { Banner } from '../../../types/cms';
import { useToast } from '../../../context/ToastContext';

export const BannerManagerPage: React.FC = () => {
  const { showToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [desktopUrl, setDesktopUrl] = useState('');
  const [mobileUrl, setMobileUrl] = useState('');
  const [ctaText, setCtaText] = useState('EXPLORE THE EDIT');
  const [destinationUrl, setDestinationUrl] = useState('/shop');
  const [priority, setPriority] = useState(10);

  const fetchBanners = async () => {
    try {
      const data = await adminService.getBanners();
      setBanners(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desktopUrl) {
      showToast('Validation Error', 'Title and Desktop URL are required.', 'error');
      return;
    }

    try {
      await adminService.createBanner({
        title,
        subtitle,
        desktopMediaUrl: desktopUrl,
        mobileMediaUrl: mobileUrl || desktopUrl,
        ctaText,
        destinationUrl,
        priority: Number(priority),
        isActive: true,
      });

      showToast('Banner Created', `Published banner: ${title}`, 'success');
      setIsModalOpen(false);
      setTitle('');
      setSubtitle('');
      setDesktopUrl('');
      setMobileUrl('');
      fetchBanners();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Banner & Promotional Broadcast Manager
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Desktop and mobile responsive hero banners, category headers, and campaign interstitials.
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
          <span>+ CREATE BANNER</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {banners.map((b) => (
          <div key={b.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
            <img src={b.desktopMediaUrl} alt={b.altText} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#0F172A', display: 'block' }}>{b.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{b.subtitle}</span>
                </div>
                <span style={{ fontSize: '0.65rem', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '2px', fontWeight: 600 }}>
                  Priority: {b.priority}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ fontSize: '0.7rem', color: '#334155' }}>CTA: {b.ctaText} → {b.destinationUrl}</code>
                <span style={{ fontSize: '0.65rem', color: b.isActive ? '#10B981' : '#64748B', fontWeight: 600 }}>
                  {b.isActive ? '● ACTIVE' : '○ INACTIVE'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Create Banner</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>BANNER TITLE *</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Diwali High Jewellery Suite"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>SUBTITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Rare Belgian Solitaires set in 18K Rose Gold"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>DESKTOP IMAGE URL *</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={desktopUrl}
                  onChange={(e) => setDesktopUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>MOBILE IMAGE URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={mobileUrl}
                  onChange={(e) => setMobileUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>CTA LABEL</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>DESTINATION URL</label>
                  <input
                    type="text"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
