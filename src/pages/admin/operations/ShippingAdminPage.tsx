import React, { useState, useEffect } from 'react';
import { Truck, RefreshCw, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';
import { Shipment } from '../../../types/shipping';

export const ShippingAdminPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<Shipment[]>('/shipping/manifests');
      setShipments(res.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Multi-Carrier Logistics & Armoured Fleet Manifests
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Unified carrier abstraction across SEJAL Armoured, Shiprocket, Delhivery, DHL Express, and FedEx Priority.
          </p>
        </div>

        <button
          onClick={fetchShipments}
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
          <span>Refresh Manifests</span>
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>Tracking AWB</th>
              <th style={{ padding: '12px 16px' }}>Order Reference</th>
              <th style={{ padding: '12px 16px' }}>Carrier Partner</th>
              <th style={{ padding: '12px 16px' }}>Destination</th>
              <th style={{ padding: '12px 16px' }}>Current Telemetry</th>
              <th style={{ padding: '12px 16px' }}>Security Protocol</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px' }}>
                  <code style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>{s.awbNumber}</code>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <code style={{ color: '#64748B', fontSize: '0.75rem' }}>{s.orderNumber}</code>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#334155' }}>
                  {s.providerName}
                </td>
                <td style={{ padding: '12px 16px', color: '#64748B' }}>
                  {s.lastKnownLocation || 'Bandra Logistics Facility, Mumbai'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                    {s.currentStatus}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} /> {s.serviceType === 'standard_white_glove' ? 'TAMPER-SEALED ARMOURED' : 'PRIORITY AIR INSURED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
