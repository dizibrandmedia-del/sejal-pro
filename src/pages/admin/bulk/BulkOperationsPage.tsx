import React, { useState } from 'react';
import { UploadCloud, Download, CheckCircle2, AlertTriangle, FileText, Sliders } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { BulkValidationResult } from '../../../types/admin';
import { useToast } from '../../../context/ToastContext';

export const BulkOperationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [csvText, setCsvText] = useState(
    `sku,name,basePriceINR,category,stock\nSEJ-JW-DIA-009,The Celestial Emerald Ring,750000,high-jewellery,2\nSEJ-JW-DIA-010,The Luminary Rose Collar,1250000,high-jewellery,1`
  );
  const [validationResult, setValidationResult] = useState<BulkValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Bulk Edit State
  const [batchMultiplier, setBatchMultiplier] = useState(1.05); // +5%
  const [batchAvailability, setBatchAvailability] = useState('in-stock');

  const handleValidate = async () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        showToast('Error', 'CSV must contain a header and at least one data row.', 'error');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const rowObj: any = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx];
        });
        return rowObj;
      });

      const res = await adminService.validateCSV(rows);
      setValidationResult(res);
      showToast('Validation Complete', `Verified ${res.totalRows} rows (${res.validRows} valid, ${res.invalidRows} errors)`, res.canImport ? 'success' : 'info');
    } catch (err: any) {
      showToast('Validation Error', err.message, 'error');
    }
  };

  const handleCommit = async () => {
    if (!validationResult || !validationResult.canImport) return;
    setIsProcessing(true);
    try {
      const validRows = validationResult.previewData.filter((p) => p.status === 'Valid');
      const res = await adminService.applyCSV(validRows, 'Product Manager (Bulk Ingest)');
      showToast('Import Ingested', `Successfully imported ${res.importedCount} new creations and updated ${res.updatedCount} existing records.`, 'success');
      setValidationResult(null);
    } catch (err: any) {
      showToast('Import Error', err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Safe Bulk Operations & CSV Ingestion Engine
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
          Multi-phase validation pipeline preventing catalogue corruption, comprehensive streaming exporters, and batch updates.
        </p>
      </div>

      {/* Exporters Row */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={16} /> Export Master Vault Datasets (CSV)
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {[
            { label: 'Products Master', endpoint: 'products' },
            { label: 'Orders Ledger', endpoint: 'orders' },
            { label: 'Inventory Vault', endpoint: 'inventory' },
            { label: 'Payments Ledger', endpoint: 'payments' },
          ].map((exp) => (
            <a key={exp.endpoint} href={`/api/bulk/export/${exp.endpoint}`} download>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                <Download size={13} /> {exp.label}
              </button>
            </a>
          ))}
        </div>
      </div>

      {/* Two-Phase CSV Import Pipeline */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UploadCloud size={16} color="#2563EB" /> Two-Phase Safe CSV Import Pipeline
        </h2>
        <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '14px' }}>
          Phase 1 validates formatting, prices, SKU uniqueness, and mandatory columns before committing any database state changes.
        </p>

        <textarea
          rows={6}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Paste CSV rows here..."
          style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.8rem', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#F8FAFC' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={handleValidate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Step 1: Validate CSV
          </button>

          <button
            onClick={handleCommit}
            disabled={!validationResult?.canImport || isProcessing}
            style={{
              padding: '8px 18px',
              backgroundColor: validationResult?.canImport ? '#0F172A' : '#94A3B8',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: validationResult?.canImport ? 'pointer' : 'not-allowed',
            }}
          >
            {isProcessing ? 'Ingesting...' : 'Step 2: Confirm & Commit Import'}
          </button>
        </div>

        {/* Validation Results Preview */}
        {validationResult && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>
                ✓ {validationResult.validRows} Valid Rows
              </span>
              {validationResult.invalidRows > 0 && (
                <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>
                  ✕ {validationResult.invalidRows} Row Errors
                </span>
              )}
            </div>

            {validationResult.errors.length > 0 && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Validation Errors Found:</span>
                {validationResult.errors.map((err, idx) => (
                  <div key={idx} style={{ fontSize: '0.7rem', color: '#B91C1C' }}>
                    • Row {err.rowNumber} [{err.field}]: {err.message}
                  </div>
                ))}
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left', color: '#64748B' }}>
                    <th style={{ padding: '8px 10px' }}>Row</th>
                    <th style={{ padding: '8px 10px' }}>SKU</th>
                    <th style={{ padding: '8px 10px' }}>Name</th>
                    <th style={{ padding: '8px 10px' }}>Price</th>
                    <th style={{ padding: '8px 10px' }}>Stock</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResult.previewData.map((row) => (
                    <tr key={row.rowNumber} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '8px 10px' }}>#{row.rowNumber}</td>
                      <td style={{ padding: '8px 10px' }}><code>{row.sku}</code></td>
                      <td style={{ padding: '8px 10px' }}>{row.name}</td>
                      <td style={{ padding: '8px 10px' }}>₹{row.basePriceINR?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px 10px' }}>{row.stock}</td>
                      <td style={{ padding: '8px 10px', color: row.status === 'Valid' ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
