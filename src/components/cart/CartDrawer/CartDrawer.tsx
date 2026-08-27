import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Drawer } from '../../ui/Drawer/Drawer';
import { Price } from '../../ui/Price/Price';
import { GiftPackagingOption } from '../GiftPackagingOption/GiftPackagingOption';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useCurrency } from '../../../context/CurrencyContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
    setGiftPackaging,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim());
    setCouponInput('');
  };

  const handleSaveForLater = (productId: string, itemId: string) => {
    if (!isInWishlist(productId)) {
      toggleWishlist(productId);
    }
    removeItem(itemId);
  };

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={closeCartDrawer}
      title="YOUR SEJAL SELECTION"
      subtitle={`${cart.itemCount} ${cart.itemCount === 1 ? 'Masterpiece' : 'Masterpieces'} Reserved`}
      width="500px"
    >
      {cart.items.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
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
              marginBottom: '16px',
            }}
          >
            <ShoppingBag size={28} />
          </div>

          <h4
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.75rem',
              fontWeight: 500,
              color: 'var(--sejal-espresso)',
              marginBottom: '8px',
            }}
          >
            Your Selection is Empty
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--sejal-text-secondary)', maxWidth: '300px', marginBottom: '24px' }}>
            Discover our latest limited creations and fine jewellery collections.
          </p>

          <a
            href="/shop"
            onClick={closeCartDrawer}
            style={{
              backgroundColor: 'var(--sejal-espresso)',
              color: 'var(--sejal-cream)',
              padding: '12px 32px',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              borderRadius: '2px',
            }}
          >
            EXPLORE THE EDIT
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Item List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.items.map((item) => {
              const primaryImg = item.product.media[0]?.url;
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '84px 1fr',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--sejal-border-light)',
                  }}
                >
                  {/* Thumbnail */}
                  <a
                    href={`/product/${item.product.slug}`}
                    onClick={closeCartDrawer}
                    style={{
                      aspectRatio: '3/4',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      backgroundColor: '#FAF6F0',
                    }}
                  >
                    <img src={primaryImg} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </a>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
                          {item.product.brand}
                        </span>
                        <h5
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '1.15rem',
                            fontWeight: 600,
                            color: 'var(--sejal-espresso)',
                            margin: '2px 0 4px 0',
                            lineHeight: 1.25,
                          }}
                        >
                          {item.product.name}
                        </h5>
                        <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)' }}>
                          {item.variant.title}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--sejal-text-muted)', cursor: 'pointer', padding: '4px' }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Quantity Stepper */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--sejal-border)',
                          borderRadius: '2px',
                          height: '32px',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ width: '28px', height: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.8125rem', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ width: '28px', height: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>

                      {/* Line Price */}
                      <Price amountINR={item.variant.priceINR * item.quantity} size="md" />
                    </div>

                    {/* Move to Wishlist Link */}
                    <div style={{ marginTop: '6px' }}>
                      <button
                        onClick={() => handleSaveForLater(item.productId, item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '0.7rem',
                          color: 'var(--sejal-text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0,
                        }}
                      >
                        <Heart size={11} />
                        <span>Move to Wishlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Gift Packaging Option */}
            <GiftPackagingOption giftPackaging={cart.giftPackaging} onChange={setGiftPackaging} />

            {/* Privé Invitation Code Bar */}
            <div style={{ marginTop: '14px' }}>
              {cart.appliedCoupon ? (
                <div
                  style={{
                    backgroundColor: '#EFF8F3',
                    border: '1px solid var(--sejal-success)',
                    padding: '8px 12px',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--sejal-success)' }}>
                      {cart.appliedCoupon.code}
                    </span>
                    <span style={{ marginLeft: '8px', color: 'var(--sejal-text-secondary)' }}>
                      (-{formatPrice(cart.discountINR)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ background: 'none', border: 'none', color: 'var(--sejal-error)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter Privé Code (e.g. PRIVEVIP)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '0.75rem',
                      border: '1px solid var(--sejal-border)',
                      borderRadius: '2px',
                      outline: 'none',
                      textTransform: 'uppercase',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'var(--sejal-espresso)',
                      color: 'var(--sejal-cream)',
                      border: 'none',
                      borderRadius: '2px',
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    APPLY
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer Totals & Checkout CTA */}
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: '#FAF6F0',
              borderTop: '1px solid var(--sejal-border)',
            }}
          >
            {/* Calculation Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sejal-text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotalINR)}</span>
              </div>

              {cart.discountINR > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--sejal-success)' }}>
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
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--sejal-espresso)',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--sejal-border-light)',
                  marginTop: '4px',
                }}
              >
                <span>Estimated Total</span>
                <span>{formatPrice(cart.totalINR)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <a
              href="/checkout"
              onClick={closeCartDrawer}
              style={{
                width: '100%',
                backgroundColor: 'var(--sejal-espresso)',
                color: 'var(--sejal-cream)',
                padding: '14px',
                fontSize: '0.8125rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(26, 18, 21, 0.2)',
                transition: 'background-color 0.2s',
              }}
            >
              <span>PROCEED TO SECURE CHECKOUT</span>
              <ArrowRight size={16} color="#F5E6D3" />
            </a>

            <span style={{ display: 'block', textAlign: 'center', fontSize: '0.6875rem', color: 'var(--sejal-text-muted)', marginTop: '8px' }}>
              🔒 256-Bit Encrypted Luxury Checkout • Worldwide Insured
            </span>
          </div>
        </div>
      )}
    </Drawer>
  );
};
