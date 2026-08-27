import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Globe, ShoppingBag, Users, Calendar, Download } from 'lucide-react';
import { crmService } from '../../../services/crmService';
import { AdvancedAnalyticsDashboardData } from '../../../types/analytics';
import { useToast } from '../../../context/ToastContext';

export const AdvancedAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AdvancedAnalyticsDashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'geography' | 'channels' | 'products' | 'cohorts'>('overview');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await crmService.getAdvancedAnalytics();
      setData(res);
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Advanced Telemetry...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#0F172A', letterSpacing: '0.05em', margin: 0 }}>
            ADVANCED COMMERCE & ATTRIBUTION ANALYTICS
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Authoritative revenue telemetry, multi-channel UTM attribution, and customer retention cohorts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '6px', gap: '4px' }}>
          {(['overview', 'geography', 'channels', 'products', 'cohorts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#FFFFFF' : 'transparent',
                color: activeTab === tab ? '#0F172A' : '#64748B',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>GROSS COMMERCE REVENUE</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginTop: '6px' }}>
                ₹{data.overview.grossRevenueINR.toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                Net: ₹{data.overview.netRevenueINR.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>AVERAGE ORDER VALUE (AOV)</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginTop: '6px' }}>
                ₹{data.overview.averageOrderValueINR.toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                {data.overview.totalOrders} Authoritative Orders
              </span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>OVERALL CONVERSION RATE</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginTop: '6px' }}>
                {data.overview.overallConversionRate}%
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                {data.overview.totalSessions.toLocaleString()} Verified Sessions
              </span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>PRIVÉ VIP ENGAGEMENT</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#BE185D', marginTop: '6px' }}>
                {data.overview.repeatCustomerRate}% Repeat Rate
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                {data.overview.totalPriveClients} Diamond / Gold Privé Clients
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Geography Breakdown */}
      {activeTab === 'geography' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
            International Territory Revenue Breakdown
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 14px' }}>Territory</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Orders</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Revenue (INR)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Territory AOV</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Global Share</th>
                </tr>
              </thead>
              <tbody>
                {data.geography.map((g, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{g.country}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>{g.ordersCount}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>₹{g.revenueINR.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748B' }}>₹{g.aovINR.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>{g.sharePercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Channels & Attribution */}
      {activeTab === 'channels' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
            Multi-Channel & UTM Attribution Performance
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 14px' }}>Channel / Medium</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Sessions</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Orders</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Revenue</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Conversion</th>
                </tr>
              </thead>
              <tbody>
                {data.channels.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{c.channel}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: '#64748B' }}>{c.sessions.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600 }}>{c.orders}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>₹{c.revenueINR.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#059669', fontWeight: 700 }}>{c.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Top Products */}
      {activeTab === 'products' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
            Product Performance & Conversion Funnel
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '8px 12px' }}>Creation</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Views</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Wishlist</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Add to Bag</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Purchased</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Revenue</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Conversion</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p) => (
                  <tr key={p.productId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <strong style={{ color: '#0F172A' }}>{p.productName}</strong>
                      <code style={{ display: 'block', fontSize: '0.65rem', color: '#64748B' }}>{p.sku} • {p.category}</code>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{p.viewsCount}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{p.wishlistCount}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{p.addToBagCount}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{p.purchasesCount}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>₹{p.grossRevenueINR.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#059669', fontWeight: 700 }}>{p.conversionRatePercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Customer Retention Cohorts */}
      {activeTab === 'cohorts' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
            Customer Retention & Lifetime Value (LTV) Cohorts
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '10px 14px' }}>Cohort Month</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>New Clients</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Month 1 Retention</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Month 2 Retention</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Month 3 Retention</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Average LTV</th>
                </tr>
              </thead>
              <tbody>
                {data.cohorts.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>{c.cohortMonth}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>{c.newCustomersCount}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', backgroundColor: '#ECFDF5', color: '#065F46', fontWeight: 600 }}>{c.month1Retention}%</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', backgroundColor: '#F0FDF4', color: '#15803D', fontWeight: 600 }}>{c.month2Retention}%</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', backgroundColor: '#F8FAFC', color: '#334155' }}>{c.month3Retention}%</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>₹{c.averageLTV_INR.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
