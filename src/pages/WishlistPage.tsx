import React from 'react';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard/ProductCard';
import { Button } from '../components/ui/Button/Button';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, wishlistCount } = useWishlist();

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '96px' }}>
      <div className="container" style={{ paddingTop: '24px' }}>
        <Breadcrumb items={[{ label: 'Curated Wishlist' }]} />

        <div style={{ textAlign: 'center', margin: '24px 0 40px 0' }}>
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
            PERSONAL TREASURY
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              color: 'var(--sejal-espresso)',
              margin: 0,
            }}
          >
            Your Curated Wishlist ({wishlistCount})
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--sejal-text-secondary)', marginTop: '8px' }}>
            Saved fine creations, limited drops, and lookbook pieces awaiting your selection.
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--sejal-border-light)',
              borderRadius: '2px',
              padding: '64px 20px',
              textAlign: 'center',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#FAF0F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sejal-rose-gold)',
                margin: '0 auto 16px auto',
              }}
            >
              <Heart size={24} />
            </div>

            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', marginBottom: '8px' }}>
              Your Wishlist is Empty
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-secondary)', marginBottom: '24px' }}>
              Discover our latest high joaillerie and limited collections to curate your personal treasury.
            </p>

            <a href="/shop">
              <Button size="md">EXPLORE THE EDIT</Button>
            </a>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px',
            }}
          >
            {wishlistProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
