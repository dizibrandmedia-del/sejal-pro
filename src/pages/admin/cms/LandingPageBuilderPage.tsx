import React, { useState, useEffect } from 'react';
import { Plus, FileText, Globe, Eye, ExternalLink } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { LandingPage, LandingPageBlock } from '../../../types/cms';
import { useToast } from '../../../context/ToastContext';

export const LandingPageBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [heroMedia, setHeroMedia] = useState('');

  const fetchPages = async () => {
    try {
      const data = await adminService.getLandingPages();
      setPages(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      showToast('Validation Error', 'Title and slug are required.', 'error');
      return;
    }

    const blocks: LandingPageBlock[] = [
      {
        id: `blk_${Date.now()}_1`,
        type: 'hero_banner',
        title: title,
        content: tagline || 'An exclusive curation by Maison SEJAL.',
        mediaUrl: heroMedia || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600',
        sortOrder: 1,
      },
      {
        id: `blk_${Date.now()}_2`,
        type: 'collection_spotlight',
        title: 'Featured Curations',
        collectionSlug: 'signature-collection',
        sortOrder: 2,
      },
      {
        id: `blk_${Date.now()}_3`,
        type: 'call_to_action',
        title: 'Book a Private Salon Consultation',
        content: 'Meet privately with Sejal Gupta in Mumbai, Dubai, or via encrypted link.',
        ctaText: 'BOOK PRIVATE CONCIERGE',
        ctaUrl: '/account?tab=concierge',
        sortOrder: 3,
      },
    ];

    try {
      await adminService.createLandingPage({
        title,
        slug,
        tagline,
        blocks,
        isPublished: true,
      });

      showToast('Page Created', `Created landing page /${slug}`, 'success');
      setIsModalOpen(false);
      setTitle('');
      setSlug('');
      setTagline('');
      setHeroMedia('');
      fetchPages();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Modular Landing Page Builder
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Build standalone luxury landing pages (/bridal-edit, /festive-edit, /uae-luxury) with modular layout blocks.
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
          <span>+ NEW LANDING PAGE</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {pages.map((lp) => (
          <div key={lp.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: '#0F172A', display: 'block' }}>{lp.title}</strong>
                <code style={{ fontSize: '0.75rem', color: '#2563EB' }}>/{lp.slug}</code>
              </div>
              <span style={{ fontSize: '0.65rem', backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 6px', borderRadius: '2px', fontWeight: 600 }}>
                {lp.isPublished ? 'PUBLISHED' : 'DRAFT'}
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '6px 0 14px 0' }}>{lp.tagline || 'Curated luxury landing page.'}</p>

            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{lp.blocks.length} Modular Blocks</span>
              <a href={`/${lp.slug}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                Preview <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Create Landing Page</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>PAGE TITLE *</label>
                <input
                  type="text"
                  placeholder="e.g. The Royal Bridal Sanctuary"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>URL SLUG (e.g. /bridal-edit) *</label>
                <input
                  type="text"
                  placeholder="e.g. bridal-edit"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>TAGLINE</label>
                <input
                  type="text"
                  placeholder="e.g. Haute Joaillerie & Custom Zardozi Drapes"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>HERO MEDIA URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={heroMedia}
                  onChange={(e) => setHeroMedia(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
