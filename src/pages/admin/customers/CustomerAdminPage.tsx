import React, { useState } from 'react';
import { Users, Award, Shield, Phone, Mail, MapPin } from 'lucide-react';

export const CustomerAdminPage: React.FC = () => {
  const [customers] = useState([
    {
      id: 'cust_1',
      name: 'Princess Ananya Singhania',
      email: 'ananya.s@singhania-heritage.in',
      phone: '+91 98200 11223',
      tier: 'SOVEREIGN',
      lifetimeSpendINR: 2450000,
      ordersCount: 4,
      city: 'Udaipur & Mumbai',
      country: 'India',
      conciergeRep: 'Devanshi Verma',
      notes: 'Prefers Cushion Brilliant emerald cut diamonds. Private salon client.',
    },
    {
      id: 'cust_2',
      name: 'Sheikha Maryam Al Nuaimi',
      email: 'm.alnuaimi@dubai-holdings.ae',
      phone: '+971 50 123 4567',
      tier: 'IMPERIAL',
      lifetimeSpendINR: 4800000,
      ordersCount: 6,
      city: 'Dubai',
      country: 'United Arab Emirates',
      conciergeRep: 'Devanshi Verma',
      notes: 'Orders custom zardozi drapes and bespoke 100ml pure perfume extraits.',
    },
    {
      id: 'cust_3',
      name: 'Eleanor Vance-Sterling',
      email: 'eleanor.vance@sterling-ny.com',
      phone: '+1 (212) 555-0199',
      tier: 'PRIVÉ',
      lifetimeSpendINR: 850000,
      ordersCount: 2,
      city: 'New York',
      country: 'United States',
      conciergeRep: 'Devanshi Verma',
      notes: 'Regular collector of The Aura Choker series.',
    },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Clientele 360 & Privé Salon VIP Registry
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
          Ultra-high-net-worth client profiles, tier privileges, lifetime value, and dedicated concierge liaison assignments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {customers.map((c) => (
          <div key={c.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: '#0F172A', display: 'block' }}>{c.name}</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{c.city}, {c.country}</span>
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  padding: '3px 8px',
                  borderRadius: '2px',
                  backgroundColor: '#2C1810',
                  color: '#D4AF37',
                  border: '1px solid #D4AF37',
                }}
              >
                {c.tier}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '4px', margin: '12px 0' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'block', fontWeight: 600 }}>LIFETIME VALUE</span>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>₹{c.lifetimeSpendINR.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'block', fontWeight: 600 }}>TOTAL ORDERS</span>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{c.ordersCount} Orders</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>📧 {c.email}</span>
              <span>📞 {c.phone}</span>
              <span style={{ marginTop: '4px', fontStyle: 'italic', color: '#64748B' }}>"{c.notes}"</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
