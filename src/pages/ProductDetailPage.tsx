import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, ShieldCheck, Gift, Truck, Headphones, Check, Sparkles, Star, ArrowRight } from 'lucide-react';
import { productService } from '../services/productService';
import { Product, ProductVariant } from '../types/product';
import { ProductGallery } from '../components/product/ProductGallery/ProductGallery';
import { VariantSelector } from '../components/product/VariantSelector/VariantSelector';
import { Price } from '../components/ui/Price/Price';
import { Badge } from '../components/ui/Badge/Badge';
import { Rating } from '../components/ui/Rating/Rating';
import { Accordion, AccordionItem } from '../components/ui/Accordion/Accordion';
import { ProductCard } from '../components/product/ProductCard/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const RECENTLY_VIEWED_KEY = 'sejal_recently_viewed_v1';

interface ProductDetailPageProps {
  slug?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  // If no slug prop, parse from window.location.pathname
  const pathSlug = slug || window.location.pathname.replace('/product/', '');
  const product = productService.getProductBySlug(pathSlug) || productService.getAllProducts()[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(product.id);

  // Update variant when product changes
  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Persist to Recently Viewed
  useEffect(() => {
    if (!product) return;
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let ids: string[] = saved ? JSON.parse(saved) : [];
      ids = [product.id, ...ids.filter((id) => id !== product.id)].slice(0, 8);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids));

      const all = productService.getAllProducts();
      const recent = ids
        .filter((id) => id !== product.id)
        .map((id) => all.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      setRecentlyViewed(recent);
    } catch {
      // ignore
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <a href="/shop">Return to Shop</a>
      </div>
    );
  }

  const relatedProducts = productService.getRelatedProducts(product.id);

  const handleAddToBag = () => {
    addToCart(product, selectedVariant, quantity, {}, true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity, {}, false);
    window.location.href = '/checkout';
  };

  // Build Accordion Items
  const accordionItems: AccordionItem[] = [
    {
      id: 'story',
      title: 'THE STORY & INSPIRATION',
      content: <p style={{ margin: 0, lineHeight: 1.8 }}>{product.story}</p>,
      defaultOpen: true,
    },
    {
      id: 'details',
      title: 'DETAILS & SPECIFICATIONS',
      content: (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', listStyleType: 'disc' }}>
          {product.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
          {product.dimensions && <li><strong>Dimensions:</strong> {product.dimensions}</li>}
        </ul>
      ),
    },
    {
      id: 'craftsmanship',
      title: 'MATERIALS & CRAFTSMANSHIP',
      content: (
        <div>
          <p style={{ marginBottom: '8px' }}>{product.craftsmanship}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            {product.materials.map((m) => (
              <span
                key={m}
                style={{
                  backgroundColor: '#FAF0F2',
                  border: '1px solid var(--sejal-border)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '0.75rem',
                  color: 'var(--sejal-espresso)',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'care',
      title: 'CARE & PRESERVATION',
      content: <p style={{ margin: 0, lineHeight: 1.8 }}>{product.careGuide}</p>,
    },
    {
      id: 'packaging',
      title: 'COMPLIMENTARY LUXURY PACKAGING',
      content: (
        <div>
          <p style={{ marginBottom: '8px', lineHeight: 1.7 }}>{product.packagingDetails}</p>
          <div style={{ backgroundColor: '#FAF6F0', padding: '12px 16px', borderRadius: '2px', fontSize: '0.8125rem' }}>
            ✨ Includes personalized calligraphy card, double-faced silk ribbons, and discreet shipping box.
          </div>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'INSURED SHIPPING & RETURNS',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.7 }}>
          <p style={{ margin: 0 }}>
            Complimentary armored white-glove delivery worldwide. Orders are processed within 24 hours and delivered in 2–4 business days with signature required.
          </p>
          <p style={{ margin: 0 }}>
            Private 14-day return and exchange policy. Our concierge team arranges secure pickup at your convenience.
          </p>
        </div>
      ),
    },
  ];

  return (
    <main style={{ backgroundColor: '#FFFFFF', paddingBottom: '96px' }}>
      {/* Top Breadcrumbs */}
      <div style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid var(--sejal-border-light)' }}>
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Shop', url: '/shop' },
              { label: product.brand, url: `/shop?brand=${encodeURIComponent(product.brand)}` },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {/* Main PDP 2-Column Showcase */}
      <div className="container" style={{ paddingTop: '40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '56px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Interactive Image Gallery */}
          <div>
            <ProductGallery media={product.media} productName={product.name} />
          </div>

          {/* Right Column: Product Information & Purchase Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header / Brand & Badges */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--sejal-rose-gold)',
                    fontWeight: 600,
                  }}
                >
                  {product.brand}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {product.isLimitedEdition && <Badge label="LIMITED EDITION" variant="limited" />}
                  {product.isSignature && <Badge label="SIGNATURE" variant="signature" />}
                </div>
              </div>

              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 500,
                  color: 'var(--sejal-espresso)',
                  lineHeight: 1.15,
                  margin: '0 0 8px 0',
                }}
              >
                {product.name}
              </h1>

              {product.subtitle && (
                <p style={{ fontSize: '0.95rem', color: 'var(--sejal-text-secondary)', margin: '0 0 12px 0' }}>
                  {product.subtitle}
                </p>
              )}

              {/* Rating & SKU */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--sejal-border-light)' }}>
                <Rating value={product.rating} count={product.reviewsCount} />
                <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)', letterSpacing: '0.06em' }}>
                  SKU: {selectedVariant.sku}
                </span>
              </div>
            </div>

            {/* Price & Availability */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <Price
                amountINR={selectedVariant.priceINR || product.basePriceINR}
                compareAtINR={selectedVariant.compareAtPriceINR || product.compareAtPriceINR}
                size="xl"
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--sejal-success)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--sejal-success)', display: 'inline-block' }} />
                <span style={{ fontWeight: 600 }}>In Stock — Ready for White-Glove Dispatch</span>
              </div>
            </div>

            {/* Short Description */}
            <p style={{ fontSize: '0.9rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.7, margin: 0 }}>
              {product.shortDescription}
            </p>

            {/* Variant Selector */}
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={(v) => setSelectedVariant(v)}
            />

            {/* Quantity Stepper & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                {/* Quantity Stepper */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--sejal-border)',
                    borderRadius: '2px',
                    height: '52px',
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: '42px', height: '100%', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span style={{ padding: '0 16px', fontSize: '0.925rem', fontWeight: 600 }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ width: '42px', height: '100%', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary ADD TO BAG Button */}
                <button
                  onClick={handleAddToBag}
                  style={{
                    flex: 1,
                    height: '52px',
                    backgroundColor: 'var(--sejal-espresso)',
                    color: 'var(--sejal-cream)',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '0.8125rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 6px 20px rgba(26, 18, 21, 0.2)',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ShoppingBag size={18} color="#F5E6D3" />
                  <span>ADD TO SELECTION</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '2px',
                    border: '1px solid var(--sejal-border)',
                    backgroundColor: isWished ? '#FAF0F2' : '#FFFFFF',
                    color: isWished ? 'var(--sejal-rose-gold)' : 'var(--sejal-espresso)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  aria-label="Save to Wishlist"
                >
                  <Heart size={20} fill={isWished ? 'var(--sejal-rose-gold)' : 'none'} />
                </button>
              </div>

              {/* Express BUY NOW Button */}
              <button
                onClick={handleBuyNow}
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#B76E79',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '2px',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(183, 110, 121, 0.3)',
                }}
              >
                <span>EXPRESS CHECKOUT — BUY NOW</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* SEJAL Promise Badge Strip */}
            <div
              style={{
                backgroundColor: '#FAF6F0',
                border: '1px solid var(--sejal-border-light)',
                borderRadius: '2px',
                padding: '16px 20px',
                marginTop: '12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--sejal-espresso)' }}>
                <ShieldCheck size={16} color="var(--sejal-rose-gold)" />
                <span>100% Certified Authentic</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--sejal-espresso)' }}>
                <Gift size={16} color="var(--sejal-rose-gold)" />
                <span>Signature Rose Gold Packaging</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--sejal-espresso)' }}>
                <Truck size={16} color="var(--sejal-rose-gold)" />
                <span>Complimentary Insured Delivery</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--sejal-espresso)' }}>
                <Headphones size={16} color="var(--sejal-rose-gold)" />
                <span>White-Glove Salon Concierge</span>
              </div>
            </div>

            {/* Accordion Panels */}
            <div style={{ marginTop: '16px' }}>
              <Accordion items={accordionItems} allowMultiple={true} />
            </div>
          </div>
        </div>

        {/* Related Creations Section */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '96px', paddingTop: '48px', borderTop: '1px solid var(--sejal-border-light)' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.6875rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--sejal-rose-gold)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                COMPLETE THE LOOK
              </span>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2.2rem',
                  color: 'var(--sejal-espresso)',
                  margin: 0,
                }}
              >
                Harmonious Pairings
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Carousel */}
        {recentlyViewed.length > 0 && (
          <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid var(--sejal-border-light)' }}>
            <h4
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.6rem',
                color: 'var(--sejal-espresso)',
                marginBottom: '24px',
              }}
            >
              Recently Viewed Creations
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              {recentlyViewed.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
