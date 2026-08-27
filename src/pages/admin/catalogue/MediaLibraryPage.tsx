import React, { useState, useEffect } from 'react';
import { Plus, Image, Search, Trash2, Copy } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { MediaAsset } from '../../../types/cms';
import { useToast } from '../../../context/ToastContext';

export const MediaLibraryPage: React.FC = () => {
  const { showToast } = useToast();
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [assetName, setAssetName] = useState('');
  const [assetUrl, setAssetUrl] = useState('');
  const [assetFolder, setAssetFolder] = useState<'products' | 'banners' | 'editorial' | 'lifestyle' | 'logos'>('products');

  const fetchMedia = async () => {
    try {
      const data = await adminService.getMedia({ folder: selectedFolder, search });
      setMedia(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder, search]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetUrl) {
      showToast('Error', 'Media URL is required.', 'error');
      return;
    }

    try {
      await adminService.uploadMedia({
        name: assetName || 'Luxury Asset',
        url: assetUrl,
        folder: assetFolder,
        fileType: 'image/jpeg',
      });
      showToast('Success', 'Media registered in library.', 'success');
      setIsUploadOpen(false);
      setAssetName('');
      setAssetUrl('');
      fetchMedia();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Copied', 'Media URL copied to clipboard.', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Central Media Library
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            High-resolution luxury imagery, campaign videos, and branded editorial collateral.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
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
          <span>+ ADD MEDIA ASSET</span>
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '12px', backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
        <input
          type="text"
          placeholder="Search media by filename or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', fontSize: '0.8125rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
        />
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          style={{ padding: '8px 12px', fontSize: '0.8125rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
        >
          <option value="">All Folders</option>
          <option value="products">Products</option>
          <option value="banners">Banners</option>
          <option value="editorial">Editorial</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="logos">Logos & Crests</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {media.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
            <img src={item.url} alt={item.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '10px' }}>
              <strong style={{ fontSize: '0.8rem', color: '#0F172A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </strong>
              <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', textTransform: 'capitalize' }}>Folder: {item.folder}</span>
              <button
                onClick={() => handleCopy(item.url)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '8px',
                  width: '100%',
                  justifyContent: 'center',
                  padding: '4px',
                  fontSize: '0.7rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '3px',
                  backgroundColor: '#F8FAFC',
                  cursor: 'pointer',
                }}
              >
                <Copy size={11} /> Copy URL
              </button>
            </div>
          </div>
        ))}
      </div>

      {isUploadOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Add Media Asset</h3>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>ASSET NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Emerald Choker Close Up"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>URL *</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={assetUrl}
                  onChange={(e) => setAssetUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>FOLDER</label>
                <select
                  value={assetFolder}
                  onChange={(e) => setAssetFolder(e.target.value as any)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                >
                  <option value="products">Products</option>
                  <option value="banners">Banners</option>
                  <option value="editorial">Editorial</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="logos">Logos</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsUploadOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
