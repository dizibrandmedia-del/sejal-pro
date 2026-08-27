import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, Crown, Calendar, Plus, Edit2, Trash2, ShieldCheck, Sparkles, LogOut, Check, Truck, RotateCcw, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { apiClient } from '../services/apiClient';
import { Address } from '../types/customer';
import { Order } from '../types/order';
import { ReturnRequest } from '../types/returns';
import { ProductCard } from '../components/product/ProductCard/ProductCard';
import { Modal } from '../components/ui/Modal/Modal';
import { Input, Select, Checkbox } from '../components/ui/Form/Form';
import { Button } from '../components/ui/Button/Button';
import { Price } from '../components/ui/Price/Price';
import { Breadcrumb } from '../components/common/Breadcrumb/Breadcrumb';
import { ReturnRequestModal } from '../components/returns/ReturnRequestModal';

export const AccountPage: React.FC = () => {
  const { isAuthenticated, customer, logout, updateProfile, openAuthModal } = useAuth();
  const { wishlistProducts } = useWishlist();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = (searchParams.get('tab') as any) || 'profile';

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'returns' | 'addresses' | 'wishlist' | 'prive' | 'concierge'>(initialTab);

  // Live Orders & Returns
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnsList, setReturnsList] = useState<ReturnRequest[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Return Modal State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);

  // Address State & Modal
  const [addresses, setAddresses] = useState<Address[]>(() => addressService.getAddresses());
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [addrLabel, setAddrLabel] = useState<'Home' | 'Work' | 'Boutique' | 'Other'>('Home');
  const [addrName, setAddrName] = useState(customer ? `${customer.firstName} ${customer.lastName}` : '');
  const [addrPhone, setAddrPhone] = useState(customer?.phoneNumber || '');
  const [addrCountry, setAddrCountry] = useState('India');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPostal, setAddrPostal] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  // Concierge Form
  const [conciergeService, setConciergeService] = useState<'Bespoke Haute Joaillerie' | 'Private Styling & Wardrobe' | 'Royal Gifting & Bridal Registry' | 'High Horology Consultation'>('Bespoke Haute Joaillerie');
  const [conciergeContactType, setConciergeContactType] = useState<'WhatsApp' | 'Phone Call' | 'Private Salon Visit' | 'Virtual Video Appointment'>('Private Salon Visit');
  const [conciergeDate, setConciergeDate] = useState('2026-09-05');
  const [conciergeNotes, setConciergeNotes] = useState('');
  const [isConciergeSubmitted, setIsConciergeSubmitted] = useState(false);

  // Profile Edit State
  const [profileFirstName, setProfileFirstName] = useState(customer?.firstName || '');
  const [profileLastName, setProfileLastName] = useState(customer?.lastName || '');
  const [profilePhone, setProfilePhone] = useState(customer?.phoneNumber || '');
  const [profileBirthday, setProfileBirthday] = useState(customer?.birthday || '');

  // Load live orders and returns from backend API
  const loadData = async () => {
    if (!customer) return;
    setIsLoadingOrders(true);
    try {
      const fetchedOrders = await orderService.getOrders(customer.email);
      setOrders(fetchedOrders);

      const returnsRes = await apiClient.getReturns(customer.email);
      if (returnsRes.data) {
        setReturnsList(returnsRes.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [customer]);

  if (!isAuthenticated || !customer) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', marginBottom: '12px' }}>
          Please Sign In to Access MY SEJAL
        </h2>
        <p style={{ color: 'var(--sejal-text-secondary)', marginBottom: '24px' }}>
          Your private salon dashboard, orders, and destinations are protected by privileged access.
        </p>
        <Button onClick={openAuthModal} size="lg">
          SIGN IN / REGISTER
        </Button>
      </div>
    );
  }

  const handleOpenNewAddressModal = () => {
    setEditingAddress(null);
    setAddrLabel('Home');
    setAddrName(`${customer.firstName} ${customer.lastName}`);
    setAddrPhone(customer.phoneNumber);
    setAddrCountry('India');
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('');
    setAddrState('');
    setAddrPostal('');
    setAddrDefault(false);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddrLabel(addr.label);
    setAddrName(addr.recipientName);
    setAddrPhone(addr.phoneNumber);
    setAddrCountry(addr.country);
    setAddrLine1(addr.addressLine1);
    setAddrLine2(addr.addressLine2 || '');
    setAddrCity(addr.city);
    setAddrState(addr.stateProvince);
    setAddrPostal(addr.postalCode);
    setAddrDefault(addr.isDefault);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      const updated = addressService.updateAddress(editingAddress.id, {
        label: addrLabel,
        recipientName: addrName,
        phoneNumber: addrPhone,
        country: addrCountry,
        addressLine1: addrLine1,
        addressLine2: addrLine2,
        city: addrCity,
        stateProvince: addrState,
        postalCode: addrPostal,
        isDefault: addrDefault,
      });
      setAddresses(updated);
      showToast('Address Updated', 'Shipping destination saved.', 'success');
    } else {
      addressService.addAddress({
        label: addrLabel,
        recipientName: addrName,
        phoneNumber: addrPhone,
        country: addrCountry,
        addressLine1: addrLine1,
        addressLine2: addrLine2,
        city: addrCity,
        stateProvince: addrState,
        postalCode: addrPostal,
        isDefault: addrDefault,
      });
      setAddresses(addressService.getAddresses());
      showToast('Address Added', 'New destination added to your vault.', 'success');
    }
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addressService.deleteAddress(id);
    setAddresses(updated);
    showToast('Address Deleted', 'Destination removed.', 'info');
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addressService.setDefault(id);
    setAddresses(updated);
    showToast('Default Address Set', 'Primary shipping destination updated.', 'success');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName: profileFirstName,
      lastName: profileLastName,
      phoneNumber: profilePhone,
      birthday: profileBirthday,
    });
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you wish to cancel this order reservation?')) return;
    try {
      await orderService.cancelOrder(orderId, 'Customer cancellation via dashboard');
      showToast('Order Cancelled', 'Your reservation was cancelled and funds released.', 'info');
      loadData();
    } catch (err: any) {
      showToast('Cancellation Error', err.message, 'error');
    }
  };

  const handleOpenReturnModal = (order: Order) => {
    setSelectedOrderForReturn(order);
    setIsReturnModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '96px' }}>
      <div className="container" style={{ paddingTop: '24px' }}>
        <Breadcrumb items={[{ label: 'My SEJAL Account' }]} />

        {/* Header Title */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0 32px 0', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 600, display: 'block' }}>
              SANCTUARY VAULT
            </span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: 'var(--sejal-espresso)', margin: 0 }}>
              Welcome, {customer.firstName} {customer.lastName}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#1A1215', color: '#D4AF37', border: '1px solid #D4AF37', padding: '6px 14px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>
              <Crown size={14} color="#D4AF37" />
              <span>{customer.priveTier.toUpperCase()}</span>
            </div>

            <button
              onClick={logout}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--sejal-border)',
                padding: '8px 14px',
                borderRadius: '2px',
                fontSize: '0.75rem',
                color: 'var(--sejal-espresso)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Sidebar Menu */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border-light)', borderRadius: '2px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'profile', label: 'Personal Profile', icon: <User size={16} /> },
              { id: 'orders', label: `Order Vault (${orders.length})`, icon: <Package size={16} /> },
              { id: 'returns', label: `Returns & QC (${returnsList.length})`, icon: <RotateCcw size={16} /> },
              { id: 'addresses', label: 'Saved Destinations', icon: <MapPin size={16} /> },
              { id: 'wishlist', label: `Wishlist (${wishlistProducts.length})`, icon: <Heart size={16} /> },
              { id: 'prive', label: 'SEJAL Privé Status', icon: <Crown size={16} /> },
              { id: 'concierge', label: 'White-Glove Concierge', icon: <Calendar size={16} /> },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: '2px',
                    backgroundColor: isSelected ? '#1A1215' : 'transparent',
                    color: isSelected ? '#FAF6F0' : 'var(--sejal-espresso)',
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 600 : 400,
                    letterSpacing: '0.04em',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ color: isSelected ? '#D4AF37' : 'var(--sejal-rose-gold)' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--sejal-border)', borderRadius: '2px', padding: '36px', boxShadow: 'var(--shadow-sm)' }}>
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', marginBottom: '8px', color: 'var(--sejal-espresso)' }}>
                  Personal Client Profile
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-muted)', marginBottom: '24px' }}>
                  Manage your contact information, anniversaries, and communication preferences.
                </p>

                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '540px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <Input label="First Name" value={profileFirstName} onChange={(e) => setProfileFirstName(e.target.value)} required />
                    <Input label="Last Name" value={profileLastName} onChange={(e) => setProfileLastName(e.target.value)} required />
                  </div>

                  <Input label="Email Address" type="email" value={customer.email} disabled helperText="Email address is protected by SEJAL Privé security." />
                  <Input label="Phone Number" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} required />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <Input label="Birthday (for Privé Gift)" type="date" value={profileBirthday} onChange={(e) => setProfileBirthday(e.target.value)} />
                    <Select
                      label="Preferred Currency"
                      options={[
                        { label: 'Indian Rupee (₹ INR)', value: 'INR' },
                        { label: 'US Dollar ($ USD)', value: 'USD' },
                        { label: 'UAE Dirham (AED)', value: 'AED' },
                        { label: 'Australian Dollar (A$ AUD)', value: 'AUD' },
                      ]}
                      value={customer.preferredCurrency}
                      onChange={(e) => updateProfile({ preferredCurrency: e.target.value as any })}
                    />
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <Button type="submit" size="md">
                      SAVE PREFERENCES
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. Orders History Vault */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', color: 'var(--sejal-espresso)', margin: 0 }}>
                    Order History & Vault
                  </h3>
                  <button onClick={loadData} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--sejal-rose-gold)', cursor: 'pointer', textDecoration: 'underline' }}>
                    Refresh Records
                  </button>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-muted)', marginBottom: '24px' }}>
                  Authoritative order states, tracking timelines, and invoice records.
                </p>

                {orders.length === 0 ? (
                  <p style={{ color: 'var(--sejal-text-secondary)' }}>No orders logged in your vault.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          border: '1px solid var(--sejal-border-light)',
                          borderRadius: '2px',
                          padding: '20px',
                          backgroundColor: '#FAF6F0',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--sejal-border-light)', paddingBottom: '12px', marginBottom: '14px', gap: '10px' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--sejal-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                              REFERENCE NUMBER:
                            </span>
                            <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '1rem', color: 'var(--sejal-espresso)', marginLeft: '6px' }}>
                              {ord.orderNumber}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-secondary)' }}>
                              {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span style={{ backgroundColor: 'var(--sejal-espresso)', color: '#FAF6F0', padding: '3px 8px', borderRadius: '2px', fontSize: '0.6875rem', fontWeight: 600 }}>
                              {ord.orderStatus.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                          {ord.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img src={item.imageUrl} alt={item.productName} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '2px' }} />
                                <div>
                                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--sejal-espresso)' }}>
                                    {item.productName}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)', display: 'block' }}>
                                    Qty: {item.quantity} • {item.selectedOptionsText}
                                  </span>
                                </div>
                              </div>
                              <Price amountINR={item.totalINR} size="sm" />
                            </div>
                          ))}
                        </div>

                        {/* Order Actions Footer */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--sejal-border-light)', paddingTop: '12px', gap: '10px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--sejal-espresso)', fontSize: '0.875rem' }}>
                            Total: {formatPrice(ord.totalINR)}
                          </span>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <a href={`/track/${ord.id}`}>
                              <Button variant="outline" size="sm" leftIcon={<Truck size={14} />}>
                                TRACK ORDER
                              </Button>
                            </a>

                            {ord.orderStatus === 'Delivered' && (
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<RotateCcw size={14} />}
                                onClick={() => handleOpenReturnModal(ord)}
                              >
                                REQUEST RETURN
                              </Button>
                            )}

                            {['Payment Pending', 'Confirmed', 'Processing'].includes(ord.orderStatus) && (
                              <button
                                onClick={() => handleCancelOrder(ord.id)}
                                style={{ background: 'none', border: '1px solid var(--sejal-error)', color: 'var(--sejal-error)', padding: '6px 12px', fontSize: '0.725rem', fontWeight: 600, borderRadius: '2px', cursor: 'pointer' }}
                              >
                                CANCEL
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Returns & Quality Check Tab */}
            {activeTab === 'returns' && (
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', marginBottom: '8px', color: 'var(--sejal-espresso)' }}>
                  Returns & Quality Inspections
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-muted)', marginBottom: '24px' }}>
                  Track your return requests, quality check verdicts, and refund authorizations.
                </p>

                {returnsList.length === 0 ? (
                  <p style={{ color: 'var(--sejal-text-secondary)' }}>No active return requests.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {returnsList.map((ret) => (
                      <div
                        key={ret.id}
                        style={{
                          border: '1px solid var(--sejal-border-light)',
                          borderRadius: '2px',
                          padding: '20px',
                          backgroundColor: '#FAF6F0',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--sejal-border-light)', paddingBottom: '10px', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--sejal-text-muted)', letterSpacing: '0.1em' }}>RETURN ID:</span>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--sejal-espresso)', marginLeft: '6px' }}>{ret.id}</span>
                            <span style={{ marginLeft: '12px', fontSize: '0.75rem', color: 'var(--sejal-text-secondary)' }}>Order: {ret.orderNumber}</span>
                          </div>

                          <span style={{ backgroundColor: ret.status === 'Refund Completed' ? '#EFF8F3' : '#FAF0F2', color: ret.status === 'Refund Completed' ? 'var(--sejal-success)' : 'var(--sejal-rose-gold)', border: '1px solid currentColor', padding: '3px 8px', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 600 }}>
                            {ret.status.toUpperCase()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                          {ret.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                              <span>{item.productName} ({item.variantTitle}) — <em>{item.reason}</em></span>
                              <strong>₹{item.refundEligibleAmountINR.toLocaleString('en-IN')}</strong>
                            </div>
                          ))}
                        </div>

                        {ret.statusHistory.length > 0 && (
                          <div style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '2px', fontSize: '0.75rem', color: 'var(--sejal-text-secondary)', border: '1px solid var(--sejal-border-light)' }}>
                            <strong>Latest Update:</strong> {ret.statusHistory[ret.statusHistory.length - 1].note || ret.status}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Saved Destinations */}
            {activeTab === 'addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', margin: 0, color: 'var(--sejal-espresso)' }}>
                      Saved Destinations
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-muted)', marginTop: '2px' }}>
                      Armoured courier delivery destinations for your private residences.
                    </p>
                  </div>

                  <Button onClick={handleOpenNewAddressModal} size="sm" leftIcon={<Plus size={14} />}>
                    ADD DESTINATION
                  </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={{
                        border: `1px solid ${addr.isDefault ? 'var(--sejal-rose-gold)' : 'var(--sejal-border)'}`,
                        backgroundColor: addr.isDefault ? '#FAF0F2' : '#FFFFFF',
                        borderRadius: '2px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sejal-rose-gold)', fontWeight: 700 }}>
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span style={{ backgroundColor: 'var(--sejal-espresso)', color: '#FAF6F0', fontSize: '0.625rem', padding: '2px 6px', borderRadius: '2px' }}>
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'var(--sejal-espresso)', margin: '0 0 6px 0' }}>
                          {addr.recipientName}
                        </h5>

                        <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                          {addr.addressLine1} <br />
                          {addr.addressLine2 && <>{addr.addressLine2}<br /></>}
                          {addr.city}, {addr.stateProvince} {addr.postalCode} <br />
                          {addr.country}
                        </p>

                        <span style={{ fontSize: '0.75rem', color: 'var(--sejal-text-muted)' }}>
                          Phone: {addr.phoneNumber}
                        </span>
                      </div>

                      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--sejal-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--sejal-rose-gold)', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              Set as Default
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleEditAddress(addr)} style={{ background: 'none', border: 'none', color: 'var(--sejal-espresso)', cursor: 'pointer', padding: '4px' }}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'none', border: 'none', color: 'var(--sejal-error)', cursor: 'pointer', padding: '4px' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', marginBottom: '8px', color: 'var(--sejal-espresso)' }}>
                  Curated Wishlist ({wishlistProducts.length})
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-muted)', marginBottom: '24px' }}>
                  Saved fine creations awaiting your reservation.
                </p>

                {wishlistProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ color: 'var(--sejal-text-secondary)', marginBottom: '16px' }}>Your wishlist is currently empty.</p>
                    <a href="/shop">
                      <Button size="md">DISCOVER CREATIONS</Button>
                    </a>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                    {wishlistProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. Privé Status Tab */}
            {activeTab === 'prive' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Crown size={22} color="#D4AF37" />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.85rem', color: 'var(--sejal-espresso)', margin: 0 }}>
                    Privé Salon Status: {customer.priveTier}
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-muted)', marginBottom: '28px' }}>
                  By-invitation-only membership tier with bespoke commissions and private salon privileges.
                </p>

                <div style={{ backgroundColor: '#1A1215', color: '#FAF6F0', padding: '28px', borderRadius: '2px', marginBottom: '28px', border: '1px solid #D4AF37' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4AF37' }}>
                        AVAILABLE PRIVÉ REWARDS
                      </span>
                      <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: '#FFFFFF', margin: '4px 0 0 0' }}>
                        {customer.privePoints.toLocaleString('en-IN')} pts
                      </h4>
                    </div>

                    <Button variant="prive" size="sm" onClick={() => setActiveTab('concierge')}>
                      REDEEM WITH CONCIERGE
                    </Button>
                  </div>
                  <p style={{ fontSize: '0.785rem', color: '#D8A7B1', margin: 0 }}>
                    Points convert to private styling vouchers, diamond appraisal services, or bespoke travel allocations.
                  </p>
                </div>
              </div>
            )}

            {/* 7. Concierge Tab */}
            {activeTab === 'concierge' && (
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', marginBottom: '8px', color: 'var(--sejal-espresso)' }}>
                  White-Glove Salon Concierge
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--sejal-text-muted)', marginBottom: '24px' }}>
                  Schedule a private styling appointment, bridal registry curation, or bespoke high joaillerie consultation.
                </p>

                {isConciergeSubmitted ? (
                  <div style={{ backgroundColor: '#EFF8F3', border: '1px solid var(--sejal-success)', padding: '24px', borderRadius: '2px', textAlign: 'center' }}>
                    <Check size={28} color="var(--sejal-success)" style={{ margin: '0 auto 8px auto' }} />
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: 'var(--sejal-espresso)' }}>
                      Appointment Request Received
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--sejal-text-secondary)', margin: '4px 0 16px 0' }}>
                      Your dedicated concierge advisor will contact you via your preferred channel within 4 hours.
                    </p>
                    <Button onClick={() => setIsConciergeSubmitted(false)} size="sm">
                      BOOK ANOTHER CONSULTATION
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setIsConciergeSubmitted(true); showToast('Appointment Logged', 'Advisor assigned.', 'luxury'); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '540px' }}>
                    <Select
                      label="Service Requested"
                      options={[
                        { label: 'Bespoke Haute Joaillerie Commission', value: 'Bespoke Haute Joaillerie' },
                        { label: 'Private Wardrobe Styling & Silk Drapes', value: 'Private Styling & Wardrobe' },
                        { label: 'Royal Gifting & Bridal Registry', value: 'Royal Gifting & Bridal Registry' },
                        { label: 'High Horology Swiss Watch Consultation', value: 'High Horology Consultation' },
                      ]}
                      value={conciergeService}
                      onChange={(e) => setConciergeService(e.target.value as any)}
                    />

                    <Select
                      label="Preferred Meeting Format"
                      options={[
                        { label: 'Private Flagship Salon Visit (Mumbai / Dubai)', value: 'Private Salon Visit' },
                        { label: 'Confidential Phone Consultation', value: 'Phone Call' },
                        { label: 'Private Styling WhatsApp Liaison', value: 'WhatsApp' },
                        { label: 'Virtual Video Salon', value: 'Virtual Video Appointment' },
                      ]}
                      value={conciergeContactType}
                      onChange={(e) => setConciergeContactType(e.target.value as any)}
                    />

                    <Input label="Preferred Date" type="date" value={conciergeDate} onChange={(e) => setConciergeDate(e.target.value)} required />

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sejal-espresso)', marginBottom: '6px', fontWeight: 500 }}>
                        Specific Styling Notes:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Inquiring about a 4-carat cushion cut solitaire..."
                        value={conciergeNotes}
                        onChange={(e) => setConciergeNotes(e.target.value)}
                        style={{ width: '100%', padding: '12px', fontSize: '0.8125rem', border: '1px solid var(--sejal-border)', borderRadius: '2px', outline: 'none' }}
                      />
                    </div>

                    <Button type="submit" size="lg">
                      SUBMIT CONCIERGE APPOINTMENT
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddress ? 'EDIT DESTINATION' : 'ADD NEW DESTINATION'}
        subtitle="Armoured courier delivery address for your selections."
      >
        <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Select
            label="Address Label"
            options={[
              { label: 'Home Residence', value: 'Home' },
              { label: 'Private Salon / Atelier', value: 'Boutique' },
              { label: 'Executive Office', value: 'Work' },
              { label: 'Other Residence', value: 'Other' },
            ]}
            value={addrLabel}
            onChange={(e) => setAddrLabel(e.target.value as any)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Recipient Name" value={addrName} onChange={(e) => setAddrName(e.target.value)} required />
            <Input label="Phone Number" value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} required />
          </div>

          <Select
            label="Country"
            options={[
              { label: 'India', value: 'India' },
              { label: 'United Arab Emirates', value: 'United Arab Emirates' },
              { label: 'United States', value: 'United States' },
              { label: 'Australia', value: 'Australia' },
            ]}
            value={addrCountry}
            onChange={(e) => setAddrCountry(e.target.value)}
          />

          <Input label="Address Line 1" value={addrLine1} onChange={(e) => setAddrLine1(e.target.value)} required />
          <Input label="Address Line 2 (Optional)" value={addrLine2} onChange={(e) => setAddrLine2(e.target.value)} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <Input label="City" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} required />
            <Input label="State / Province" value={addrState} onChange={(e) => setAddrState(e.target.value)} required />
            <Input label="Postal / PIN Code" value={addrPostal} onChange={(e) => setAddrPostal(e.target.value)} required />
          </div>

          <Checkbox label="Set as default shipping destination" checked={addrDefault} onChange={(e) => setAddrDefault(e.target.checked)} />

          <Button type="submit" fullWidth size="lg">
            SAVE DESTINATION
          </Button>
        </form>
      </Modal>

      {/* Return Request Modal */}
      <ReturnRequestModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        order={selectedOrderForReturn}
        onReturnSubmitted={loadData}
      />
    </div>
  );
};
