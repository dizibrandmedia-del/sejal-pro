import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Sparkles, Layers, Image as ImageIcon, Plus, Trash2, Globe } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { Product, ProductVariant } from '../../../types/product';
import { ProductType, CustomAttribute } from '../../../types/admin';
import { useToast } from '../../../context/ToastContext';

interface ProductEditorPageProps {
  productId?: string | null;
  onBack: () => void;
}

export const ProductEditorPage: React.FC<ProductEditorPageProps> = ({ productId, onBack }) => {
  const { showToast } = useToast();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [allAttributes, setAllAttributes] = useState<CustomAttribute[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'pricing' | 'attributes' | 'variants' | 'media' | 'seo'>('details');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    slug: '',
    brand: 'SEJAL Signature',
    productType: 'high-jewellery',
    category: 'high-jewellery',
    basePriceINR: 500000,
    compareAtPriceINR: undefined,
    salePriceINR: undefined,
    stock: 4,
    availability: 'in-stock',
    isSignature: true,
    isLimitedEdition: false,
    shortDescription: '',
    story: '',
    craftsmanship: 'Hand-crafted over 180 atelier hours in Antwerp and Jaipur.',
    packagingDetails: 'Signature SEJAL Rose Gold Coffret & Silk Dust Pouch',
    careGuide: 'Store in velvet-lined casket; avoid direct perfume application.',
    media: [
      {
        id: 'med_1',
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
        alt: 'High Jewellery Creation',
        type: 'image',
        isPrimary: true,
      },
    ],
    variants: [],
    attributes: [],
  });

  useEffect(() => {
    const init = async () => {
      try {
        const [pts, attrs] = await Promise.all([adminService.getProductTypes(), adminService.getAttributes()]);
        setProductTypes(pts);
        setAllAttributes(attrs);

        if (productId) {
          const existing = await adminService.getProductById(productId);
          if (existing) setFormData(existing);
        }
      } catch (err: any) {
        showToast('Error', err.message, 'error');
      }
    };
    init();
  }, [productId]);

  const currentType = productTypes.find((pt) => pt.code === formData.productType) || productTypes[0];
  const assignedAttributes = allAttributes.filter((attr) => currentType?.attributeIds.includes(attr.id));

  const handleSave = async () => {
    if (!formData.name || !formData.sku || !formData.basePriceINR) {
      showToast('Validation Error', 'Product Name, SKU, and Base Price are mandatory.', 'error');
      return;
    }

    try {
      if (productId) {
        await adminService.updateProduct(productId, formData, 'Product Manager');
        showToast('Product Updated', `Saved changes to ${formData.name}`, 'success');
      } else {
        await adminService.createProduct(formData, 'Product Manager');
        showToast('Product Created', `Created new luxury creation: ${formData.name}`, 'success');
      }
      onBack();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleAddMedia = () => {
    const url = prompt('Enter High-Resolution Media URL (Image or Video):');
    if (!url) return;
    const newMedia = [
      ...(formData.media || []),
      {
        id: `med_${Date.now()}`,
        url,
        alt: formData.name || 'Creation Image',
        type: 'image' as const,
        isPrimary: (formData.media || []).length === 0,
      },
    ];
    setFormData({ ...formData, media: newMedia });
  };

  const handleRemoveMedia = (index: number) => {
    const updated = (formData.media || []).filter((_, idx) => idx !== index);
    setFormData({ ...formData, media: updated });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{ padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {productId ? `Edit Creation: ${formData.name}` : 'Create New Luxury Creation'}
            </h1>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Product Type: <strong style={{ color: '#0F172A' }}>{currentType?.name || 'Haute Joaillerie'}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
          <Save size={15} />
          <span>PUBLISH & SAVE CREATION</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', gap: '4px' }}>
        {[
          { id: 'details', label: '1. Basic Information' },
          { id: 'pricing', label: '2. Multi-Currency Pricing' },
          { id: 'attributes', label: `3. Dynamic Attributes (${assignedAttributes.length})` },
          { id: 'media', label: `4. Media Gallery (${formData.media?.length || 0})` },
          { id: 'seo', label: '5. SEO & Metadata' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 18px',
              fontSize: '0.8125rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#0F172A' : '#64748B',
              backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
              border: '1px solid',
              borderColor: activeTab === tab.id ? '#E2E8F0 #E2E8F0 #FFFFFF #E2E8F0' : 'transparent',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '0 0 6px 6px', padding: '24px' }}>
        {/* 1. Basic Details */}
        {activeTab === 'details' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                CREATION TITLE *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. The Aura Diamond Collar"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                MASTER SKU *
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="e.g. SEJ-JW-AUR-001"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                PRODUCT TYPE (ARCHETYPE) *
              </label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
              >
                {productTypes.map((pt) => (
                  <option key={pt.id} value={pt.code}>
                    {pt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                CATEGORY *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
              >
                <option value="high-jewellery">High Jewellery</option>
                <option value="haute-couture">Haute Couture</option>
                <option value="fragrance">Haute Parfumerie</option>
                <option value="leather-goods">Leather Goods</option>
                <option value="footwear">Footwear</option>
                <option value="watches">High Horology</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                SHORT CURATORIAL DESCRIPTION
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Poetic summary displayed in product cards and previews."
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                CRAFTSMANSHIP & ATELIER STORY
              </label>
              <textarea
                rows={4}
                value={formData.craftsmanship || ''}
                onChange={(e) => setFormData({ ...formData, craftsmanship: e.target.value })}
                placeholder="Details of the master artisans, hours required, and provenance."
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
          </div>
        )}

        {/* 2. Pricing */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                BASE PRICE (INR) *
              </label>
              <input
                type="number"
                value={formData.basePriceINR || ''}
                onChange={(e) => setFormData({ ...formData, basePriceINR: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                COMPARE AT PRICE (INR)
              </label>
              <input
                type="number"
                value={formData.compareAtPriceINR || ''}
                onChange={(e) => setFormData({ ...formData, compareAtPriceINR: Number(e.target.value) || undefined })}
                placeholder="Original value for strikethrough display"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                INITIAL VAULT ALLOCATION (STOCK) *
              </label>
              <input
                type="number"
                value={formData.stock || 4}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
          </div>
        )}

        {/* 3. Dynamic Attributes */}
        {activeTab === 'attributes' && (
          <div>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '16px' }}>
              These attributes are dynamically dictated by the <strong>{currentType?.name}</strong> Product Type. No developer or database schema migration is required.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {assignedAttributes.map((attr) => (
                <div key={attr.id} style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                    {attr.label.toUpperCase()} {attr.isRequired && '*'}
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                    Field Type: <code>{attr.fieldType}</code> {attr.unit && `(${attr.unit})`}
                  </span>

                  {attr.fieldType === 'select' || attr.fieldType === 'colour' ? (
                    <select style={{ width: '100%', padding: '8px', fontSize: '0.8125rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}>
                      {attr.options?.map((opt) => (
                        <option key={opt.id} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={attr.fieldType === 'number' ? 'number' : 'text'}
                      placeholder={`Enter ${attr.label}...`}
                      style={{ width: '100%', padding: '8px', fontSize: '0.8125rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Media Gallery */}
        {activeTab === 'media' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                High-resolution luxury imagery and 4K editorial campaign videos.
              </span>
              <button
                onClick={handleAddMedia}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} /> Add Media URL
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {formData.media?.map((m, idx) => (
                <div key={m.id} style={{ border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                  <img src={m.url} alt={m.alt} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{m.isPrimary ? '★ Primary' : `Slot ${idx + 1}`}</span>
                    <button
                      onClick={() => handleRemoveMedia(idx)}
                      style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SEO */}
        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                META TITLE
              </label>
              <input
                type="text"
                value={formData.seo?.metaTitle || `${formData.name} | SEJAL.PRO Luxury`}
                onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } as any })}
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                META DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={formData.seo?.metaDescription || formData.shortDescription || ''}
                onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } as any })}
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
