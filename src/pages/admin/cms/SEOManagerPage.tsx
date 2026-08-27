import React, { useState } from 'react';
import { Search, Globe, FileCode, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const SEOManagerPage: React.FC = () => {
  const { showToast } = useToast();
  const [globalTitle, setGlobalTitle] = useState('SEJAL.PRO | Ultra-Luxury Women’s Commerce & High Joaillerie');
  const [globalDesc, setGlobalDesc] = useState('Curated luxury, just for her. Discover Belgian diamond high jewellery, pure silk couture, and bespoke flacons.');
  const [ogImageUrl, setOgImageUrl] = useState('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('SEO Settings Updated', 'Global meta tags and OpenGraph config saved.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Global SEO & Discovery Settings
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
          Configure title tags, OpenGraph social sharing preview, XML sitemaps, and indexing rules.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            GLOBAL SITE TITLE (DEFAULT)
          </label>
          <input
            type="text"
            value={globalTitle}
            onChange={(e) => setGlobalTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            GLOBAL META DESCRIPTION
          </label>
          <textarea
            rows={3}
            value={globalDesc}
            onChange={(e) => setGlobalDesc(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            DEFAULT OPENGRAPH (OG:IMAGE) URL
          </label>
          <input
            type="text"
            value={ogImageUrl}
            onChange={(e) => setOgImageUrl(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
          />
        </div>

        {/* Google SERP Preview */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '16px', backgroundColor: '#F8FAFC' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '8px' }}>
            GOOGLE SEARCH SERP PREVIEW
          </span>
          <span style={{ fontSize: '0.75rem', color: '#1A0DAB', display: 'block', textDecoration: 'underline', fontWeight: 600 }}>
            {globalTitle}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#006621', display: 'block' }}>
            https://sejal.pro
          </span>
          <span style={{ fontSize: '0.75rem', color: '#545454', display: 'block', marginTop: '2px' }}>
            {globalDesc}
          </span>
        </div>

        {/* Dynamic XML Sitemap & Robots */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', gap: '16px' }}>
          <a
            href="/api/cms/seo/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#0F172A',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <FileCode size={14} />
            <span>View Dynamic Sitemap.xml</span>
          </a>

          <a
            href="/api/cms/seo/robots.txt"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#0F172A',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <Globe size={14} />
            <span>View Robots.txt</span>
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save SEO Settings
          </button>
        </div>
      </form>
    </div>
  );
};
