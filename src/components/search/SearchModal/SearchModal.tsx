import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Clock, Compass } from 'lucide-react';
import { productService } from '../../../services/productService';
import { Product, Category } from '../../../types/product';
import { Price } from '../../ui/Price/Price';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'sejal_recent_searches_v1';

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['Diamond Choker', 'Mulberry Silk', 'Rose Gold'];
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const suggestions = productService.getSearchSuggestions(query);

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const term = searchTerm.trim();
    const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    window.location.href = `/search?q=${encodeURIComponent(term)}`;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal)',
        backgroundColor: 'rgba(26, 18, 21, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--sejal-border)',
          padding: '24px 0 32px 0',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container" style={{ maxWidth: '880px' }}>
          {/* Search Input Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '2px solid var(--sejal-espresso)',
              paddingBottom: '12px',
              position: 'relative',
            }}
          >
            <Search size={24} color="var(--sejal-espresso)" style={{ marginRight: '14px' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by gemstone, material, collection, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(query);
                if (e.key === 'Escape') onClose();
              }}
              style={{
                width: '100%',
                fontSize: '1.25rem',
                fontFamily: "'Cormorant Garamond', serif",
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'var(--sejal-espresso)',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--sejal-text-muted)' }}
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                marginLeft: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--sejal-espresso)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              CLOSE
            </button>
          </div>

          {/* Quick Tags / Trending & Recent */}
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--sejal-text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>
              TRENDING:
            </span>
            {suggestions.popularTerms.map((term) => (
              <button
                key={term}
                onClick={() => handleSearchSubmit(term)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: '#FAF0F2',
                  border: '1px solid var(--sejal-border-light)',
                  color: 'var(--sejal-espresso)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {term}
              </button>
            ))}
          </div>

          {/* Live Search Suggestions Area */}
          <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '32px' }}>
            {/* Left: Categories & Recent */}
            <div>
              {recentSearches.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Clock size={13} color="var(--sejal-rose-gold)" />
                    <span style={{ fontSize: '0.6875rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
                      RECENT SEARCHES
                    </span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {recentSearches.map((term) => (
                      <li key={term}>
                        <button
                          onClick={() => handleSearchSubmit(term)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.875rem',
                            color: 'var(--sejal-text-secondary)',
                            cursor: 'pointer',
                            padding: '2px 0',
                            textAlign: 'left',
                          }}
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Compass size={13} color="var(--sejal-rose-gold)" />
                  <span style={{ fontSize: '0.6875rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
                    CATEGORIES
                  </span>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {suggestions.categories.map((cat) => (
                    <li key={cat.slug}>
                      <a
                        href={`/shop?category=${cat.slug}`}
                        onClick={onClose}
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--sejal-espresso)',
                          fontWeight: 500,
                        }}
                      >
                        {cat.name} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Suggested Products Grid */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Sparkles size={13} color="var(--sejal-rose-gold)" />
                <span style={{ fontSize: '0.6875rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
                  SUGGESTED MASTERPIECES
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                {suggestions.products.slice(0, 3).map((prod) => (
                  <a
                    key={prod.id}
                    href={`/product/${prod.slug}`}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#FAF6F0',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      padding: '8px',
                      border: '1px solid var(--sejal-border-light)',
                    }}
                  >
                    <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '2px', marginBottom: '8px' }}>
                      <img src={prod.media[0]?.url} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', fontWeight: 600, color: 'var(--sejal-espresso)', lineHeight: 1.2 }}>
                      {prod.name}
                    </span>
                    <div style={{ marginTop: '4px' }}>
                      <Price amountINR={prod.basePriceINR} size="sm" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
