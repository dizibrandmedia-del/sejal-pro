import React, { useState, useEffect } from 'react';
import { Plus, Layers, Sliders, CheckCircle2, Trash2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { ProductType, CustomAttribute, AttributeFieldType } from '../../../types/admin';
import { useToast } from '../../../context/ToastContext';

export const ProductTypeBuilderPage: React.FC = () => {
  const { showToast } = useToast();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [attributes, setAttributes] = useState<CustomAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Type Modal State
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeCode, setNewTypeCode] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [selectedAttrIds, setSelectedAttrIds] = useState<string[]>([]);

  // New Attribute Modal State
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [newAttrLabel, setNewAttrLabel] = useState('');
  const [newAttrCode, setNewAttrCode] = useState('');
  const [newAttrType, setNewAttrType] = useState<AttributeFieldType>('select');
  const [newAttrOptions, setNewAttrOptions] = useState('Option 1, Option 2, Option 3');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pts, attrs] = await Promise.all([adminService.getProductTypes(), adminService.getAttributes()]);
      setProductTypes(pts);
      setAttributes(attrs);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName || !newTypeCode) {
      showToast('Validation Error', 'Name and code are required.', 'error');
      return;
    }

    try {
      await adminService.createProductType({
        name: newTypeName,
        code: newTypeCode,
        description: newTypeDesc,
        attributeIds: selectedAttrIds,
        variantAttributeIds: selectedAttrIds,
        hasVariants: true,
      });
      showToast('Success', `Created Product Type: ${newTypeName}`, 'success');
      setIsTypeModalOpen(false);
      setNewTypeName('');
      setNewTypeCode('');
      setNewTypeDesc('');
      setSelectedAttrIds([]);
      fetchData();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttrLabel || !newAttrCode) {
      showToast('Validation Error', 'Label and Code are required.', 'error');
      return;
    }

    const options = newAttrOptions
      .split(',')
      .map((s, idx) => ({ id: `opt_${Date.now()}_${idx}`, label: s.trim(), value: s.trim(), displayOrder: idx + 1, isActive: true }))
      .filter((o) => o.label.length > 0);

    try {
      await adminService.createAttribute({
        label: newAttrLabel,
        code: newAttrCode,
        fieldType: newAttrType,
        options,
        isRequired: false,
        isVisibleOnProductPage: true,
        isFilterable: true,
        isSearchable: true,
        isVariantDefining: true,
      });
      showToast('Success', `Created Custom Attribute: ${newAttrLabel}`, 'success');
      setIsAttrModalOpen(false);
      setNewAttrLabel('');
      setNewAttrCode('');
      setNewAttrOptions('Option 1, Option 2, Option 3');
      fetchData();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Dynamic Product-Type & Attribute Builder
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Define custom luxury product archetypes and schema attributes without engineering intervention.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsAttrModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <Sliders size={14} />
            <span>+ NEW ATTRIBUTE</span>
          </button>

          <button
            onClick={() => setIsTypeModalOpen(true)}
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
            <Layers size={14} />
            <span>+ NEW PRODUCT TYPE</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Product Types & Available Attributes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Product Types Column */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="#D4AF37" />
            Configured Product Types ({productTypes.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {productTypes.map((pt) => (
              <div key={pt.id} style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '14px', backgroundColor: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>{pt.name}</strong>
                    <code style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>type: {pt.code}</code>
                  </div>
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 6px', borderRadius: '2px', fontWeight: 600 }}>
                    ACTIVE ARCHETYPE
                  </span>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#475569', margin: '4px 0 10px 0' }}>{pt.description}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {pt.attributeIds.map((aId) => {
                    const matched = attributes.find((a) => a.id === aId);
                    return (
                      <span key={aId} style={{ fontSize: '0.6875rem', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '2px 6px', borderRadius: '3px', color: '#334155' }}>
                        {matched?.label || aId}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Attributes Column */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} color="#3B82F6" />
            Attribute Registry ({attributes.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {attributes.map((attr) => (
              <div key={attr.id} style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '14px', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>{attr.label}</strong>
                  <span style={{ fontSize: '0.7rem', backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 6px', borderRadius: '2px' }}>
                    <code>{attr.fieldType}</code>
                  </span>
                </div>

                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                  code: <code>{attr.code}</code> {attr.unit && `• Unit: ${attr.unit}`}
                </span>

                {attr.options && attr.options.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {attr.options.map((opt) => (
                      <span key={opt.id} style={{ fontSize: '0.6875rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: '3px', color: '#475569' }}>
                        {opt.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: New Product Type */}
      {isTypeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Create New Product Type</h3>
            <form onSubmit={handleCreateType} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>TYPE NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. Bespoke Minaudières"
                  value={newTypeName}
                  onChange={(e) => {
                    setNewTypeName(e.target.value);
                    if (!newTypeCode) setNewTypeCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>SLUG / CODE *</label>
                <input
                  type="text"
                  placeholder="e.g. bespoke-minaudieres"
                  value={newTypeCode}
                  onChange={(e) => setNewTypeCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>DESCRIPTION</label>
                <input
                  type="text"
                  placeholder="Brief description of this creation archetype"
                  value={newTypeDesc}
                  onChange={(e) => setNewTypeDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>ASSIGN ATTRIBUTES</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                  {attributes.map((a) => (
                    <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedAttrIds.includes(a.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedAttrIds([...selectedAttrIds, a.id]);
                          else setSelectedAttrIds(selectedAttrIds.filter((id) => id !== a.id));
                        }}
                      />
                      <span>{a.label} (<code>{a.fieldType}</code>)</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsTypeModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Save Product Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Custom Attribute */}
      {isAttrModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Create Custom Attribute</h3>
            <form onSubmit={handleCreateAttribute} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>ATTRIBUTE LABEL *</label>
                <input
                  type="text"
                  placeholder="e.g. Leather Grain Texture"
                  value={newAttrLabel}
                  onChange={(e) => {
                    setNewAttrLabel(e.target.value);
                    if (!newAttrCode) setNewAttrCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                  }}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>ATTRIBUTE CODE *</label>
                <input
                  type="text"
                  placeholder="e.g. leather_grain_texture"
                  value={newAttrCode}
                  onChange={(e) => setNewAttrCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'))}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>FIELD TYPE *</label>
                <select
                  value={newAttrType}
                  onChange={(e) => setNewAttrType(e.target.value as any)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                >
                  <option value="select">Select (Dropdown)</option>
                  <option value="multi-select">Multi-Select</option>
                  <option value="colour">Colour Swatch</option>
                  <option value="text">Text Input</option>
                  <option value="number">Number</option>
                  <option value="measurement">Measurement (with Unit)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>OPTIONS (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Clemence, Box Calf, Epsom, Ostrich"
                  value={newAttrOptions}
                  onChange={(e) => setNewAttrOptions(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsAttrModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Save Attribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
