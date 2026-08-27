import React, { useState, Component, ErrorInfo } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminLayout } from './AdminLayout';

// Sub-pages
import { AdminDashboard } from './AdminDashboard';
import { ProductListPage } from './catalogue/ProductListPage';
import { ProductEditorPage } from './catalogue/ProductEditorPage';
import { ProductTypeBuilderPage } from './catalogue/ProductTypeBuilderPage';
import { CategoryBuilderPage } from './catalogue/CategoryBuilderPage';
import { CollectionBuilderPage } from './catalogue/CollectionBuilderPage';
import { MediaLibraryPage } from './catalogue/MediaLibraryPage';
import { HomepageBuilderPage } from './cms/HomepageBuilderPage';
import { BannerManagerPage } from './cms/BannerManagerPage';
import { LandingPageBuilderPage } from './cms/LandingPageBuilderPage';
import { EditorialCMSPage } from './cms/EditorialCMSPage';
import { SEOManagerPage } from './cms/SEOManagerPage';
import { CouponManagerPage } from './marketing/CouponManagerPage';
import { CampaignManagerPage } from './marketing/CampaignManagerPage';
import { OrderOperationsPage } from './operations/OrderOperationsPage';
import { InventoryAdminPage } from './operations/InventoryAdminPage';
import { PaymentAdminPage } from './operations/PaymentAdminPage';
import { ShippingAdminPage } from './operations/ShippingAdminPage';
import { ReturnRefundAdminPage } from './operations/ReturnRefundAdminPage';
import { BulkOperationsPage } from './bulk/BulkOperationsPage';
import { CommerceTestingCockpit } from '../../components/dev/CommerceTestingCockpit';
import { RBACSettingsPage } from './settings/RBACSettingsPage';
import { AuditLogPage } from './settings/AuditLogPage';

// Phase 5 CRM, Growth & Analytics Pages
import { Customer360Page } from './crm/Customer360Page';
import { SegmentBuilderPage } from './crm/SegmentBuilderPage';
import { MarketingAutomationPage } from './crm/MarketingAutomationPage';
import { NotificationTemplatesPage } from './crm/NotificationTemplatesPage';
import { InfluencerManagerPage } from './crm/InfluencerManagerPage';
import { AffiliateManagerPage } from './crm/AffiliateManagerPage';
import { AdvancedAnalyticsPage } from './crm/AdvancedAnalyticsPage';
import { PersonalisationAdminPage } from './crm/PersonalisationAdminPage';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Portal Render Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #FECDD3', margin: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#9E1238', marginBottom: '8px' }}>
            Operational Module Notice
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '16px' }}>
            {this.state.error?.message || 'An unexpected render condition occurred.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminPortalPage: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  if (!isAuthenticated) {
    return <AdminLoginPage onSuccess={() => setCurrentTab('dashboard')} />;
  }

  const renderContent = () => {
    if (editingProductId || isCreatingProduct) {
      return (
        <ProductEditorPage
          productId={editingProductId}
          onBack={() => {
            setEditingProductId(null);
            setIsCreatingProduct(false);
          }}
        />
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return (
          <ProductListPage
            onEditProduct={(id) => setEditingProductId(id)}
            onCreateProduct={() => setIsCreatingProduct(true)}
          />
        );
      case 'product_types':
      case 'attributes':
        return <ProductTypeBuilderPage />;
      case 'categories':
        return <CategoryBuilderPage />;
      case 'collections':
        return <CollectionBuilderPage />;
      case 'media':
        return <MediaLibraryPage />;
      case 'homepage_builder':
        return <HomepageBuilderPage />;
      case 'banners':
        return <BannerManagerPage />;
      case 'landing_pages':
        return <LandingPageBuilderPage />;
      case 'editorial':
        return <EditorialCMSPage />;
      case 'seo':
        return <SEOManagerPage />;
      case 'coupons':
        return <CouponManagerPage />;
      case 'campaigns':
        return <CampaignManagerPage />;
      
      // Phase 5 CRM, Growth & Analytics Views
      case 'customers':
        return <Customer360Page />;
      case 'segments':
        return <SegmentBuilderPage />;
      case 'automations':
        return <MarketingAutomationPage />;
      case 'templates':
        return <NotificationTemplatesPage />;
      case 'influencers':
        return <InfluencerManagerPage />;
      case 'affiliates':
        return <AffiliateManagerPage />;
      case 'analytics':
        return <AdvancedAnalyticsPage />;
      case 'personalisation':
        return <PersonalisationAdminPage />;

      // Operations
      case 'orders':
        return <OrderOperationsPage />;
      case 'inventory':
        return <InventoryAdminPage />;
      case 'payments':
        return <PaymentAdminPage />;
      case 'shipments':
        return <ShippingAdminPage />;
      case 'returns':
        return <ReturnRefundAdminPage />;
      case 'bulk_operations':
        return <BulkOperationsPage />;
      case 'testing_cockpit':
        return <CommerceTestingCockpit />;
      case 'rbac_settings':
        return <RBACSettingsPage />;
      case 'audit_logs':
        return <AuditLogPage />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminErrorBoundary>
      <AdminLayout
        currentTab={currentTab}
        onTabChange={(tab) => {
          setEditingProductId(null);
          setIsCreatingProduct(false);
          setCurrentTab(tab);
        }}
      >
        {renderContent()}
      </AdminLayout>
    </AdminErrorBoundary>
  );
};
