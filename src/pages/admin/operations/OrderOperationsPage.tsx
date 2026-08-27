import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw, ChevronRight, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';
import { Order } from '../../../types/order';
import { useToast } from '../../../context/ToastContext';

export const OrderOperationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<Order[]>('/orders');
      setOrders(res.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTransition = async (newStatus: any) => {
    if (!selectedOrder) return;
    try {
      const res = await apiClient.post<Order>(`/orders/${selectedOrder.id}/transition`, {
        targetStatus: newStatus,
        actor: 'Order Operations Manager',
      });
      setSelectedOrder(res.data);
      showToast('State Transitioned', `Order transitioned to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err: any) {
      showToast('Transition Error', err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Authoritative Order Operations
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Enforce PRD state transitions, verify payment signatures, and manage shipment fulfillment.
          </p>
        </div>

        <button
          onClick={fetchOrders}
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
          <span>Refresh Orders</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Order List Table */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Order Reference</th>
                <th style={{ padding: '12px 16px' }}>Client</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr
                  key={ord.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    backgroundColor: selectedOrder?.id === ord.id ? '#F8FAFC' : '#FFFFFF',
                  }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>{ord.orderNumber}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ color: '#0F172A', display: 'block' }}>{ord.customerName}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{ord.customerEmail}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>₹{ord.totalINR?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedOrder(ord)}
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
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inspect Single Order Details Panel */}
        {selectedOrder && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Order: {selectedOrder.orderNumber}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: 'none', color: '#64748B', cursor: 'pointer', fontWeight: 700 }}>
                ✕
              </button>
            </div>

            {/* Status Transition Actions */}
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                PERMITTED PRD STATE TRANSITIONS
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Confirmed', 'Processing', 'Quality Check', 'Manifested', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleTransition(st)}
                    disabled={selectedOrder.orderStatus === st}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: selectedOrder.orderStatus === st ? '#F1F5F9' : '#FFFFFF',
                      color: selectedOrder.orderStatus === st ? '#94A3B8' : '#0F172A',
                      border: '1px solid #CBD5E1',
                      borderRadius: '3px',
                      cursor: selectedOrder.orderStatus === st ? 'not-allowed' : 'pointer',
                    }}
                  >
                    → {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Items */}
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                ORDER CREATIONS ({selectedOrder.items.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '4px' }}>
                    <div>
                      <strong style={{ fontSize: '0.8rem', color: '#0F172A' }}>{item.productName}</strong>
                      <code style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>SKU: {item.sku} (Qty: {item.quantity})</code>
                    </div>
                    <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>₹{item.totalINR?.toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Courier Metadata */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', fontSize: '0.75rem', color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
              </div>
              <div>
                <strong>Courier Carrier:</strong> {selectedOrder.trackingCourier || 'SEJAL Armoured'}
              </div>
              <div>
                <strong>AWB / Tracking:</strong> {selectedOrder.trackingNumber || 'AWB Pending'}
              </div>
              <div>
                <strong>Packaging:</strong> {selectedOrder.giftPackaging?.boxType || 'Signature Rose Gold'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
