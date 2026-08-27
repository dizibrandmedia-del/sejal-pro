import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../../../types/product';
import { Price } from '../../ui/Price/Price';
import { Badge } from '../../ui/Badge/Badge';
import { Rating } from '../../ui/Rating/Rating';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  className = '',
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const isWished = isInWishlist(product.id);

  const primaryImage = product.media.find((m) => m.isPrimary) || product.media[0];
  const hoverImage = product.media.find((m) => m.isHover) || product.media[1] || primaryImage;

  // Extract badge
  const getBadge = () => {
    if (product.isLimitedEdition) return <Badge label="LIMITED EDITION" variant="limited" />;
    if (product.isSignature) return <Badge label="SIGNATURE" variant="signature" />;
    if (product.isBestseller) return <Badge label="MOST COVETED" variant="coveted" />;
    if (product.isNewArrival) return <Badge label="NEW" variant="new" />;
    return null;
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedVariant, 1, {}, true);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <article
      className={`luxury-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '2px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Product Image Area */}
      <a
        href={`/product/${product.slug}`}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          aspectRatio: '3 / 4',
          overflow: 'hidden',
          backgroundColor: '#FAF6F0',
        }}
      >
        {/* Primary & Hover Image Crossfade */}
        <img
          src={primaryImage?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'}
          alt={primaryImage?.alt || product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: isHovered && hoverImage ? 0 : 1,
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {hoverImage && (
          <img
            src={hoverImage.url}
            alt={hoverImage.alt || product.name}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        )}

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {getBadge()}
        </div>

        {/* Top Right Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 3,
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--sejal-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isWished ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
            transition: 'transform 0.2s, background-color 0.2s',
          }}
          aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={isWished ? 'var(--sejal-rose-gold)' : 'none'} />
        </button>

        {/* Floating Quick Action Overlay on Hover */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            zIndex: 3,
            display: 'flex',
            gap: '8px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <button
            onClick={handleQuickAdd}
            style={{
              flex: 1,
              backgroundColor: 'rgba(26, 18, 21, 0.92)',
              color: '#FAF6F0',
              backdropFilter: 'blur(8px)',
              padding: '10px 14px',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 500,
              borderRadius: '2px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <ShoppingBag size={13} color="#F5E6D3" />
            <span>ADD TO BAG</span>
          </button>

          {onQuickView && (
            <button
              onClick={handleQuickViewClick}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                color: 'var(--sejal-espresso)',
                backdropFilter: 'blur(8px)',
                width: '38px',
                height: '38px',
                borderRadius: '2px',
                border: '1px solid var(--sejal-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Quick preview"
            >
              <Eye size={15} />
            </button>
          )}
        </div>
      </a>

      {/* Product Details Area */}
      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Brand */}
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--sejal-rose-gold)',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          {product.brand}
        </span>

        {/* Title */}
        <a
          href={`/product/${product.slug}`}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.25rem',
            fontWeight: 500,
            color: 'var(--sejal-espresso)',
            lineHeight: 1.25,
            marginBottom: '6px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--sejal-rose-gold)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--sejal-espresso)')}
        >
          {product.name}
        </a>

        {/* Short Subtitle */}
        {product.subtitle && (
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--sejal-text-muted)',
              margin: '0 0 10px 0',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.subtitle}
          </p>
        )}

        {/* Color Swatch Selector Chips if multiple */}
        {product.variants.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            {product.variants.map((variant, idx) => {
              const colorOption = variant.options.find((o) => o.hexColor);
              if (!colorOption?.hexColor) return null;

              const isSelected = selectedVariantIndex === idx;
              return (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(idx);
                  }}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: colorOption.hexColor,
                    border: isSelected ? '2px solid var(--sejal-espresso)' : '1px solid rgba(0,0,0,0.15)',
                    padding: 0,
                    cursor: 'pointer',
                    outline: 'none',
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.2s',
                  }}
                  title={variant.title}
                  aria-label={variant.title}
                />
              );
            })}
          </div>
        )}

        {/* Price & Rating Row */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '6px',
            borderTop: '1px solid var(--sejal-border-light)',
          }}
        >
          <Price
            amountINR={selectedVariant.priceINR || product.basePriceINR}
            compareAtINR={selectedVariant.compareAtPriceINR || product.compareAtPriceINR}
            size="md"
          />

          <Rating value={product.rating} count={product.reviewsCount} size={11} showText={false} />
        </div>
      </div>
    </article>
  );
};
