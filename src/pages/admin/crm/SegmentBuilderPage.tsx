import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { crmService } from '../../../services/crmService';
import { DynamicSegment, SegmentRule } from '../../../types/crm';
import { useToast } from '../../../context/ToastContext';

export const SegmentBuilderPage: React.FC = () => {
  const [segments, setSegments] = useState<DynamicSegment[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logic, setLogic] = useState<'ALL' | 'ANY'>('ALL');
  const [rules, setRules] = useState<SegmentRule[]>([
    { field: 'country', operator: 'equals', value: 'United Arab Emirates' },
  ]);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    try {
      const data = await crmService.getSegments();
      setSegments(data);
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleAddRule = () => {
    setRules([...rules, { field: 'lifetimeSpendINR', operator: 'greater_than_or_equal', value: 500000 }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, key: keyof SegmentRule, val: any) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], [key]: val };
    setRules(updated);
  };

  const handleSaveSegment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Validation Error', 'Segment name is required.', 'error');
      return;
    }

    try {
      const created = await crmService.createSegment({
        name,
        description,
        logic,
        rules,
      });
      setSegments([...segments, created]);
      setIsCreating(false);
      setName('');
      setDescription('');
      showToast('Segment Created', `Calculated audience: ${created.memberCount} VIP clients`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleReevaluate = async (id: string) => {
    setEvaluatingId(id);
    try {
      const res = await crmService.evaluateSegment(id);
      setSegments(segments.map((s) => (s.id === id ? res.segment : s)));
      showToast('Segment Evaluated', `Updated audience: ${res.segment.memberCount} clients`, 'success');
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setEvaluatingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#0F172A', letterSpacing: '0.05em', margin: 0 }}>
            DYNAMIC CUSTOMER SEGMENT BUILDER
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Build multi-rule audience segments with live recalculation against authoritative CRM data.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={15} /> {isCreating ? 'Cancel' : 'Create Segment'}
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form
          onSubmit={handleSaveSegment}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Define Dynamic Audience Segment
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Segment Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. GCC High Jewellery Collectors"
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Rule Combination Logic
              </label>
              <select
                value={logic}
                onChange={(e) => setLogic(e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#F8FAFC' }}
              >
                <option value="ALL">Match ALL Rules (AND)</option>
                <option value="ANY">Match ANY Rule (OR)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High net-worth clients in UAE who have acquired diamond collar necklaces..."
              style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
            />
          </div>

          {/* Rules Builder */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>CRITERIA RULES</span>
              <button
                type="button"
                onClick={handleAddRule}
                style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                + Add Rule
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rules.map((rule, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr 36px', gap: '10px', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '4px' }}>
                  <select
                    value={rule.field}
                    onChange={(e) => handleRuleChange(idx, 'field', e.target.value)}
                    style={{ padding: '6px', fontSize: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  >
                    <option value="country">Country</option>
                    <option value="lifetimeSpendINR">Lifetime Spend (INR)</option>
                    <option value="totalOrdersCount">Total Orders Count</option>
                    <option value="averageOrderValueINR">Average Order Value (INR)</option>
                    <option value="priveTier">Privé VIP Tier</option>
                    <option value="categoryAffinity">Category Affinity</option>
                    <option value="hasAbandonedCart">Has Abandoned Cart</option>
                    <option value="acquisitionSource">Acquisition Source</option>
                  </select>

                  <select
                    value={rule.operator}
                    onChange={(e) => handleRuleChange(idx, 'operator', e.target.value)}
                    style={{ padding: '6px', fontSize: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not Equals</option>
                    <option value="greater_than_or_equal">&gt;= Greater/Equal</option>
                    <option value="less_than_or_equal">&lt;= Less/Equal</option>
                    <option value="contains">Contains</option>
                    <option value="is_true">Is True</option>
                  </select>

                  <input
                    type="text"
                    value={rule.value}
                    onChange={(e) => handleRuleChange(idx, 'value', e.target.value)}
                    placeholder="Rule value..."
                    style={{ padding: '6px', fontSize: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{
              alignSelf: 'flex-start',
              padding: '10px 24px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Save & Evaluate Audience
          </button>
        </form>
      )}

      {/* Segments Roster */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {segments.map((seg) => (
          <div
            key={seg.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  {seg.name}
                </h3>
                <span style={{ backgroundColor: '#F1F5F9', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>
                  {seg.logic}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '6px 0 12px 0' }}>
                {seg.description || 'No description provided.'}
              </p>

              <div style={{ fontSize: '0.7rem', color: '#475569', backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '4px' }}>
                <strong>Rules ({seg.rules.length}):</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                  {seg.rules.map((r, i) => (
                    <li key={i}>{r.field} {r.operator} {String(r.value)}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px', marginTop: '16px' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block' }}>AUDIENCE SIZE</span>
                <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>{seg.memberCount} clients</strong>
              </div>
              <button
                onClick={() => handleReevaluate(seg.id)}
                disabled={evaluatingId === seg.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={13} className={evaluatingId === seg.id ? 'spin' : ''} /> Recalculate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
