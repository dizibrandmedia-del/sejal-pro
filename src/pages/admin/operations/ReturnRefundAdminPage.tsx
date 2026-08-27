import React, { useState, useEffect } from 'react';
import { RotateCcw, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';
import { ReturnRequest } from '../../../types/returns';
import { useToast } from '../../../context/ToastContext';

export const ReturnRefundAdminPage: React.FC = () => {
  const { showToast } = useToast();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [qcPassed, setQcPassed] = useState(true);
  const [disposition, setDisposition] = useState<'Restock' | 'Damaged'>('Restock');
  const [notes, setNotes] = useState('All 18K hallmarks intact; Antwerp security tags untampered.');

  const fetchReturns = async () => {
    try {
      const res = await apiClient.get<ReturnRequest[]>('/returns');
      setReturns(res.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleInspectCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturn) return;

    try {
      await apiClient.post(`/returns/${selectedReturn.id}/quality-check`, {
        passed: qcPassed,
        stockDisposition: disposition,
        notes,
        inspector: 'Senior Gemologist (QC Admin)',
      });

      showToast('QC Completed', `Quality Check recorded. Inventory automatically adjusted to ${disposition}.`, 'success');
      setSelectedReturn(null);
      fetchReturns();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Returns, Atelier Quality Check & Disposition
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            High jewellery physical authentication, tamper tag inspection, and automatic inventory stock restoration.
          </p>
        </div>

        <button
          onClick={fetchReturns}
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
          <span>Refresh Queue</span>
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>Return Ref</th>
              <th style={{ padding: '12px 16px' }}>Order Reference</th>
              <th style={{ padding: '12px 16px' }}>Client Reason</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Refund Value</th>
              <th style={{ padding: '12px 16px' }}>QC Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {returns.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                  No active returns in atelier inspection queue.
                </td>
              </tr>
            ) : (
              returns.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>{r.id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <code style={{ fontSize: '0.75rem', color: '#334155' }}>{r.orderNumber}</code>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{r.items[0]?.reason || 'Inspection Requested'}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>₹{r.totalRefundRequestedINR?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedReturn(r)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      Perform QC
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* QC Modal */}
      {selectedReturn && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '460px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
              Atelier Quality Check & Disposition
            </h3>
            <form onSubmit={handleInspectCommit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  PHYSICAL INSPECTION RESULT *
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                    <input type="radio" checked={qcPassed} onChange={() => setQcPassed(true)} />
                    <span style={{ color: '#16A34A', fontWeight: 600 }}>Pass (Pristine Condition)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                    <input type="radio" checked={!qcPassed} onChange={() => setQcPassed(false)} />
                    <span style={{ color: '#DC2626', fontWeight: 600 }}>Fail (Damaged / Tampered)</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  STOCK DISPOSITION
                </label>
                <select
                  value={disposition}
                  onChange={(e) => setDisposition(e.target.value as any)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                >
                  <option value="Restock">Restock Available Inventory Vault</option>
                  <option value="Damaged">Quarantine into Damaged Hold</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  GEMOLOGIST QC NOTES
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setSelectedReturn(null)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                  Commit QC & Issue Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
