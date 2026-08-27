import React, { useState } from 'react';
import { Home, Compass, Search, Heart, User, X, ChevronRight, Phone, Sparkles, Globe } from 'lucide-react';
import { Logo } from '../../ui/Logo/Logo';
import { MAIN_NAVIGATION, EDITORIAL_LINKS } from '../../../config/navigation';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { useCurrency } from '../../../context/CurrencyContext';

interface MobileNavProps {
  isMenuOpen: boolean;
  onCloseMenu: () => void;
  onOpenSearch: () => void;
  currentPath?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isMenuOpen,
  onCloseMenu,
  onOpenSearch,
  currentPath = '/',
}) => {
  const { cart, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, customer, openAuthModal } = useAuth();
  const { currency, setCurrency, allCurrencies } = useCurrency();

  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const toggleCategory = (slug: string) => {
    setExpandedCat((prev) => (prev === slug ? null : slug));
  };

  return (
    <>
      {/* 1. Mobile Bottom Bar (Fixed Luxury Dock) */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-sticky)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--sejal-border-light)',
          height: 'var(--mobile-nav-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          boxShadow: '0 -4px 20px rgba(26, 18, 21, 0.06)',
        }}
      >
        {/* Home */}
        <a
          href="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: currentPath === '/' ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '6px 10px',
          }}
        >
          <Home size={19} />
          <span>Home</span>
        </a>

        {/* Shop */}
        <a
          href="/shop"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: currentPath.startsWith('/shop') ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '6px 10px',
          }}
        >
          <Compass size={19} />
          <span>Shop</span>
        </a>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: 'var(--sejal-espresso)',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '6px 10px',
            background: 'none',
            border: 'none',
          }}
        >
          <Search size={19} />
          <span>Search</span>
        </button>

        {/* Wishlist */}
        <a
          href="/wishlist"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: currentPath === '/wishlist' ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '6px 10px',
            position: 'relative',
          }}
        >
          <Heart size={19} />
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '12px',
                backgroundColor: 'var(--sejal-rose-gold)',
                color: '#FFFFFF',
                fontSize: '0.55rem',
                fontWeight: 600,
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {wishlistCount}
            </span>
          )}
        </a>

        {/* Account / Bag Combo */}
        {isAuthenticated ? (
          <a
            href="/account"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              color: currentPath.startsWith('/account') ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 10px',
            }}
          >
            <User size={19} />
            <span>Account</span>
          </a>
        ) : (
          <button
            onClick={openAuthModal}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              color: 'var(--sejal-espresso)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 10px',
              background: 'none',
              border: 'none',
            }}
          >
            <User size={19} />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* 2. Fullscreen Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
          className="animate-fade-in"
        >
          {/* Mobile Drawer Header */}
          <div
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--sejal-border-light)',
            }}
          >
            <Logo variant="compact" size="sm" />
            <button
              onClick={onCloseMenu}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--sejal-espresso)',
                padding: '6px',
                cursor: 'pointer',
              }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Drawer Menu List */}
          <div style={{ flex: 1, padding: '20px' }}>
            {/* Currency Selector Pill */}
            <div
              style={{
                backgroundColor: '#FAF6F0',
                padding: '10px 14px',
                borderRadius: '4px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
                <Globe size={16} color="var(--sejal-rose-gold)" />
                <span>Market: {allCurrencies[currency].name} ({currency})</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(Object.keys(allCurrencies) as Array<keyof typeof allCurrencies>).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      borderRadius: '2px',
                      border: '1px solid var(--sejal-border)',
                      backgroundColor: currency === c ? 'var(--sejal-espresso)' : '#FFFFFF',
                      color: currency === c ? '#FFFFFF' : 'var(--sejal-espresso)',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Accordions */}
            <div style={{ marginBottom: '24px' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--sejal-rose-gold)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                CATEGORIES
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <a
                  href="/shop"
                  onClick={onCloseMenu}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    color: 'var(--sejal-espresso)',
                    padding: '8px 0',
                    display: 'block',
                    borderBottom: '1px solid var(--sejal-border-light)',
                  }}
                >
                  Discover The Complete Edit →
                </a>

                {MAIN_NAVIGATION.map((cat) => {
                  const isExpanded = expandedCat === cat.slug;
                  return (
                    <div key={cat.slug} style={{ borderBottom: '1px solid var(--sejal-border-light)' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 0',
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleCategory(cat.slug)}
                      >
                        <span
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '1.25rem',
                            color: 'var(--sejal-espresso)',
                          }}
                        >
                          {cat.name}
                        </span>
                        <ChevronRight
                          size={18}
                          style={{
                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                            color: 'var(--sejal-rose-gold)',
                          }}
                        />
                      </div>

                      {isExpanded && (
                        <div
                          className="animate-fade-in"
                          style={{
                            backgroundColor: '#FAF6F0',
                            padding: '10px 16px',
                            borderRadius: '4px',
                            marginBottom: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <a
                            href={`/shop?category=${cat.slug}`}
                            onClick={onCloseMenu}
                            style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--sejal-espresso)' }}
                          >
                            All {cat.name}
                          </a>
                          {cat.subcategories.map((sub) => (
                            <a
                              key={sub.slug}
                              href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                              onClick={onCloseMenu}
                              style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)' }}
                            >
                              {sub.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Editorial & Privé Links */}
            <div style={{ marginBottom: '32px' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--sejal-rose-gold)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                MAISON & PRIVÉ
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {EDITORIAL_LINKS.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={onCloseMenu}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.2rem',
                      color: 'var(--sejal-espresso)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{link.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)' }}>{link.description.slice(0, 24)}...</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Founder & White-Glove Contact */}
            <div
              style={{
                backgroundColor: '#FAF0F2',
                border: '1px solid var(--sejal-border)',
                padding: '16px',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                <Phone size={14} color="var(--sejal-rose-gold)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>
                  WHITE-GLOVE CONCIERGE
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-espresso)', margin: '0 0 6px 0', fontWeight: 500 }}>
                Direct Salon Line: +91 8005056531
              </p>
              <p style={{ fontSize: '0.725rem', color: 'var(--sejal-text-muted)', margin: 0 }}>
                Founder: Sejal Gupta • Sejal@Sejal.Pro
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
