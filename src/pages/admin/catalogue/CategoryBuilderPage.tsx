import React, { useState, useEffect } from 'react';
import { Plus, FolderTree, Edit2, Trash2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { Category } from '../../../types/product';
import { useToast } from '../../../context/ToastContext';

export const CategoryBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatTagline, setNewCatTagline] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newSubcats, setNewSubcats] = useState('Chokers, Solitaires, Bangles');

  const fetchCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) {
      showToast('Validation Error', 'Category name and slug are required.', 'error');
      return;
    }

    const subcategories = newSubcats
      .split(',')
      .map((s) => ({
        id: `sub_${s.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        slug: s.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: s.trim(),
      }))
      .filter((s) => s.name.length > 0);

    try {
      await adminService.createCategory({
        name: newCatName,
        slug: newCatSlug,
        tagline: newCatTagline,
        editorialImage: newCatImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
        subcategories,
        order: categories.length + 1,
      });

      showToast('Category Created', `Created category: ${newCatName}`, 'success');
      setIsModalOpen(false);
      setNewCatName('');
      setNewCatSlug('');
      setNewCatTagline('');
      setNewCatImage('');
      fetchCategories();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Category & Subcategory Hierarchy
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Organize the Maison's luxury departments, subcategories, and navigation portals.
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
          <span>+ NEW CATEGORY</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
            <img src={cat.editorialImage} alt={cat.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#0F172A', display: 'block' }}>{cat.name}</strong>
                  <code style={{ fontSize: '0.7rem', color: '#64748B' }}>/category/{cat.slug}</code>
                </div>
                <span style={{ fontSize: '0.7rem', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '2px', fontWeight: 600 }}>
                  Order #{cat.order}
                </span>
              </div>

              {cat.tagline && <p style={{ fontSize: '0.75rem', color: '#64748B', fontStyle: 'italic', margin: '6px 0 12px 0' }}>{cat.tagline}</p>}

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '10px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  SUBCATEGORIES ({cat.subcategories?.length || 0})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {cat.subcategories?.map((sub) => (
                    <span key={sub.id} style={{ fontSize: '0.6875rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: '3px', color: '#334155' }}>
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Create Category</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>CATEGORY NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. Fine Silk & Zardozi Drapes"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>SLUG *</label>
                <input
                  type="text"
                  placeholder="e.g. silk-zardozi-drapes"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>EDITORIAL TAGLINE</label>
                <input
                  type="text"
                  placeholder="e.g. Woven by royal heritage looms"
                  value={newCatTagline}
                  onChange={(e) => setNewCatTagline(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>IMAGE URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>SUBCATEGORIES (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Chokers, Solitaires, Cuff Bracelets"
                  value={newSubcats}
                  onChange={(e) => setNewSubcats(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
