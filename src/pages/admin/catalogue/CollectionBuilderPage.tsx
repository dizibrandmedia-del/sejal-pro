import React, { useState, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { Collection } from '../../../types/product';
import { useToast } from '../../../context/ToastContext';

export const CollectionBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [colName, setColName] = useState('');
  const [colSlug, setColSlug] = useState('');
  const [colSubtitle, setColSubtitle] = useState('');
  const [colBanner, setColBanner] = useState('');

  const fetchCollections = async () => {
    try {
      const data = await adminService.getCollections();
      setCollections(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName || !colSlug) {
      showToast('Error', 'Collection name and slug are required.', 'error');
      return;
    }

    try {
      await adminService.createCollection({
        name: colName,
        slug: colSlug,
        subtitle: colSubtitle,
        bannerImage: colBanner || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200',
        featured: true,
      });
      showToast('Success', `Created collection: ${colName}`, 'success');
      setIsModalOpen(false);
      setColName('');
      setColSlug('');
      setColSubtitle('');
      setColBanner('');
      fetchCollections();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Luxury Collection Builder
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Curate thematic seasonal edits, signature drops, and campaign collections.
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
          <span>+ NEW COLLECTION</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {collections.map((col) => (
          <div key={col.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
            <img src={col.bannerImage} alt={col.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <strong style={{ fontSize: '1rem', color: '#0F172A', display: 'block' }}>{col.name}</strong>
              <span style={{ fontSize: '0.75rem', color: '#D4AF37', display: 'block', margin: '2px 0 8px 0', fontWeight: 600 }}>{col.subtitle}</span>
              <code style={{ fontSize: '0.7rem', color: '#64748B' }}>/collections/{col.slug}</code>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Create Collection</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. The Royal Autumn Edit"
                  value={colName}
                  onChange={(e) => {
                    setColName(e.target.value);
                    if (!colSlug) setColSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>SLUG *</label>
                <input
                  type="text"
                  placeholder="e.g. royal-autumn-edit"
                  value={colSlug}
                  onChange={(e) => setColSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>SUBTITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Modern Aristocracy"
                  value={colSubtitle}
                  onChange={(e) => setColSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>HERO BANNER IMAGE URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={colBanner}
                  onChange={(e) => setColBanner(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
