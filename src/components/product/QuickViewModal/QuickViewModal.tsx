import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Product, ProductVariant } from '../../../types/product';
import { Modal } from '../../ui/Modal/Modal';
import { Price } from '../../ui/Price/Price';
import { Rating } from '../../ui/Rating/Rating';
import { VariantSelector } from '../VariantSelector/VariantSelector';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWished = isInWishlist(product.id);
  const primaryImage = product.media[0];

  const handleAdd = () => {
    addToCart(product, selectedVariant, quantity, {}, true);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="820px">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Left: Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            backgroundColor: '#FAF6F0',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <img
            src={primaryImage?.url}
            alt={primaryImage?.alt || product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Right: Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.6875rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--sejal-rose-gold)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '4px',
              }}
            >
              {product.brand}
            </span>

            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.85rem',
                fontWeight: 500,
                color: 'var(--sejal-espresso)',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {product.name}
            </h3>

            <div style={{ marginTop: '8px' }}>
              <Rating value={product.rating} count={product.reviewsCount} />
            </div>
          </div>

          {/* Price */}
          <Price
            amountINR={selectedVariant.priceINR || product.basePriceINR}
            compareAtINR={selectedVariant.compareAtPriceINR || product.compareAtPriceINR}
            size="lg"
          />

          <p style={{ fontSize: '0.875rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {product.shortDescription}
          </p>

          {/* Variant Selector */}
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={(v) => setSelectedVariant(v)}
          />

          {/* Quantity & Add */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--sejal-border)',
                borderRadius: '2px',
                height: '46px',
              }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ width: '36px', height: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ padding: '0 12px', fontSize: '0.875rem', fontWeight: 600 }}>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{ width: '36px', height: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              style={{
                flex: 1,
                height: '46px',
                backgroundColor: 'var(--sejal-espresso)',
                color: 'var(--sejal-cream)',
                border: 'none',
                borderRadius: '2px',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <ShoppingBag size={16} color="#F5E6D3" />
              <span>ADD TO SELECTION</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '2px',
                border: '1px solid var(--sejal-border)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isWished ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
              }}
              aria-label="Wishlist"
            >
              <Heart size={18} fill={isWished ? 'var(--sejal-rose-gold)' : 'none'} />
            </button>
          </div>

          {/* Full Page Link */}
          <div style={{ borderTop: '1px solid var(--sejal-border-light)', paddingTop: '14px', marginTop: '6px' }}>
            <a
              href={`/product/${product.slug}`}
              style={{
                fontSize: '0.8125rem',
                color: 'var(--sejal-rose-gold)',
                fontWeight: 600,
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>View Full Editorial & Craftsmanship Story</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
