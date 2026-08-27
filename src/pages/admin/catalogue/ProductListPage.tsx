import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Copy, Edit2, Trash2, Download, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { Product } from '../../../types/product';
import { useToast } from '../../../context/ToastContext';

interface ProductListPageProps {
  onEditProduct: (productId: string) => void;
  onCreateProduct: () => void;
}

export const ProductListPage: React.FC<ProductListPageProps> = ({ onEditProduct, onCreateProduct }) => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getProducts();
      setProducts(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      await adminService.duplicateProduct(id, 'Product Manager');
      showToast('Product Duplicated', 'Cloned product created in catalogue.', 'success');
      fetchProducts();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you wish to delete "${name}"?`)) return;
    try {
      await adminService.deleteProduct(id, 'Product Manager');
      showToast('Product Deleted', `Removed "${name}" from catalogue.`, 'info');
      fetchProducts();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Action Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Master Product Catalogue ({filteredProducts.length})
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Manage pricing, matrix variants, stock allocations, and dynamic product-type attributes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="/api/bulk/export/products" download>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '4px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </a>

          <button
            onClick={onCreateProduct}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>CREATE LUXURY PRODUCT</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={14} color="#64748B" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by SKU, Product Name, Brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 34px', fontSize: '0.8125rem', border: '1px solid #CBD5E1', borderRadius: '4px', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.8125rem', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', outline: 'none' }}
          >
            <option value="">All Categories</option>
            <option value="high-jewellery">High Jewellery</option>
            <option value="haute-couture">Haute Couture</option>
            <option value="fragrance">Haute Parfumerie</option>
            <option value="leather-goods">Leather Goods</option>
            <option value="footwear">Footwear</option>
            <option value="watches">High Horology</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading products...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Masterpiece</th>
                <th style={{ padding: '12px 16px' }}>SKU</th>
                <th style={{ padding: '12px 16px' }}>Product Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Base Price</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Stock</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={prod.media[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400'}
                        alt={prod.name}
                        style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '3px' }}
                      />
                      <div>
                        <strong style={{ display: 'block', color: '#0F172A' }}>{prod.name}</strong>
                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{prod.brand} • {prod.category}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <code style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>{prod.sku}</code>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>
                    <span style={{ textTransform: 'capitalize' }}>{prod.productType.replace('-', ' ')}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                    ₹{prod.basePriceINR?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: prod.stock <= 2 ? '#FEF2F2' : '#F0FDF4',
                        color: prod.stock <= 2 ? '#DC2626' : '#16A34A',
                      }}
                    >
                      {prod.stock} units
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: '3px', fontSize: '0.6875rem' }}>
                      {prod.availability.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onEditProduct(prod.id)}
                        title="Edit Creation"
                        style={{ padding: '6px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', color: '#0F172A', cursor: 'pointer' }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(prod.id)}
                        title="Duplicate Creation"
                        style={{ padding: '6px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFFFFF', color: '#475569', cursor: 'pointer' }}
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        title="Delete Creation"
                        style={{ padding: '6px', border: '1px solid #FCA5A5', borderRadius: '4px', backgroundColor: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
