import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sliders,
  FolderTree,
  Sparkles,
  Award,
  Image,
  Home,
  Flag,
  FileText,
  BookOpen,
  Search,
  Tag,
  Gift,
  Users,
  Boxes,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  UploadCloud,
  ShieldAlert,
  SlidersHorizontal,
  History,
  Lock,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  BarChart3,
  Zap,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminRole } from '../../types/admin';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

interface NavSection {
  title: string;
  items: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }>;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentTab, onTabChange, children }) => {
  const { adminUser, logout } = useAdminAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navSections: NavSection[] = [
    {
      title: 'EXECUTIVE',
      items: [{ id: 'dashboard', label: 'Overview Dashboard', icon: <LayoutDashboard size={16} /> }],
    },
    {
      title: 'CATALOGUE',
      items: [
        { id: 'products', label: 'Products', icon: <Package size={16} /> },
        { id: 'product_types', label: 'Product-Type Builder', icon: <Layers size={16} /> },
        { id: 'attributes', label: 'Attribute Builder', icon: <Sliders size={16} /> },
        { id: 'categories', label: 'Categories', icon: <FolderTree size={16} /> },
        { id: 'collections', label: 'Collections', icon: <Sparkles size={16} /> },
        { id: 'brands', label: 'Brands', icon: <Award size={16} /> },
        { id: 'media', label: 'Media Library', icon: <Image size={16} /> },
      ],
    },
    {
      title: 'CONTENT & CMS',
      items: [
        { id: 'homepage_builder', label: 'Homepage Builder', icon: <Home size={16} /> },
        { id: 'banners', label: 'Banners', icon: <Flag size={16} /> },
        { id: 'landing_pages', label: 'Landing Pages', icon: <FileText size={16} /> },
        { id: 'editorial', label: 'Editorial Journal', icon: <BookOpen size={16} /> },
        { id: 'seo', label: 'SEO Management', icon: <Search size={16} /> },
      ],
    },
    {
      title: 'MARKETING',
      items: [
        { id: 'campaigns', label: 'Campaigns', icon: <Sparkles size={16} /> },
        { id: 'coupons', label: 'Coupons & Rules', icon: <Tag size={16} /> },
      ],
    },
    {
      title: 'CRM & GROWTH',
      items: [
        { id: 'customers', label: 'Customer 360 & Privé', icon: <Users size={16} /> },
        { id: 'segments', label: 'Dynamic Segments', icon: <Layers size={16} /> },
        { id: 'automations', label: 'Workflows & Recovery', icon: <Zap size={16} /> },
        { id: 'templates', label: 'Notification Templates', icon: <MessageSquare size={16} /> },
        { id: 'influencers', label: 'Creators & Influencers', icon: <Award size={16} /> },
        { id: 'affiliates', label: 'Affiliate Partners', icon: <Share2 size={16} /> },
      ],
    },
    {
      title: 'ANALYTICS & AI',
      items: [
        { id: 'analytics', label: 'Advanced Analytics', icon: <BarChart3 size={16} /> },
        { id: 'personalisation', label: 'Personalisation & AI', icon: <Sparkles size={16} /> },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'orders', label: 'Orders Management', icon: <ShoppingBag size={16} /> },
        { id: 'inventory', label: 'Inventory Vault', icon: <Boxes size={16} /> },
        { id: 'payments', label: 'Payments & Reconciliation', icon: <CreditCard size={16} /> },
        { id: 'shipments', label: 'Shipments & Logistics', icon: <Truck size={16} /> },
        { id: 'returns', label: 'Returns & QC', icon: <RotateCcw size={16} /> },
      ],
    },
    {
      title: 'BULK & TOOLS',
      items: [
        { id: 'bulk_operations', label: 'CSV Import & Export', icon: <UploadCloud size={16} /> },
        { id: 'testing_cockpit', label: 'Operations Test Cockpit', icon: <ShieldAlert size={16} /> },
      ],
    },
    {
      title: 'SETTINGS & AUDIT',
      items: [
        { id: 'rbac_settings', label: 'Staff Roles & 2FA', icon: <SlidersHorizontal size={16} /> },
        { id: 'audit_logs', label: 'Audit Trail', icon: <History size={16} /> },
      ],
    },
  ];

  const getRoleBadgeStyle = (role?: AdminRole) => {
    switch (role) {
      case 'Super Admin':
        return { backgroundColor: '#2C1810', color: '#D4AF37', border: '1px solid #D4AF37' };
      case 'Product Manager':
        return { backgroundColor: '#1A237E', color: '#90CAF9', border: '1px solid #90CAF9' };
      case 'Order Manager':
        return { backgroundColor: '#1B5E20', color: '#A5D6A7', border: '1px solid #A5D6A7' };
      case 'Marketing Manager':
        return { backgroundColor: '#4A148C', color: '#CE93D8', border: '1px solid #CE93D8' };
      case 'Content Manager':
        return { backgroundColor: '#BF360C', color: '#FFAB91', border: '1px solid #FFAB91' };
      default:
        return { backgroundColor: '#37474F', color: '#ECEFF1', border: '1px solid #B0BEC5' };
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F5F7', color: '#1E293B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0F172A',
          color: '#E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #1E293B',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          overflowY: 'auto',
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/images/sejal-emblem.png"
                alt="SEJAL Crown Emblem"
                style={{ height: '34px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.4))' }}
              />
              <div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.12em', color: '#FFFFFF' }}>
                  SEJAL<span style={{ color: '#D4AF37' }}>.PRO</span>
                </div>
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94A3B8', display: 'block' }}>
                  OPERATIONAL COMMAND
                </span>
              </div>
            </div>
          </div>

          <a href="/" target="_blank" rel="noreferrer" title="View Live Customer Storefront" style={{ color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
            <ExternalLink size={15} />
          </a>
        </div>

        {/* Navigation Tree */}
        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {navSections.map((sec) => (
            <div key={sec.title}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', display: 'block', padding: '0 12px 6px 12px' }}>
                {sec.title}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {sec.items.map((item) => {
                  const isSelected = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? '#1E293B' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#94A3B8',
                        border: 'none',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 600 : 400,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: isSelected ? '#D4AF37' : '#64748B' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {isSelected && <ChevronRight size={14} color="#D4AF37" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Staff Profile Card Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid #1E293B', backgroundColor: '#0B1120' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ overflow: 'hidden' }}>
              <strong style={{ fontSize: '0.8rem', color: '#FFFFFF', display: 'block', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {adminUser?.name || 'Staff Administrator'}
              </strong>
              <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{adminUser?.email}</span>
            </div>
            <button onClick={logout} title="Sign Out" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}>
              <LogOut size={15} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ ...getRoleBadgeStyle(adminUser?.role), fontSize: '0.625rem', fontWeight: 600, padding: '2px 6px', borderRadius: '2px', textTransform: 'uppercase' }}>
              {adminUser?.role || 'SUPER ADMIN'}
            </span>
            <span style={{ fontSize: '0.65rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={10} /> 2FA Active
            </span>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Operational Bar */}
        <header
          style={{
            height: '56px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748B' }}>
              SEJAL OS / {currentTab.toUpperCase().replace(/_/g, ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#475569', backgroundColor: '#F1F5F9', padding: '4px 12px', borderRadius: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>Production Vault Connected (v3.0.0)</span>
            </div>
          </div>
        </header>

        {/* Dynamic Sub-Page Content */}
        <main style={{ padding: '28px', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
};
