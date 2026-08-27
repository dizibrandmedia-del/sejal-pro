import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit2, Globe } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { EditorialArticle } from '../../../types/cms';
import { useToast } from '../../../context/ToastContext';

export const EditorialCMSPage: React.FC = () => {
  const { showToast } = useToast();
  const [articles, setArticles] = useState<EditorialArticle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'High Jewellery' | 'Haute Couture' | 'Fragrance' | 'Art of Gifting' | 'Heritage & Craft'>('High Jewellery');
  const [coverUrl, setCoverUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');

  const fetchArticles = async () => {
    try {
      const data = await adminService.getEditorials();
      setArticles(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      showToast('Validation Error', 'Article title and slug are required.', 'error');
      return;
    }

    try {
      await adminService.createEditorial({
        title,
        slug,
        subtitle,
        category,
        coverImageUrl: coverUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
        excerpt,
        bodyMarkdown: body || `### ${title}\n\nCrafted with exceptional mastery.`,
        isPublished: true,
      });

      showToast('Article Published', `Published journal article: ${title}`, 'success');
      setIsModalOpen(false);
      setTitle('');
      setSlug('');
      setSubtitle('');
      setExcerpt('');
      setBody('');
      fetchArticles();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            The SEJAL Journal & Editorial CMS
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Publish high-fashion editorial narratives, atelier interviews, and savoir-faire masterclasses.
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
          <span>+ WRITE JOURNAL STORY</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {articles.map((art) => (
          <div key={art.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
            <img src={art.coverImageUrl} alt={art.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>{art.category}</span>
                <span style={{ fontSize: '0.65rem', color: '#64748B' }}>{art.readTimeMinutes} min read</span>
              </div>
              <strong style={{ fontSize: '0.95rem', color: '#0F172A', display: 'block', lineHeight: 1.3 }}>{art.title}</strong>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '6px 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {art.excerpt}
              </p>
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>By {art.author}</span>
                <code style={{ fontSize: '0.7rem', color: '#2563EB' }}>/journal/{art.slug}</code>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Write Journal Article</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>ARTICLE TITLE *</label>
                <input
                  type="text"
                  placeholder="e.g. The Alchemy of Rare Belgian Diamonds"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>SLUG *</label>
                <input
                  type="text"
                  placeholder="e.g. alchemy-rare-belgian-diamonds"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="High Jewellery">High Jewellery</option>
                    <option value="Haute Couture">Haute Couture</option>
                    <option value="Fragrance">Fragrance</option>
                    <option value="Art of Gifting">Art of Gifting</option>
                    <option value="Heritage & Craft">Heritage & Craft</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>COVER IMAGE URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>EXCERPT</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short excerpt for journal feed..."
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>ARTICLE BODY (MARKDOWN)</label>
                <textarea
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="### Section Heading\n\nFull story text..."
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
