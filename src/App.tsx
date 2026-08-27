import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/common/AnnouncementBar/AnnouncementBar';
import { Header } from './components/common/Header/Header';
import { Footer } from './components/common/Footer/Footer';
import { MobileNav } from './components/common/MobileNav/MobileNav';
import { CartDrawer } from './components/cart/CartDrawer/CartDrawer';
import { SearchModal } from './components/search/SearchModal/SearchModal';
import { AuthModal } from './components/auth/AuthModal/AuthModal';
import { ToastContainer } from './components/common/Toast/ToastContainer';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { StoryPage } from './pages/StoryPage';
import { PrivePage } from './pages/PrivePage';
import { GiftingPage } from './pages/GiftingPage';
import { JournalPage } from './pages/JournalPage';
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { DynamicLandingPage } from './pages/DynamicLandingPage';

// Admin & Development Pages
import { AdminPortalPage } from './pages/admin/AdminPortalPage';
import { CommerceTestingCockpit } from './components/dev/CommerceTestingCockpit';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setIsMobileNavOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Intercept anchor clicks for seamless SPA transitions
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href) {
        const url = new URL(target.href);
        if (url.origin === window.location.origin && !target.hasAttribute('download') && target.target !== '_blank') {
          if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
            e.preventDefault();
            window.history.pushState({}, '', url.pathname + url.search);
            setCurrentPath(url.pathname);
            setIsMobileNavOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const isAdminRoute = currentPath.startsWith('/admin');
  const isCheckout = currentPath === '/checkout';

  // Router dispatcher
  const renderCurrentPage = () => {
    // 1. Admin Portal
    if (isAdminRoute) {
      return <AdminPortalPage />;
    }

    // 2. Testing Cockpit
    if (currentPath === '/testing-cockpit') {
      return <CommerceTestingCockpit />;
    }

    // 3. Core Storefront Routes
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }
    if (currentPath === '/shop' || currentPath.startsWith('/category') || currentPath.startsWith('/collections')) {
      return <ShopPage />;
    }
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      return <ProductDetailPage slug={slug} />;
    }
    if (currentPath === '/cart') {
      return <CartPage />;
    }
    if (currentPath === '/checkout') {
      return <CheckoutPage />;
    }
    if (currentPath.startsWith('/order-success')) {
      const id = currentPath.replace('/order-success/', '');
      return <OrderSuccessPage orderId={id} />;
    }
    if (currentPath.startsWith('/track/')) {
      const id = currentPath.replace('/track/', '');
      return <OrderTrackingPage orderId={id} />;
    }
    if (currentPath === '/account') {
      return <AccountPage />;
    }
    if (currentPath === '/wishlist') {
      return <WishlistPage />;
    }
    if (currentPath === '/story' || currentPath === '/about') {
      return <StoryPage />;
    }
    if (currentPath === '/prive') {
      return <PrivePage />;
    }
    if (currentPath === '/gifting') {
      return <GiftingPage />;
    }
    if (currentPath === '/journal') {
      return <JournalPage />;
    }
    if (currentPath === '/search') {
      return <SearchPage />;
    }

    // 4. Dynamic CMS Landing Pages (e.g. /bridal-edit, /festive-edit, /uae-luxury)
    const customSlug = currentPath.replace(/^\//, '');
    if (customSlug && !customSlug.includes('/')) {
      return <DynamicLandingPage slug={customSlug} />;
    }

    return <NotFoundPage />;
  };

  if (isAdminRoute) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B1120' }}>
        {renderCurrentPage()}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* 1. Global Announcement Bar */}
      {!isCheckout && <AnnouncementBar />}

      {/* 2. Desktop & Mobile Header */}
      {!isCheckout && (
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          currentPath={currentPath}
        />
      )}

      {/* 3. Main Page Content */}
      <div style={{ flex: 1 }}>{renderCurrentPage()}</div>

      {/* 4. Global Footer */}
      {!isCheckout && <Footer />}

      {/* 5. Mobile Dock */}
      {!isCheckout && (
        <MobileNav
          isMenuOpen={isMobileNavOpen}
          onCloseMenu={() => setIsMobileNavOpen(false)}
          onOpenSearch={() => setIsSearchOpen(true)}
          currentPath={currentPath}
        />
      )}

      {/* 6. Global Overlays & Modals */}
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};
