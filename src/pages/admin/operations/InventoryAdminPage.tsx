import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { InventoryItem } from '../../../types/inventory';
import { apiClient } from '../../../services/apiClient';
import { useToast } from '../../../context/ToastContext';

export const InventoryAdminPage: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Adjustment Modal
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [adjDelta, setAdjDelta] = useState<number>(1);
  const [adjReason, setAdjReason] = useState('Atelier replenishment intake');

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<InventoryItem[]>('/inventory/status');
      setItems(res.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSku) return;

    try {
      await apiClient.post('/inventory/adjust', {
        sku: selectedSku,
        quantityDelta: Number(adjDelta),
        reason: adjReason,
        actor: 'Vault Master (Product Manager)',
      });

      showToast('Inventory Adjusted', `Successfully adjusted stock for SKU: ${selectedSku}`, 'success');
      setSelectedSku(null);
      fetchInventory();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const filtered = items.filter(
    (i) =>
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Inventory Vault & Stock Mutex Control
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Concurrency-locked real-time stock balances across available, reserved, sold, and damaged units.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} />
          <span>Refresh Balances</span>
        </button>
      </div>

      {/* Filter */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '14px' }}>
        <input
          type="text"
          placeholder="Filter by SKU or Product Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 12px', fontSize: '0.8125rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
        />
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>Master SKU</th>
              <th style={{ padding: '12px 16px' }}>Creation & Variant</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Available</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Reserved</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Sold</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Damaged</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Total Vault</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px' }}>
                  <code style={{ fontWeight: 600, color: '#0F172A' }}>{item.sku}</code>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <strong style={{ color: '#0F172A', display: 'block' }}>{item.productName}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{item.variantTitle}</span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: item.availableQuantity <= 2 ? '#DC2626' : '#16A34A',
                      backgroundColor: item.availableQuantity <= 2 ? '#FEF2F2' : '#F0FDF4',
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    {item.availableQuantity}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#64748B' }}>{item.reservedQuantity}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#64748B' }}>{item.soldQuantity}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#DC2626' }}>{item.damagedQuantity}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#0F172A' }}>{item.totalQuantity}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => setSelectedSku(item.sku)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Adjust Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Modal */}
      {selectedSku && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Adjust Stock: {selectedSku}</h3>
            <form onSubmit={handleAdjust} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  QUANTITY DELTA (+ to add, - to subtract)
                </label>
                <input
                  type="number"
                  value={adjDelta}
                  onChange={(e) => setAdjDelta(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  AUDIT LOG REASON *
                </label>
                <input
                  type="text"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setSelectedSku(null)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
