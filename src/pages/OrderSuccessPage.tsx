import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Truck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Button } from '../components/ui/Button/Button';
import { Price } from '../components/ui/Price/Price';
import { Order } from '../types/order';

interface OrderSuccessPageProps {
  orderId?: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId }) => {
  const pathId = orderId || window.location.pathname.replace('/order-success/', '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Luxury Rose Gold & Champagne Confetti Celebration
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B76E79', '#D4AF37', '#F7DDE0', '#F5E6D3'],
    });

    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const data = await orderService.getOrderById(pathId);
        if (data) {
          setOrder(data);
        } else {
          const all = await orderService.getOrders();
          if (all.length > 0) setOrder(all[0]);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [pathId]);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FAF6F0', minHeight: '80vh', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '2px solid var(--sejal-border)', borderTopColor: 'var(--sejal-rose-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: 'var(--sejal-text-secondary)' }}>Authenticating selection in Maison vault...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <a href="/">Return to Home</a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', padding: '64px 0 96px 0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Success Card */}
        <div
          className="animate-fade-in"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--sejal-border)',
            borderRadius: '2px',
            padding: '48px 40px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center',
          }}
        >
          {/* Crowned Check Icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FAF0F2',
              border: '2px solid var(--sejal-rose-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: 'var(--sejal-rose-gold)',
            }}
          >
            <Sparkles size={28} />
          </div>

          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.6875rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--sejal-rose-gold)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '6px',
            }}
          >
            SELECTION CONFIRMED & INVENTORY RESERVED
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              color: 'var(--sejal-espresso)',
              margin: '0 0 8px 0',
            }}
          >
            Thank You, {order.customerName}
          </h1>

          <p style={{ fontSize: '0.925rem', color: 'var(--sejal-text-secondary)', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            Your reservation has been securely authenticated and logged into the Maison SEJAL vault.
          </p>

          {/* Reference Pill */}
          <div
            style={{
              backgroundColor: '#FAF6F0',
              border: '1px dashed var(--sejal-rose-gold)',
              padding: '12px 24px',
              borderRadius: '2px',
              display: 'inline-flex',
              flexDirection: 'column',
              gap: '4px',
              marginBottom: '32px',
            }}
          >
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sejal-text-muted)' }}>
              VAULT REFERENCE NUMBER
            </span>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--sejal-espresso)', letterSpacing: '0.1em' }}>
              {order.orderNumber}
            </span>
          </div>

          {/* Order Breakdown */}
          <div
            style={{
              textAlign: 'left',
              borderTop: '1px solid var(--sejal-border-light)',
              borderBottom: '1px solid var(--sejal-border-light)',
              padding: '24px 0',
              margin: '0 0 32px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', margin: 0 }}>
              Masterpieces in this Selection:
            </h4>

            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={item.imageUrl} alt={item.productName} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--sejal-espresso)', display: 'block', fontSize: '0.9rem' }}>
                      {item.productName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)' }}>
                      Qty: {item.quantity} • {item.selectedOptionsText}
                    </span>
                  </div>
                </div>
                <Price amountINR={item.totalINR} size="md" />
              </div>
            ))}
          </div>

          {/* Logistics & Delivery Details */}
          <div
            style={{
              backgroundColor: '#FAF6F0',
              padding: '20px 24px',
              borderRadius: '2px',
              textAlign: 'left',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sejal-text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                DESTINATION:
              </span>
              <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-espresso)', margin: 0, lineHeight: 1.5 }}>
                {order.shippingAddress?.recipientName} <br />
                {order.shippingAddress?.addressLine1} <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.stateProvince} {order.shippingAddress?.postalCode} <br />
                {order.shippingAddress?.country}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sejal-text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                LOGISTICS PROTOCOL:
              </span>
              <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-espresso)', margin: 0, lineHeight: 1.5 }}>
                <strong>{order.shippingMethod?.name}</strong> <br />
                Courier: {order.trackingCourier || 'SEJAL Armoured Courier'} <br />
                Tracking Code: <code>{order.trackingNumber || 'AWB-PENDING'}</code> <br />
                Estimated Arrival: <strong>{order.estimatedDeliveryDate}</strong>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <a href={`/track/${order.id}`}>
              <Button size="lg" leftIcon={<Truck size={16} />}>
                TRACK WHITE-GLOVE CONSIGNMENT
              </Button>
            </a>
            <a href="/account?tab=orders">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight size={16} />}>
                VIEW IN MY SEJAL VAULT
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
