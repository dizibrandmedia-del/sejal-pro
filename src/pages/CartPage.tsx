import React, { useState } from 'react';
import { ShoppingBag, Trash2, Heart, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { Price } from '../components/ui/Price/Price';
import { GiftPackagingOption } from '../components/cart/GiftPackagingOption/GiftPackagingOption';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeItem,
    setGiftPackaging,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    applyCoupon(couponCode.trim());
    setCouponCode('');
  };

  const handleSaveForLater = (productId: string, itemId: string) => {
    if (!isInWishlist(productId)) {
      toggleWishlist(productId);
    }
    removeItem(itemId);
  };

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '96px' }}>
      <div className="container" style={{ paddingTop: '24px' }}>
        <Breadcrumb items={[{ label: 'Your SEJAL Selection' }]} />

        <div style={{ margin: '24px 0 36px 0' }}>
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
            CONFIDENTIAL RESERVATIONS
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 500,
              color: 'var(--sejal-espresso)',
              margin: 0,
            }}
          >
            Your SEJAL Selection ({cart.itemCount})
          </h1>
        </div>

        {cart.items.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--sejal-border-light)',
              borderRadius: '2px',
              padding: '64px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FAF0F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sejal-rose-gold)',
                margin: '0 auto 16px auto',
              }}
            >
              <ShoppingBag size={28} />
            </div>

            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem',
                color: 'var(--sejal-espresso)',
                marginBottom: '8px',
              }}
            >
              Your Selection Bag is Empty
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--sejal-text-secondary)', maxWidth: '360px', margin: '0 auto 24px auto' }}>
              Explore our curated masterworks of fine jewellery, silk drapes, and niche fragrances.
            </p>

            <a
              href="/shop"
              style={{
                backgroundColor: 'var(--sejal-espresso)',
                color: 'var(--sejal-cream)',
                padding: '14px 36px',
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                borderRadius: '2px',
                display: 'inline-block',
              }}
            >
              EXPLORE THE EDIT
            </a>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Items Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--sejal-border-light)',
                  borderRadius: '2px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '96px 1fr',
                        gap: '20px',
                        paddingBottom: '24px',
                        borderBottom: '1px solid var(--sejal-border-light)',
                      }}
                    >
                      <a
                        href={`/product/${item.product.slug}`}
                        style={{ aspectRatio: '3/4', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#FAF6F0' }}
                      >
                        <img src={item.product.media[0]?.url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </a>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
                              {item.product.brand}
                            </span>
                            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'var(--sejal-espresso)', margin: '2px 0 4px 0' }}>
                              {item.product.name}
                            </h4>
                            <span style={{ fontSize: '0.785rem', color: 'var(--sejal-text-muted)' }}>
                              Edition: {item.variant.title}
                            </span>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--sejal-text-muted)', cursor: 'pointer', padding: '4px' }}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {/* Quantity Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--sejal-border)', borderRadius: '2px', height: '36px' }}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{ width: '32px', height: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                            >
                              -
                            </button>
                            <span style={{ padding: '0 12px', fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ width: '32px', height: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                            >
                              +
                            </button>
                          </div>

                          <Price amountINR={item.variant.priceINR * item.quantity} size="lg" />
                        </div>

                        <div style={{ marginTop: '8px' }}>
                          <button
                            onClick={() => handleSaveForLater(item.productId, item.id)}
                            style={{ background: 'none', border: 'none', fontSize: '0.725rem', color: 'var(--sejal-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Heart size={12} />
                            <span>Save to Wishlist</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gift Packaging Option */}
              <GiftPackagingOption giftPackaging={cart.giftPackaging} onChange={setGiftPackaging} />
            </div>

            {/* Right Column: Order Summary Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--sejal-border)',
                borderRadius: '2px',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: 'var(--sejal-espresso)',
                  marginBottom: '20px',
                  borderBottom: '1px solid var(--sejal-border-light)',
                  paddingBottom: '12px',
                }}
              >
                Summary of Selection
              </h3>

              {/* Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sejal-text-secondary)' }}>
                  <span>Items Subtotal</span>
                  <span>{formatPrice(cart.subtotalINR)}</span>
                </div>

                {cart.discountINR > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sejal-success)', fontWeight: 500 }}>
                    <span>Privé Courtesy Discount</span>
                    <span>-{formatPrice(cart.discountINR)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sejal-text-secondary)' }}>
                  <span>White-Glove Insured Delivery</span>
                  <span style={{ color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>COMPLIMENTARY</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sejal-text-secondary)' }}>
                  <span>Signature Packaging</span>
                  <span style={{ color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>COMPLIMENTARY</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--sejal-espresso)',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--sejal-border-light)',
                    marginTop: '8px',
                  }}
                >
                  <span>Grand Total</span>
                  <span>{formatPrice(cart.totalINR)}</span>
                </div>
              </div>

              {/* Privé Invitation Code Bar */}
              <div style={{ marginBottom: '24px' }}>
                {cart.appliedCoupon ? (
                  <div
                    style={{
                      backgroundColor: '#EFF8F3',
                      border: '1px solid var(--sejal-success)',
                      padding: '10px 14px',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.785rem',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--sejal-success)' }}>
                        {cart.appliedCoupon.code}
                      </span>
                      <span style={{ marginLeft: '6px', color: 'var(--sejal-text-secondary)' }}>
                        (-{formatPrice(cart.discountINR)})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      style={{ background: 'none', border: 'none', color: 'var(--sejal-error)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Privé Code (e.g. PRIVEVIP)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        fontSize: '0.785rem',
                        border: '1px solid var(--sejal-border)',
                        borderRadius: '2px',
                        outline: 'none',
                        textTransform: 'uppercase',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '10px 16px',
                        backgroundColor: 'var(--sejal-espresso)',
                        color: 'var(--sejal-cream)',
                        border: 'none',
                        borderRadius: '2px',
                        fontSize: '0.725rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      APPLY
                    </button>
                  </form>
                )}
              </div>

              {/* Checkout Button */}
              <a
                href="/checkout"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--sejal-espresso)',
                  color: 'var(--sejal-cream)',
                  padding: '16px',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(26, 18, 21, 0.25)',
                }}
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight size={16} color="#F5E6D3" />
              </a>

              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: 'var(--sejal-text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="var(--sejal-rose-gold)" />
                  <span>256-Bit Encrypted Secure Checkout</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Gift size={14} color="var(--sejal-rose-gold)" />
                  <span>Includes Signature Rigid Coffret Packaging</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
