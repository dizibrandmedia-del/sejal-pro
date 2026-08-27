import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, MapPin, Clock, Copy, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';
import { Button } from '../components/ui/Button/Button';
import { NormalizedShipmentStatus } from '../types/shipping';

interface OrderTrackingPageProps {
  orderId?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orderId }) => {
  const pathId = orderId || window.location.pathname.replace('/track/', '');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTracking = async () => {
      setIsLoading(true);
      try {
        const data = await orderService.getOrderTracking(pathId);
        setTrackingData(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load tracking details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracking();
  }, [pathId]);

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timelineSteps: NormalizedShipmentStatus[] = [
    'Pickup Scheduled',
    'Picked Up',
    'In Transit',
    'Out for Delivery',
    'Delivered',
  ];

  const getStepIndex = (status: NormalizedShipmentStatus) => {
    if (status === 'Delivered') return 4;
    if (status === 'Out for Delivery') return 3;
    if (status === 'In Transit' || status === 'At Hub' || status === 'Delayed') return 2;
    if (status === 'Picked Up') return 1;
    return 0;
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FAF6F0', minHeight: '80vh', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '2px solid var(--sejal-border)', borderTopColor: 'var(--sejal-rose-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: 'var(--sejal-text-secondary)', fontSize: '0.875rem' }}>
          Connecting to SEJAL Armoured Vault Logistics...
        </p>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '12px' }}>
          Tracking Information Unavailable
        </h2>
        <p style={{ color: 'var(--sejal-text-secondary)', marginBottom: '24px' }}>
          {error || 'Could not locate courier dispatch records for this reference.'}
        </p>
        <a href="/account?tab=orders">
          <Button size="md">VIEW MY ORDERS</Button>
        </a>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(trackingData.orderStatus);

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '96px' }}>
      <div className="container" style={{ paddingTop: '24px', maxWidth: '960px' }}>
        <Breadcrumb
          items={[
            { label: 'My SEJAL', url: '/account' },
            { label: 'Orders', url: '/account?tab=orders' },
            { label: `Track Order (${trackingData.orderNumber})` },
          ]}
        />

        {/* Tracking Header Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--sejal-border)',
            borderRadius: '2px',
            padding: '32px',
            margin: '24px 0',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--sejal-border-light)', paddingBottom: '20px', marginBottom: '24px', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600, display: 'block' }}>
                ARMOUR-SEALED CONSIGNMENT
              </span>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--sejal-espresso)', margin: '4px 0 0 0' }}>
                {trackingData.orderNumber}
              </h1>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)', display: 'block' }}>
                ESTIMATED ARRIVAL
              </span>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--sejal-espresso)' }}>
                {trackingData.estimatedDeliveryDate}
              </span>
            </div>
          </div>

          {/* Courier & AWB Code Bar */}
          <div
            style={{
              backgroundColor: '#FAF6F0',
              padding: '16px 20px',
              borderRadius: '2px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '36px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={18} color="var(--sejal-rose-gold)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)', display: 'block' }}>LOGISTICS PROVIDER</span>
                <strong style={{ fontSize: '0.875rem', color: 'var(--sejal-espresso)' }}>{trackingData.carrier}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)', display: 'block' }}>MASTER AIR WAYBILL (AWB)</span>
                <code style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--sejal-espresso)' }}>{trackingData.awbNumber}</code>
              </div>
              <button
                onClick={() => handleCopyAwb(trackingData.awbNumber)}
                style={{
                  background: 'none',
                  border: '1px solid var(--sejal-border)',
                  padding: '6px 10px',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--sejal-espresso)',
                }}
              >
                {copied ? <Check size={12} color="var(--sejal-success)" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* 5-Step Normalized Timeline */}
          <div style={{ margin: '36px 0 44px 0' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                position: 'relative',
                alignItems: 'center',
              }}
            >
              {/* Connecting Progress Track */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '10%',
                  right: '10%',
                  height: '2px',
                  backgroundColor: 'var(--sejal-border-light)',
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '10%',
                  width: `${(currentStepIdx / 4) * 80}%`,
                  height: '2px',
                  backgroundColor: 'var(--sejal-rose-gold)',
                  zIndex: 2,
                  transition: 'width 0.5s ease',
                }}
              />

              {timelineSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 3,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent
                          ? '#1A1215'
                          : isPassed
                          ? 'var(--sejal-rose-gold)'
                          : '#FFFFFF',
                        border: `2px solid ${isPassed ? 'var(--sejal-rose-gold)' : 'var(--sejal-border)'}`,
                        color: isPassed ? '#FFFFFF' : 'var(--sejal-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        boxShadow: isCurrent ? '0 0 0 4px #FAF0F2' : 'none',
                        marginBottom: '10px',
                      }}
                    >
                      {isPassed ? <Check size={14} /> : idx + 1}
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: isCurrent ? 700 : isPassed ? 600 : 400,
                        color: isCurrent ? 'var(--sejal-espresso)' : isPassed ? 'var(--sejal-espresso)' : 'var(--sejal-text-muted)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Last Known Hub Location Banner */}
          <div
            style={{
              backgroundColor: '#FAF0F2',
              border: '1px solid var(--sejal-rose-gold)',
              borderRadius: '2px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <MapPin size={20} color="var(--sejal-rose-gold)" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
                LAST KNOWN LOGISTICS FACILITY
              </span>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--sejal-espresso)' }}>
                {trackingData.lastKnownLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Event Log List */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--sejal-border)',
            borderRadius: '2px',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', marginBottom: '20px', color: 'var(--sejal-espresso)' }}>
            Consignment Journey & Milestones
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {trackingData.events.map((evt: any) => (
              <div
                key={evt.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  gap: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--sejal-border-light)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.785rem', color: 'var(--sejal-text-muted)', display: 'block' }}>
                    {new Date(evt.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sejal-espresso)' }}>
                    {new Date(evt.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--sejal-espresso)', fontSize: '0.9rem' }}>
                      {evt.normalizedStatus}
                    </span>
                    {evt.hubLocation && (
                      <span style={{ backgroundColor: '#FAF6F0', color: 'var(--sejal-text-secondary)', padding: '2px 8px', borderRadius: '2px', fontSize: '0.7rem' }}>
                        📍 {evt.hubLocation}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.5 }}>
                    {evt.carrierMessage || 'Consignment milestone authenticated.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
