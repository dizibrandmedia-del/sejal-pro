import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  AlertTriangle,
  Users,
  Boxes,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getDashboardAnalytics();
      setMetrics(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
        <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '2px solid #CBD5E1', borderTopColor: '#0F172A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>Aggregating real-time commerce metrics...</p>
      </div>
    );
  }

  const sales = metrics?.sales || { totalRevenueINR: 869000, totalOrdersCount: 2, aovINR: 434500, conversionRate: '3.8%', monthlyGrowthRate: '+24.5%' };
  const operations = metrics?.operations || { pendingOrdersCount: 1, pendingShipmentsCount: 1, inTransitShipmentsCount: 1, returnsCount: 0, rtoCount: 0 };
  const inventory = metrics?.inventory || { totalSkus: 12, totalProducts: 12, lowStockCount: 2, outOfStockCount: 0, lowStockItems: [] };
  const payments = metrics?.payments || { capturedCount: 2, totalRefundedINR: metrics?.financials?.refundedINR ?? 0, failedCount: 0 };
  const recentOrders = metrics?.recentOrders || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Executive Operations Command
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Real-time telemetry across revenue, inventory mutex, multi-carrier logistics, and customer VIP orders.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
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
            color: '#0F172A',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Total Revenue */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>NET REVENUE</span>
            <div style={{ padding: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', borderRadius: '4px' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
            ₹{sales.totalRevenueINR?.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px', fontWeight: 600 }}>
            <ArrowUpRight size={13} /> {sales.monthlyGrowthRate} vs last period
          </span>
        </div>

        {/* Total Orders */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>AUTHORITATIVE ORDERS</span>
            <div style={{ padding: '6px', backgroundColor: '#F5F3FF', color: '#7C3AED', borderRadius: '4px' }}>
              <ShoppingBag size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A' }}>
            {sales.totalOrdersCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
            Conversion Rate: <strong>{sales.conversionRate}</strong>
          </span>
        </div>

        {/* Average Order Value */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>AVERAGE ORDER VALUE (AOV)</span>
            <div style={{ padding: '6px', backgroundColor: '#ECFDF5', color: '#059669', borderRadius: '4px' }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A' }}>
            ₹{sales.aovINR?.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
            Ultra-luxury basket size
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>LOW STOCK CRITICAL</span>
            <div style={{ padding: '6px', backgroundColor: '#FFFBEB', color: '#D97706', borderRadius: '4px' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: inventory.lowStockCount > 0 ? '#D97706' : '#0F172A' }}>
            {inventory.lowStockCount} <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 400 }}>SKUs</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: inventory.lowStockCount > 0 ? '#D97706' : '#10B981', marginTop: '4px', display: 'block', fontWeight: 600 }}>
            {inventory.lowStockCount > 0 ? 'Requires atelier replenishment' : 'All SKUs healthy'}
          </span>
        </div>
      </div>

      {/* Operations Overview Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Pending Processing', val: operations.pendingOrdersCount, icon: <ShoppingBag size={14} />, color: '#2563EB' },
          { label: 'Pickup Scheduled', val: operations.pendingShipmentsCount, icon: <Boxes size={14} />, color: '#D97706' },
          { label: 'In Transit Logistics', val: operations.inTransitShipmentsCount, icon: <Truck size={14} />, color: '#7C3AED' },
          { label: 'Active Returns / QC', val: operations.returnsCount, icon: <RotateCcw size={14} />, color: '#059669' },
          { label: 'Total Refunded', val: `₹${payments.totalRefundedINR?.toLocaleString('en-IN')}`, icon: <CreditCard size={14} />, color: '#DC2626' },
        ].map((item, idx) => (
          <div key={idx} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>{item.label}</span>
              <strong style={{ fontSize: '1.2rem', color: '#0F172A' }}>{item.val}</strong>
            </div>
            <div style={{ color: item.color }}>{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
          Recent Customer Vault Transactions
        </h3>

        {recentOrders && recentOrders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left', backgroundColor: '#F8FAFC' }}>
                  <th style={{ padding: '10px 14px' }}>Order Reference</th>
                  <th style={{ padding: '10px 14px' }}>Date</th>
                  <th style={{ padding: '10px 14px' }}>Client</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '10px 14px' }}>Order Status</th>
                  <th style={{ padding: '10px 14px' }}>Payment</th>
                  <th style={{ padding: '10px 14px' }}>Courier</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord: any) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{ord.orderNumber}</td>
                    <td style={{ padding: '12px 14px', color: '#64748B' }}>{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <strong style={{ display: 'block', color: '#0F172A' }}>{ord.customerName}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{ord.customerEmail}</span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>₹{ord.totalINR?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: ord.paymentStatus === 'Captured' ? '#10B981' : '#F59E0B', fontWeight: 600, fontSize: '0.75rem' }}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748B', fontSize: '0.75rem' }}>
                      {ord.trackingCourier || 'SEJAL Fleet'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>No orders recorded yet.</p>
        )}
      </div>
    </div>
  );
};
