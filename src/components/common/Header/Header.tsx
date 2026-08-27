import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { Logo } from '../../ui/Logo/Logo';
import { AnnouncementBar } from '../AnnouncementBar/AnnouncementBar';
import { MAIN_NAVIGATION, EDITORIAL_LINKS } from '../../../config/navigation';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMobileNav,
  currentPath = '/',
}) => {
  const { cart, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, customer, openAuthModal } = useAuth();

  const [activeMegaCategory, setActiveMegaCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        backgroundColor: '#FFFFFF',
        boxShadow: isScrolled ? '0 4px 20px rgba(183, 110, 121, 0.08)' : 'none',
        borderBottom: '1px solid var(--sejal-border-light)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Main Header Bar */}
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--header-height)',
          paddingTop: '6px',
          paddingBottom: '6px',
        }}
      >
        {/* Left Side: Mobile Menu Button / Desktop Editorial Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          {/* Mobile Hamburger */}
          <button
            onClick={onOpenMobileNav}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--sejal-espresso)',
            }}
            className="md:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Left Nav Links */}
          <nav
            style={{ display: 'none', alignItems: 'center', gap: '24px' }}
            className="hidden md:flex"
            aria-label="Editorial Links"
          >
            <a
              href="/shop"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.8125rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: currentPath.startsWith('/shop') ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
                transition: 'color 0.2s',
              }}
            >
              SHOP THE EDIT
            </a>
            <a
              href="/story"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.8125rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: currentPath === '/story' ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
                transition: 'color 0.2s',
              }}
            >
              OUR STORY
            </a>
            <a
              href="/prive"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.8125rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#8B4B5B',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} color="#B76E79" />
              <span>SEJAL PRIVÉ</span>
            </a>
          </nav>
        </div>

        {/* Center: Brand Crowned Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <a href="/" aria-label="SEJAL.PRO Home" style={{ textDecoration: 'none' }}>
            <Logo variant="full" size="md" />
          </a>
        </div>

        {/* Right Side: Customer Actions (Search, Wishlist, Account, Cart) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '18px',
            flex: 1,
          }}
        >
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--sejal-espresso)',
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              transition: 'color 0.2s',
            }}
            aria-label="Search Collection"
          >
            <Search size={20} />
          </button>

          {/* Wishlist */}
          <a
            href="/wishlist"
            style={{
              color: 'var(--sejal-espresso)',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              padding: '6px',
            }}
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  backgroundColor: 'var(--sejal-rose-gold)',
                  color: '#FFFFFF',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  width: '16px',
                  height: '16px',
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

          {/* Account */}
          <div style={{ position: 'relative' }}>
            {isAuthenticated ? (
              <a
                href="/account"
                style={{
                  color: 'var(--sejal-espresso)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px',
                }}
                aria-label="My SEJAL Account"
              >
                <User size={20} />
                <span
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'none',
                  }}
                  className="hidden lg:inline"
                >
                  {customer?.firstName || 'Account'}
                </span>
              </a>
            ) : (
              <button
                onClick={openAuthModal}
                style={{
                  color: 'var(--sejal-espresso)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                }}
                aria-label="Sign In / Register"
              >
                <User size={20} />
                <span
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'none',
                  }}
                  className="hidden lg:inline"
                >
                  SIGN IN
                </span>
              </button>
            )}
          </div>

          {/* Bag / "YOUR SEJAL SELECTION" */}
          <button
            onClick={openCartDrawer}
            style={{
              backgroundColor: 'var(--sejal-espresso)',
              color: 'var(--sejal-cream)',
              border: 'none',
              borderRadius: '2px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
              transition: 'background-color 0.2s',
            }}
            aria-label={`Your SEJAL Selection with ${cart.itemCount} items`}
          >
            <ShoppingBag size={16} color="#F5E6D3" />
            <span style={{ display: 'none' }} className="hidden sm:inline">
              SELECTION
            </span>
            <span
              style={{
                backgroundColor: 'var(--sejal-rose-gold)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 600,
                padding: '1px 6px',
                borderRadius: '10px',
              }}
            >
              {cart.itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Category Navigation & Mega Menu Bar */}
      <nav
        style={{
          borderTop: '1px solid var(--sejal-border-light)',
          backgroundColor: '#FAF6F0',
          position: 'relative',
        }}
        className="hidden md:block"
        aria-label="Primary Categories"
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            height: '42px',
          }}
        >
          {MAIN_NAVIGATION.map((cat) => (
            <div
              key={cat.slug}
              onMouseEnter={() => setActiveMegaCategory(cat.slug)}
              onMouseLeave={() => setActiveMegaCategory(null)}
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <a
                href={`/shop?category=${cat.slug}`}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.05rem',
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                  color: activeMegaCategory === cat.slug ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.2s',
                }}
              >
                {cat.name}
              </a>

              {/* Mega Menu Dropdown */}
              {activeMegaCategory === cat.slug && (
                <div
                  className="animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '640px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--sejal-border)',
                    boxShadow: '0 18px 40px rgba(26, 18, 21, 0.12)',
                    borderRadius: '2px',
                    padding: '24px 32px',
                    zIndex: 999,
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr',
                    gap: '24px',
                  }}
                >
                  {/* Left Column: Subcategories */}
                  <div>
                    <h5
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '0.6875rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--sejal-rose-gold)',
                        marginBottom: '14px',
                        fontWeight: 600,
                      }}
                    >
                      THE CURATED COLLECTION
                    </h5>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <li>
                        <a
                          href={`/shop?category=${cat.slug}`}
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'var(--sejal-espresso)',
                            display: 'block',
                          }}
                        >
                          View All {cat.name} →
                        </a>
                      </li>
                      {cat.subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <a
                            href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                            style={{
                              fontSize: '0.875rem',
                              color: 'var(--sejal-text-secondary)',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--sejal-rose-gold)')}
                            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--sejal-text-secondary)')}
                          >
                            {sub.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Editorial Highlight */}
                  <div
                    style={{
                      backgroundColor: '#FAF0F2',
                      padding: '16px',
                      borderRadius: '2px',
                      border: '1px solid var(--sejal-border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.625rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--sejal-rose-gold)',
                        fontWeight: 600,
                        marginBottom: '6px',
                      }}
                    >
                      EDITORIAL SPOTLIGHT
                    </span>
                    <h6
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.2rem',
                        color: 'var(--sejal-espresso)',
                        marginBottom: '8px',
                      }}
                    >
                      The Art of Haute Joaillerie
                    </h6>
                    <p style={{ fontSize: '0.75rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                      Discover rare natural diamonds set in hand-forged 18K rose gold.
                    </p>
                    <a
                      href={`/shop?category=${cat.slug}`}
                      style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        color: 'var(--sejal-espresso)',
                        textDecoration: 'underline',
                      }}
                    >
                      DISCOVER NOW
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--sejal-border)' }} />

          <a
            href="/gifting"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.05rem',
              letterSpacing: '0.06em',
              fontWeight: 500,
              color: 'var(--sejal-espresso)',
            }}
          >
            Luxury Gifting
          </a>

          <a
            href="/journal"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.05rem',
              letterSpacing: '0.06em',
              fontWeight: 500,
              color: 'var(--sejal-espresso)',
            }}
          >
            Editorial Journal
          </a>
        </div>
      </nav>
    </header>
  );
};
