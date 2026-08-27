import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { CouponRule } from '../../../types/admin';
import { useToast } from '../../../context/ToastContext';

export const CouponManagerPage: React.FC = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<CouponRule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [minCartValueINR, setMinCartValueINR] = useState(50000);
  const [maxDiscountINR, setMaxDiscountINR] = useState(50000);

  const fetchCoupons = async () => {
    try {
      const data = await adminService.getCoupons();
      setCoupons(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) {
      showToast('Validation Error', 'Coupon code and discount are required.', 'error');
      return;
    }

    try {
      await adminService.createCoupon({
        code: code.toUpperCase().trim(),
        description,
        discountType,
        discountValue: Number(discountValue),
        minCartValueINR: Number(minCartValueINR) || 0,
        maxDiscountINR: discountType === 'percentage' ? Number(maxDiscountINR) || undefined : undefined,
        isActive: true,
      });

      showToast('Coupon Created', `Privé Code "${code.toUpperCase()}" is now active.`, 'success');
      setIsModalOpen(false);
      setCode('');
      setDescription('');
      fetchCoupons();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Privé Promo Codes & Discount Rules
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Configure percentage and fixed courtesy codes with minimum cart thresholds, maximum caps, and country eligibility.
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
          <span>+ CREATE PROMO CODE</span>
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>Privé Code</th>
              <th style={{ padding: '12px 16px' }}>Discount Privilege</th>
              <th style={{ padding: '12px 16px' }}>Min. Cart Basket</th>
              <th style={{ padding: '12px 16px' }}>Max. Cap</th>
              <th style={{ padding: '12px 16px' }}>Claims</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px' }}>
                  <code style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '3px' }}>
                    {c.code}
                  </code>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginTop: '4px' }}>{c.description}</span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#D4AF37' }}>
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue.toLocaleString('en-IN')} OFF`}
                </td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>
                  {c.minCartValueINR > 0 ? `₹${c.minCartValueINR.toLocaleString('en-IN')}` : 'No minimum'}
                </td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>
                  {c.maxDiscountINR ? `₹${c.maxDiscountINR.toLocaleString('en-IN')}` : 'Unlimited'}
                </td>
                <td style={{ padding: '12px 16px', color: '#64748B' }}>
                  {c.usageCount} claims
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.6875rem', backgroundColor: c.isActive ? '#ECFDF5' : '#F1F5F9', color: c.isActive ? '#059669' : '#64748B', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                    {c.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Create Promo Code</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>CODE *</label>
                <input
                  type="text"
                  placeholder="e.g. PRIVE20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>DESCRIPTION</label>
                <input
                  type="text"
                  placeholder="e.g. 20% Privé Salon Privilege"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>TYPE</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>VALUE *</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>MIN CART (₹)</label>
                  <input
                    type="number"
                    value={minCartValueINR}
                    onChange={(e) => setMinCartValueINR(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>MAX CAP (₹)</label>
                  <input
                    type="number"
                    value={maxDiscountINR}
                    onChange={(e) => setMaxDiscountINR(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Activate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
