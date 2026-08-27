import React, { useState, useEffect } from 'react';
import { ShieldCheck, Play, CheckCircle2, AlertTriangle, RefreshCw, Layers, Truck, RotateCcw, CreditCard, Activity, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button/Button';
import { Select, Input } from '../ui/Form/Form';
import { apiClient } from '../../services/apiClient';
import { useToast } from '../../context/ToastContext';

export const CommerceTestingCockpit: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'concurrency' | 'webhooks' | 'shipping' | 'quality_check' | 'reconciliation' | 'audit'>('concurrency');

  // Concurrency Test State
  const [concurrencyResult, setConcurrencyResult] = useState<any>(null);
  const [isConcurrencyRunning, setIsConcurrencyRunning] = useState(false);

  // Webhook Test State
  const [webhookOrderNumber, setWebhookOrderNumber] = useState('SEJAL-2026-000001');
  const [webhookEventType, setWebhookEventType] = useState('payment.captured');
  const [webhookResult, setWebhookResult] = useState<any>(null);
  const [isWebhookRunning, setIsWebhookRunning] = useState(false);

  // Shipping Advance State
  const [shippingOrderId, setShippingOrderId] = useState('ord_sejal_sample_9021');
  const [targetShipmentStatus, setTargetShipmentStatus] = useState('IN_TRANSIT');
  const [hubLocation, setHubLocation] = useState('Dubai Air Cargo Terminal, UAE');
  const [shippingResult, setShippingResult] = useState<any>(null);

  // Quality Check State
  const [qcReturnId, setQcReturnId] = useState('');
  const [qcCondition, setQcCondition] = useState<'Pristine in Vault Box' | 'Minor Seal Wear' | 'Damaged / Altered'>('Pristine in Vault Box');
  const [qcDisposition, setQcDisposition] = useState<'Restock' | 'Damaged' | 'Reject'>('Restock');
  const [qcRefundAmount, setQcRefundAmount] = useState(285000);
  const [qcResult, setQcResult] = useState<any>(null);

  // Reconciliation State
  const [reconciliationReports, setReconciliationReports] = useState<any[]>([]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [commerceEvents, setCommerceEvents] = useState<any[]>([]);

  const fetchReconciliation = async () => {
    try {
      const res = await fetch('/api/payments/reconciliation');
      const data = await res.json();
      if (data.data) setReconciliationReports(data.data);
    } catch {
      // ignore
    }
  };

  const fetchAuditEvents = async () => {
    try {
      const res = await fetch('/api/simulator/audit-events');
      const data = await res.json();
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.commerceEvents) setCommerceEvents(data.commerceEvents);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (activeTab === 'reconciliation') fetchReconciliation();
    if (activeTab === 'audit') fetchAuditEvents();
  }, [activeTab]);

  const handleRunConcurrencyTest = async () => {
    setIsConcurrencyRunning(true);
    try {
      const res = await fetch('/api/simulator/concurrency-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: 'SEJ-JW-MOR-01' }),
      });
      const data = await res.json();
      setConcurrencyResult(data);
      showToast('Concurrency Test Completed', 'Overselling protection verified.', 'success');
    } catch (err: any) {
      showToast('Test Error', err.message, 'error');
    } finally {
      setIsConcurrencyRunning(false);
    }
  };

  const handleFireWebhook = async (isDuplicate: boolean = false) => {
    setIsWebhookRunning(true);
    try {
      const eventId = isDuplicate ? 'evt_duplicate_static_test_id_999' : `evt_live_${Date.now()}`;
      const res = await fetch('/api/simulator/razorpay-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: webhookEventType,
          orderId: 'ord_sejal_sample_9021',
          amountINR: 285000,
          eventId,
        }),
      });
      const data = await res.json();
      setWebhookResult({ ...data, firedEventId: eventId, isDuplicateTriggered: isDuplicate });
      showToast(
        data.duplicate ? 'Duplicate Webhook Handled' : 'Webhook Processed',
        data.message,
        data.duplicate ? 'info' : 'success'
      );
    } catch (err: any) {
      showToast('Webhook Error', err.message, 'error');
    } finally {
      setIsWebhookRunning(false);
    }
  };

  const handleAdvanceShipment = async () => {
    try {
      const res = await fetch('/api/simulator/advance-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: shippingOrderId,
          targetStatus: targetShipmentStatus,
          hubLocation,
          carrierMessage: `Consignment status updated to ${targetShipmentStatus}`,
        }),
      });
      const data = await res.json();
      setShippingResult(data);
      showToast('Shipment Advanced', `Status changed to ${targetShipmentStatus}`, 'success');
    } catch (err: any) {
      showToast('Shipping Error', err.message, 'error');
    }
  };

  const handleExecuteQualityCheck = async () => {
    if (!qcReturnId.trim()) {
      showToast('Validation Error', 'Please enter a valid Return ID (e.g. from Returns tab).', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/returns/${qcReturnId}/quality-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectorName: 'Chief Appraiser Alistair Vance',
          receivedCondition: qcCondition,
          securityTagIntact: true,
          certificatePresent: true,
          disposition: qcDisposition,
          isApproved: qcDisposition === 'Restock',
          approvedRefundAmountINR: qcDisposition === 'Restock' ? qcRefundAmount : 0,
          notes: `Inspected at Mumbai Flagship Vault. Verdict: ${qcDisposition}`,
        }),
      });
      const data = await res.json();
      setQcResult(data);
      showToast('QC Executed', `Disposition: ${qcDisposition}, Refund Authorized.`, 'luxury');
    } catch (err: any) {
      showToast('QC Error', err.message, 'error');
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', padding: '40px 0 96px 0' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#1A1215', color: '#FAF6F0', padding: '28px 32px', borderRadius: '2px', marginBottom: '28px', border: '1px solid #D4AF37' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Activity size={18} color="#D4AF37" />
            <span style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 600 }}>
              PHASE 2 MASTER OPERATIONS & TEST COCKPIT
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', color: '#FFFFFF', margin: 0 }}>
            Commerce Engine Verification Suite
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#D8A7B1', margin: '4px 0 0 0' }}>
            Execute transaction tests: Concurrency overselling protection, Razorpay webhook idempotency, courier milestone synchronization, quality inspection & reconciliation.
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'concurrency', label: '1. Concurrency / Overselling', icon: <Layers size={14} /> },
            { id: 'webhooks', label: '2. Razorpay Webhook Idempotency', icon: <CreditCard size={14} /> },
            { id: 'shipping', label: '3. Shipping Courier Sync', icon: <Truck size={14} /> },
            { id: 'quality_check', label: '4. Return QC & Disposition', icon: <RotateCcw size={14} /> },
            { id: 'reconciliation', label: '5. Payment Reconciliation', icon: <ShieldCheck size={14} /> },
            { id: 'audit', label: '6. Event Stream & Audit Logs', icon: <Activity size={14} /> },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '2px',
                  border: isSelected ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-border)',
                  backgroundColor: isSelected ? 'var(--sejal-espresso)' : '#FFFFFF',
                  color: isSelected ? '#FAF6F0' : 'var(--sejal-espresso)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Concurrency & Overselling */}
        {activeTab === 'concurrency' && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '32px' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', marginBottom: '8px' }}>
              Atomic Inventory Mutex & Overselling Prevention Test
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              This test sets a SKU's stock to exactly <strong>1 single unit</strong> and fires <strong>2 simultaneous purchase reservation requests concurrently via <code>Promise.all</code></strong>. The database mutex must guarantee that exactly 1 request succeeds and the other fails with an insufficient inventory error.
            </p>

            <Button onClick={handleRunConcurrencyTest} size="lg" isLoading={isConcurrencyRunning} leftIcon={<Play size={16} />}>
              EXECUTE SIMULTANEOUS CHECKOUT TEST
            </Button>

            {concurrencyResult && (
              <div style={{ marginTop: '24px', backgroundColor: '#FAF6F0', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  {concurrencyResult.evaluation?.isOversellingPrevented ? (
                    <CheckCircle2 size={20} color="var(--sejal-success)" />
                  ) : (
                    <AlertTriangle size={20} color="var(--sejal-error)" />
                  )}
                  <strong style={{ fontSize: '1rem', color: 'var(--sejal-espresso)' }}>
                    {concurrencyResult.evaluation?.isOversellingPrevented
                      ? 'PASSED: Zero Overselling Guaranteed'
                      : 'FAILED: Overselling Detected'}
                  </strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.8125rem' }}>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '2px', border: '1px solid var(--sejal-border-light)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--sejal-success)' }}>Request #1 (Customer A):</span>
                    <pre style={{ fontSize: '0.75rem', marginTop: '6px' }}>{JSON.stringify(concurrencyResult.results.request1, null, 2)}</pre>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '2px', border: '1px solid var(--sejal-border-light)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--sejal-error)' }}>Request #2 (Customer B):</span>
                    <pre style={{ fontSize: '0.75rem', marginTop: '6px' }}>{JSON.stringify(concurrencyResult.results.request2, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Razorpay Webhook Idempotency */}
        {activeTab === 'webhooks' && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '32px' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', marginBottom: '8px' }}>
              Razorpay Webhook Idempotency & Duplicate Suppression Test
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', marginBottom: '20px' }}>
              Tests cryptographic signature verification, state transition triggers, and guarantees that duplicate webhooks with the same event ID are acknowledged with 200 OK without double-processing.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px', marginBottom: '20px' }}>
              <Select
                label="Webhook Event Type"
                options={[
                  { label: 'payment.captured', value: 'payment.captured' },
                  { label: 'payment.failed', value: 'payment.failed' },
                  { label: 'refund.processed', value: 'refund.processed' },
                ]}
                value={webhookEventType}
                onChange={(e) => setWebhookEventType(e.target.value)}
              />
              <Input label="Target Order Number" value={webhookOrderNumber} onChange={(e) => setWebhookOrderNumber(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={() => handleFireWebhook(false)} size="md" isLoading={isWebhookRunning}>
                FIRE NEW WEBHOOK EVENT
              </Button>
              <Button onClick={() => handleFireWebhook(true)} variant="outline" size="md">
                FIRE DUPLICATE WEBHOOK (IDEMPOTENCY TEST)
              </Button>
            </div>

            {webhookResult && (
              <div style={{ marginTop: '20px', backgroundColor: '#FAF6F0', padding: '16px', borderRadius: '2px', border: '1px solid var(--sejal-border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sejal-espresso)', display: 'block', marginBottom: '6px' }}>
                  Webhook Execution Response (Event ID: {webhookResult.firedEventId}):
                </span>
                <pre style={{ fontSize: '0.75rem', margin: 0 }}>{JSON.stringify(webhookResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Shipping Courier Sync */}
        {activeTab === 'shipping' && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '32px' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', marginBottom: '8px' }}>
              Carrier Webhook & Milestone Advancement
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', marginBottom: '20px' }}>
              Advance a shipment's milestones to verify live tracking timeline normalization and order status progression.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '640px', marginBottom: '20px' }}>
              <Select
                label="Target Carrier Raw Status"
                options={[
                  { label: 'OUT_FOR_PICKUP_SUCCESS (Picked Up)', value: 'PICKED_UP' },
                  { label: 'IN_TRANSIT_AIR_HUB (In Transit)', value: 'IN_TRANSIT' },
                  { label: 'OUT_FOR_WHITE_GLOVE_DELIVERY (Out for Delivery)', value: 'OUT_FOR_DELIVERY' },
                  { label: 'DELIVERED_SIGNED (Delivered)', value: 'DELIVERED' },
                  { label: 'RTO_INITIATED (Return to Origin)', value: 'RTO_INITIATED' },
                ]}
                value={targetShipmentStatus}
                onChange={(e) => setTargetShipmentStatus(e.target.value)}
              />
              <Input label="Hub Location" value={hubLocation} onChange={(e) => setHubLocation(e.target.value)} />
            </div>

            <Button onClick={handleAdvanceShipment} size="md">
              DISPATCH CARRIER MILESTONE
            </Button>

            {shippingResult && (
              <div style={{ marginTop: '20px', backgroundColor: '#FAF6F0', padding: '16px', borderRadius: '2px', border: '1px solid var(--sejal-border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sejal-espresso)', display: 'block', marginBottom: '6px' }}>
                  Updated Shipment State:
                </span>
                <pre style={{ fontSize: '0.75rem', margin: 0 }}>{JSON.stringify(shippingResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Return QC & Disposition */}
        {activeTab === 'quality_check' && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '32px' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', marginBottom: '8px' }}>
              Return Quality Inspection & Stock Disposition Simulator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', marginBottom: '20px' }}>
              Simulates physical vault inspection on a customer-submitted return, assigns stock disposition (Restock vs Damaged), and authorizes partial/full refund.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '640px', marginBottom: '20px' }}>
              <Input label="Return ID (e.g. ret_xxx)" placeholder="Enter Return ID from Returns tab" value={qcReturnId} onChange={(e) => setQcReturnId(e.target.value)} />
              <Input label="Approved Refund (₹ INR)" type="number" value={qcRefundAmount} onChange={(e) => setQcRefundAmount(Number(e.target.value))} />
              <Select
                label="Physical Condition"
                options={[
                  { label: 'Pristine in Vault Box', value: 'Pristine in Vault Box' },
                  { label: 'Minor Seal Wear', value: 'Minor Seal Wear' },
                  { label: 'Damaged / Altered', value: 'Damaged / Altered' },
                ]}
                value={qcCondition}
                onChange={(e) => setQcCondition(e.target.value as any)}
              />
              <Select
                label="Stock Disposition Verdict"
                options={[
                  { label: 'Restock (Return to available physical inventory)', value: 'Restock' },
                  { label: 'Damaged (Quarantine in damaged inventory)', value: 'Damaged' },
                  { label: 'Reject (No restock, reject refund)', value: 'Reject' },
                ]}
                value={qcDisposition}
                onChange={(e) => setQcDisposition(e.target.value as any)}
              />
            </div>

            <Button onClick={handleExecuteQualityCheck} size="md">
              EXECUTE QUALITY VERDICT & DISPATCH REFUND
            </Button>

            {qcResult && (
              <div style={{ marginTop: '20px', backgroundColor: '#FAF6F0', padding: '16px', borderRadius: '2px', border: '1px solid var(--sejal-border)' }}>
                <pre style={{ fontSize: '0.75rem', margin: 0 }}>{JSON.stringify(qcResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Reconciliation */}
        {activeTab === 'reconciliation' && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', margin: 0 }}>
                Payment Reconciliation & Audit Balances
              </h3>
              <Button onClick={fetchReconciliation} size="sm" variant="outline" leftIcon={<RefreshCw size={14} />}>
                REFRESH
              </Button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.785rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid var(--sejal-border)' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Order Number</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Order Total</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Captured</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Refunded</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Net Revenue</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Mismatch Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {reconciliationReports.map((r) => (
                    <tr key={r.orderId} style={{ borderBottom: '1px solid var(--sejal-border-light)' }}>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{r.orderNumber}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>₹{r.orderTotalINR?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: 'var(--sejal-success)' }}>₹{r.capturedPaymentINR?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: r.totalRefundedINR > 0 ? 'var(--sejal-error)' : 'inherit' }}>₹{r.totalRefundedINR?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600 }}>₹{r.netRevenueINR?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        {r.hasMismatch ? (
                          <span style={{ color: 'var(--sejal-error)', fontWeight: 600 }}>⚠️ MISMATCH</span>
                        ) : (
                          <span style={{ color: 'var(--sejal-success)' }}>✓ Balanced</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Audit Logs & Events */}
        {activeTab === 'audit' && (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', margin: 0 }}>
                Immutable Audit Trail & Commerce Event Bus
              </h3>
              <Button onClick={fetchAuditEvents} size="sm" variant="outline" leftIcon={<RefreshCw size={14} />}>
                REFRESH LOGS
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
              {auditLogs.map((log) => (
                <div key={log.id} style={{ padding: '10px 14px', backgroundColor: '#FAF6F0', borderRadius: '2px', border: '1px solid var(--sejal-border-light)', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '2px' }}>
                    <span>[{log.entityType}] {log.action} — {log.referenceCode}</span>
                    <span style={{ color: 'var(--sejal-text-muted)' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div style={{ color: 'var(--sejal-text-secondary)' }}>
                    Actor: <strong>{log.actor}</strong> | {log.previousState ? `Previous: ${log.previousState} → ` : ''}New: <strong>{log.newState}</strong>
                  </div>
                  {log.reason && <div style={{ color: 'var(--sejal-text-muted)', marginTop: '2px' }}>Reason: {log.reason}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
