import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Globe, ChevronRight } from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';

const ANNOUNCEMENTS = [
  'Complimentary Insured White-Glove Global Delivery on all Selections',
  'SEJAL Privé: By-Invitation Private Styling Salons Now Booking for Autumn/Winter',
  'The Art of Gifting: Complimentary Signature Rose Gold Ribbon Packaging & Calligraphy Card',
  'Certified 100% Conflict-Free Natural Diamonds & Ethical High Joaillerie',
];

export const AnnouncementBar: React.FC = () => {
  const [index, setIndex] = useState(0);
  const { currency, setCurrency, allCurrencies } = useCurrency();
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    if (isCurrencyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCurrencyDropdownOpen]);

  return (
    <aside
      aria-label="Announcement"
      style={{
        height: 'var(--announcement-height)',
        backgroundColor: 'var(--sejal-espresso)',
        color: 'var(--sejal-champagne)',
        fontSize: '0.725rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative',
        zIndex: isCurrencyDropdownOpen ? 1100 : 'var(--z-sticky)',
        borderBottom: '1px solid rgba(183, 110, 121, 0.15)',
      }}
    >
      {/* Left Market / Currency Selector */}
      <div ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        <button
          onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--sejal-champagne)',
            fontSize: '0.725rem',
            letterSpacing: '0.12em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
          aria-label="Change Market / Currency"
        >
          <Globe size={13} color="#D4AF37" />
          <span>
            {allCurrencies[currency].flag} {currency} ({allCurrencies[currency].symbol})
          </span>
          <span style={{ fontSize: '9px', opacity: 0.7, transform: isCurrencyDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            ▼
          </span>
        </button>

        {isCurrencyDropdownOpen && (
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              backgroundColor: '#1A1014',
              border: '1px solid rgba(183, 110, 121, 0.4)',
              borderRadius: '4px',
              padding: '6px 0',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(183, 110, 121, 0.2)',
              zIndex: 1200,
              minWidth: '190px',
            }}
          >
            <div style={{ padding: '6px 14px 4px 14px', fontSize: '0.625rem', color: '#9E7D87', letterSpacing: '0.16em' }}>
              SELECT MARKET & CURRENCY
            </div>
            {Object.values(allCurrencies).map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setCurrency(curr.code);
                  setIsCurrencyDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.75rem',
                  color: currency === curr.code ? '#FFFFFF' : '#D8A7B1',
                  backgroundColor: currency === curr.code ? 'rgba(183, 110, 121, 0.25)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (currency !== curr.code) {
                    e.currentTarget.style.backgroundColor = 'rgba(183, 110, 121, 0.12)';
                    e.currentTarget.style.color = '#FFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currency !== curr.code) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#D8A7B1';
                  }
                }}
              >
                <span style={{ fontSize: '1rem' }}>{curr.flag}</span>
                <span style={{ fontWeight: currency === curr.code ? 600 : 400 }}>{curr.name}</span>
                <span style={{ marginLeft: 'auto', color: '#D4AF37', fontWeight: 600, fontSize: '0.7rem' }}>
                  {curr.symbol} {curr.code}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center Rotating Message */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: '0 16px',
        }}
      >
        <Sparkles size={12} color="#D4AF37" />
        <span key={index} className="animate-fade-in" style={{ fontWeight: 400 }}>
          {ANNOUNCEMENTS[index]}
        </span>
      </div>

      {/* Right Quick Link */}
      <div style={{ display: 'none', alignItems: 'center', gap: '6px' }} className="hidden md:flex">
        <a
          href="/prive"
          style={{
            color: 'var(--sejal-champagne)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color 0.2s',
          }}
        >
          <span>SEJAL PRIVÉ SALON</span>
          <ChevronRight size={12} />
        </a>
      </div>
    </aside>
  );
};
