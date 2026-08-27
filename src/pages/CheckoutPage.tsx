import React, { useState, useEffect } from 'react';
import { Lock, CreditCard, Landmark, Sparkles, ChevronLeft, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Logo } from '../components/ui/Logo/Logo';
import { Input, Select, Checkbox } from '../components/ui/Form/Form';
import { Button } from '../components/ui/Button/Button';
import { Price } from '../components/ui/Price/Price';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { activePaymentProvider } from '../services/providers/paymentProvider';
import { apiClient } from '../services/apiClient';
import { Address } from '../types/customer';
import { ShippingMethod, PaymentMethodType, Order } from '../types/order';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { customer } = useAuth();
  const { currency, currencyConfig, formatPrice } = useCurrency();
  const { showToast } = useToast();

  const savedAddresses = addressService.getAddresses();
  const defaultAddress = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];

  // Steps: 1: Contact & Shipping, 2: Payment Gateway, 3: Failure Recovery
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [email, setEmail] = useState(customer?.email || 'vip@sejal.pro');
  const [phone, setPhone] = useState(customer?.phoneNumber || '+91 8005056531');
  const [name, setName] = useState(customer ? `${customer.firstName} ${customer.lastName}` : 'Sejal Gupta');

  // Address State
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>(defaultAddress?.id || 'new');
  const [country, setCountry] = useState(defaultAddress?.country || 'India');
  const [addressLine1, setAddressLine1] = useState(defaultAddress?.addressLine1 || 'Villa 14, Royal Palm Residences');
  const [addressLine2, setAddressLine2] = useState(defaultAddress?.addressLine2 || 'Golf Course Road');
  const [city, setCity] = useState(defaultAddress?.city || 'Gurugram');
  const [stateProvince, setStateProvince] = useState(defaultAddress?.stateProvince || 'Haryana');
  const [postalCode, setPostalCode] = useState(defaultAddress?.postalCode || '122002');
  const [saveAddress, setSaveAddress] = useState(true);

  // Dynamic Shipping Rates from Server
  const [shippingRateOptions, setShippingRateOptions] = useState<any[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>({
    id: 'standard_white_glove',
    name: 'SEJAL Armoured White-Glove Hand-Delivery',
    description: 'Complimentary luxury courier handover',
    estimatedDelivery: '2–4 Business Days',
    priceINR: 0,
    insured: true,
  });

  // Active Server-Created Order
  const [serverOrder, setServerOrder] = useState<Order | null>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Fetch Shipping Rates when country or total changes
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await apiClient.getShippingRates(country, cart.totalINR);
        if (rates.data && rates.data.length > 0) {
          setShippingRateOptions(rates.data);
          const first = rates.data[0];
          setSelectedShippingMethod({
            id: first.serviceId,
            name: first.serviceName,
            description: first.estimatedDeliveryText,
            estimatedDelivery: first.estimatedDeliveryText,
            priceINR: first.priceINR,
            insured: true,
          });
        }
      } catch {
        // Fallback default
      }
    };

    fetchRates();
  }, [country, cart.totalINR]);

  const handleSavedAddressChange = (addressId: string) => {
    setSelectedSavedAddressId(addressId);
    if (addressId !== 'new') {
      const addr = savedAddresses.find((a) => a.id === addressId);
      if (addr) {
        setCountry(addr.country);
        setAddressLine1(addr.addressLine1);
        setAddressLine2(addr.addressLine2 || '');
        setCity(addr.city);
        setStateProvince(addr.stateProvince);
        setPostalCode(addr.postalCode);
      }
    }
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim() || !addressLine1.trim() || !city.trim() || !postalCode.trim()) {
      showToast('Validation Error', 'Please complete all required delivery fields.', 'error');
      return;
    }

    if (saveAddress && selectedSavedAddressId === 'new') {
      addressService.addAddress({
        label: 'Home',
        recipientName: name,
        phoneNumber: phone,
        country,
        addressLine1,
        addressLine2,
        city,
        stateProvince,
        postalCode,
        isDefault: false,
      });
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Create Server-Side Order with Inventory Reservation
      const shippingAddressObject: Address = {
        id: `addr_${Date.now()}`,
        label: 'Home',
        recipientName: name,
        phoneNumber: phone,
        country,
        addressLine1,
        addressLine2,
        city,
        stateProvince,
        postalCode,
        isDefault: false,
      };

      const createdOrder = await orderService.createServerOrder(
        cart,
        { name, email, phone, id: customer?.id },
        shippingAddressObject,
        selectedShippingMethod,
        paymentMethod,
        currency,
        currencyConfig.rateAgainstINR
      );

      setServerOrder(createdOrder);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast('Order Creation Error', err.message || 'Unable to reserve inventory.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!serverOrder) {
      showToast('Error', 'No active order session.', 'error');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Request Server-Side Razorpay Order
      const razorpayInit = await activePaymentProvider.initializePayment({
        orderId: serverOrder.id,
        orderAmountINR: serverOrder.totalINR,
        currency: 'INR',
        orderReference: serverOrder.orderNumber,
        customer: { name, email, phone },
      });

      // 2. Open Razorpay Checkout Modal and Verify Signature on Backend
      const result = await activePaymentProvider.processPayment({
        orderId: serverOrder.id,
        razorpayOrderId: razorpayInit.razorpayOrderId,
        keyId: razorpayInit.keyId,
        amountInSmallestUnit: razorpayInit.amountInSmallestUnit,
        orderReference: serverOrder.orderNumber,
        customer: { name, email, phone },
      });

      if (!result.success) {
        setPaymentError(result.error || 'Payment was declined or cancelled.');
        showToast('Payment Failed', result.error || 'Payment not captured.', 'error');
        return;
      }

      // 3. Clear Cart on authoritative success
      clearCart();

      // 4. Navigate to Verified Order Success Screen
      window.location.href = `/order-success/${serverOrder.id}`;
    } catch (err: any) {
      setPaymentError(err.message || 'Payment transaction failed.');
      showToast('Payment Error', err.message || 'Unable to complete transaction.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0 && !serverOrder && !isProcessing) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '12px' }}>
          Your Selection is Empty
        </h2>
        <p style={{ color: 'var(--sejal-text-secondary)', marginBottom: '24px' }}>
          Please add creations to your bag before proceeding to checkout.
        </p>
        <a href="/shop">
          <Button size="md">EXPLORE THE EDIT</Button>
        </a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* 1. Distraction-Free Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--sejal-border-light)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" aria-label="Return to SEJAL Home">
            <Logo variant="compact" size="sm" />
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--sejal-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <Lock size={14} color="var(--sejal-rose-gold)" />
            <span>256-Bit Encrypted Authoritative Checkout</span>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '36px', maxWidth: '1080px' }}>
        {/* Step Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: step >= 1 ? 'var(--sejal-espresso)' : '#E0D6D8',
                color: '#FAF6F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              1
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: step === 1 ? 700 : 500, color: 'var(--sejal-espresso)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Shipping Destination
            </span>
          </div>

          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--sejal-border)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: step === 2 ? 'var(--sejal-espresso)' : '#E0D6D8',
                color: '#FAF6F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              2
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: step === 2 ? 700 : 500, color: step === 2 ? 'var(--sejal-espresso)' : 'var(--sejal-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Payment & Verification
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Form / Payment Gateway */}
          <div>
            {step === 1 ? (
              <form onSubmit={handleProceedToPayment} style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '32px' }}>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.65rem',
                    fontWeight: 600,
                    color: 'var(--sejal-espresso)',
                    marginBottom: '20px',
                    borderBottom: '1px solid var(--sejal-border-light)',
                    paddingBottom: '10px',
                  }}
                >
                  Client & Hand-Delivery Details
                </h3>

                {savedAddresses.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <Select
                      label="Select Saved Address"
                      options={[
                        ...savedAddresses.map((a) => ({ label: `${a.label} — ${a.recipientName}, ${a.city}`, value: a.id })),
                        { label: '+ Enter New Shipping Address', value: 'new' },
                      ]}
                      value={selectedSavedAddressId}
                      onChange={(e) => handleSavedAddressChange(e.target.value)}
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input label="Phone (for Courier Handover)" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>

                <Input label="Email Address (for Receipt)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <Select
                  label="Country / Territory"
                  options={[
                    { label: 'India (Domestic Armoured)', value: 'India' },
                    { label: 'United Arab Emirates (DHL Luxury Express)', value: 'United Arab Emirates' },
                    { label: 'United States (FedEx Priority Air)', value: 'United States' },
                    { label: 'Australia (DHL Air Express)', value: 'Australia' },
                  ]}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />

                <Input label="Address Line 1" placeholder="Apartment, suite, villa, street" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required />
                <Input label="Address Line 2 (Optional)" placeholder="Building, floor, landmark" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                  <Input label="State / Province" value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} required />
                  <Input label="Postal / PIN Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                </div>

                {selectedSavedAddressId === 'new' && (
                  <Checkbox label="Save destination to my SEJAL address vault" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                )}

                {/* Dynamic Shipping Options */}
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--sejal-border-light)', paddingTop: '20px' }}>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: 'var(--sejal-espresso)', marginBottom: '12px' }}>
                    Shipping & Hand-Delivery Protocol
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {shippingRateOptions.map((opt) => {
                      const isSelected = selectedShippingMethod.id === opt.serviceId;
                      return (
                        <div
                          key={opt.serviceId}
                          onClick={() =>
                            setSelectedShippingMethod({
                              id: opt.serviceId,
                              name: opt.serviceName,
                              description: opt.estimatedDeliveryText,
                              estimatedDelivery: opt.estimatedDeliveryText,
                              priceINR: opt.priceINR,
                              insured: true,
                            })
                          }
                          style={{
                            padding: '14px 18px',
                            borderRadius: '2px',
                            border: isSelected ? '1px solid var(--sejal-rose-gold)' : '1px solid var(--sejal-border-light)',
                            backgroundColor: isSelected ? '#FAF0F2' : '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="radio" checked={isSelected} readOnly style={{ marginTop: '4px', accentColor: 'var(--sejal-rose-gold)' }} />
                            <div>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--sejal-espresso)', display: 'block' }}>
                                {opt.serviceName}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)' }}>
                                {opt.estimatedDeliveryText}
                              </span>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--sejal-rose-gold)' }}>
                            {opt.isFree ? 'COMPLIMENTARY' : formatPrice(opt.priceINR)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                  <Button type="submit" fullWidth size="lg" isLoading={isProcessing} rightIcon={<ArrowRight size={16} />}>
                    RESERVE & PROCEED TO PAYMENT
                  </Button>
                </div>
              </form>
            ) : (
              /* Step 2: Payment Gateway & Signature Verification */
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--sejal-border-light)', paddingBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
                      VAULT ORDER: {serverOrder?.orderNumber}
                    </span>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', fontWeight: 600, color: 'var(--sejal-espresso)', margin: '2px 0 0 0' }}>
                      Authorize Payment
                    </h3>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    style={{ background: 'none', border: 'none', color: 'var(--sejal-rose-gold)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ChevronLeft size={14} />
                    <span>Edit Destination</span>
                  </button>
                </div>

                {/* Error Banner / Retry Recovery */}
                {paymentError && (
                  <div
                    style={{
                      backgroundColor: '#FDEDEC',
                      border: '1px solid var(--sejal-error)',
                      borderRadius: '2px',
                      padding: '16px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <AlertCircle size={18} color="var(--sejal-error)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--sejal-error)', display: 'block' }}>
                        Payment Transaction Declined
                      </strong>
                      <p style={{ fontSize: '0.785rem', color: 'var(--sejal-text-secondary)', margin: '4px 0 8px 0' }}>
                        {paymentError}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--sejal-text-muted)' }}>
                        Your inventory reservation remains active. You can retry with another method without creating a duplicate order.
                      </span>
                    </div>
                  </div>
                )}

                {/* Gateway Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    style={{
                      padding: '12px',
                      borderRadius: '2px',
                      border: paymentMethod === 'razorpay' ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-border)',
                      backgroundColor: paymentMethod === 'razorpay' ? 'var(--sejal-espresso)' : '#FAF6F0',
                      color: paymentMethod === 'razorpay' ? '#FAF6F0' : 'var(--sejal-espresso)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Sparkles size={14} color="#D4AF37" />
                    <span>Razorpay Enterprise</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    style={{
                      padding: '12px',
                      borderRadius: '2px',
                      border: paymentMethod === 'credit_card' ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-border)',
                      backgroundColor: paymentMethod === 'credit_card' ? 'var(--sejal-espresso)' : '#FAF6F0',
                      color: paymentMethod === 'credit_card' ? '#FAF6F0' : 'var(--sejal-espresso)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <CreditCard size={14} />
                    <span>International Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking_upi')}
                    style={{
                      padding: '12px',
                      borderRadius: '2px',
                      border: paymentMethod === 'netbanking_upi' ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-border)',
                      backgroundColor: paymentMethod === 'netbanking_upi' ? 'var(--sejal-espresso)' : '#FAF6F0',
                      color: paymentMethod === 'netbanking_upi' ? '#FAF6F0' : 'var(--sejal-espresso)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Landmark size={14} />
                    <span>UPI / NetBanking</span>
                  </button>
                </div>

                <div style={{ backgroundColor: '#FAF6F0', border: '1px solid var(--sejal-border-light)', padding: '20px', borderRadius: '2px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Lock size={15} color="var(--sejal-rose-gold)" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--sejal-espresso)' }}>
                      Authoritative Server Verification
                    </span>
                  </div>
                  <p style={{ fontSize: '0.785rem', color: 'var(--sejal-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    Your order total of <strong>₹{serverOrder?.totalINR.toLocaleString('en-IN')}</strong> has been locked in the SEJAL vault. Clicking below launches the secure Razorpay tokenization window. Signature verification is cryptographically performed on the server.
                  </p>
                </div>

                <Button
                  onClick={handleRazorpayPayment}
                  fullWidth
                  size="lg"
                  isLoading={isProcessing}
                  rightIcon={paymentError ? <RefreshCw size={16} /> : <ArrowRight size={16} />}
                >
                  {paymentError ? 'RETRY AUTHORIZATION' : `PAY & CONFIRM (${formatPrice(serverOrder?.totalINR || cart.totalINR)})`}
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
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
                fontSize: '1.5rem',
                color: 'var(--sejal-espresso)',
                marginBottom: '16px',
                borderBottom: '1px solid var(--sejal-border-light)',
                paddingBottom: '10px',
              }}
            >
              Order Review ({cart.itemCount})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={item.product.media[0]?.url} alt={item.product.name} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: 'var(--sejal-espresso)', margin: 0 }}>
                      {item.product.name}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)' }}>
                      Qty: {item.quantity} • {item.variant.title}
                    </span>
                  </div>
                  <Price amountINR={item.variant.priceINR * item.quantity} size="sm" />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', borderTop: '1px solid var(--sejal-border-light)', paddingTop: '16px' }}>
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
                <span>Shipping ({selectedShippingMethod.name.split(' ')[0]})</span>
                <span style={{ color: 'var(--sejal-rose-gold)', fontWeight: 600 }}>
                  {selectedShippingMethod.priceINR === 0 ? 'COMPLIMENTARY' : formatPrice(selectedShippingMethod.priceINR)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 600, color: 'var(--sejal-espresso)', paddingTop: '12px', borderTop: '1px solid var(--sejal-border-light)', marginTop: '6px' }}>
                <span>Grand Total</span>
                <span>{formatPrice(cart.totalINR + selectedShippingMethod.priceINR)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
