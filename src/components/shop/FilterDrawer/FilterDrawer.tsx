import React from 'react';
import { Drawer } from '../../ui/Drawer/Drawer';
import { FilterParams } from '../../../types/common';
import { Category } from '../../../types/product';
import { useCurrency } from '../../../context/CurrencyContext';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterParams;
  onUpdateFilters: (newFilters: FilterParams) => void;
  categories: Category[];
  availableBrands: string[];
  availableColors: { name: string; hex: string }[];
  availableMaterials: string[];
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  categories,
  availableBrands,
  availableColors,
  availableMaterials,
}) => {
  const { formatPrice } = useCurrency();

  const handleCategoryChange = (categorySlug: string) => {
    onUpdateFilters({
      ...filters,
      category: categorySlug === filters.category ? undefined : categorySlug,
      subcategory: undefined, // reset subcategory on category change
    });
  };

  const handleSubcategoryChange = (subSlug: string) => {
    onUpdateFilters({
      ...filters,
      subcategory: subSlug === filters.subcategory ? undefined : subSlug,
    });
  };

  const handleBrandToggle = (brand: string) => {
    const current = filters.brand || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    onUpdateFilters({ ...filters, brand: updated.length ? updated : undefined });
  };

  const handleColorToggle = (colorName: string) => {
    const current = filters.colors || [];
    const updated = current.includes(colorName)
      ? current.filter((c) => c !== colorName)
      : [...current, colorName];
    onUpdateFilters({ ...filters, colors: updated.length ? updated : undefined });
  };

  const handleMaterialToggle = (material: string) => {
    const current = filters.materials || [];
    const updated = current.includes(material)
      ? current.filter((m) => m !== material)
      : [...current, material];
    onUpdateFilters({ ...filters, materials: updated.length ? updated : undefined });
  };

  const handlePriceMaxChange = (maxVal: number) => {
    onUpdateFilters({
      ...filters,
      priceRange: [0, maxVal],
    });
  };

  const handleClearAll = () => {
    onUpdateFilters({});
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="REFINE SELECTION" subtitle="Filter by category, material & price" width="420px">
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* 1. Category Hierarchy */}
        <div>
          <h5
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--sejal-espresso)',
              marginBottom: '12px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            CATEGORY
          </h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => handleCategoryChange('all')}
              style={{
                padding: '6px 14px',
                fontSize: '0.785rem',
                borderRadius: '2px',
                border: !filters.category ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-border)',
                backgroundColor: !filters.category ? 'var(--sejal-espresso)' : '#FFFFFF',
                color: !filters.category ? '#FAF6F0' : 'var(--sejal-espresso)',
                cursor: 'pointer',
              }}
            >
              All Creations
            </button>
            {categories.map((cat) => {
              const isSelected = filters.category === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.785rem',
                    borderRadius: '2px',
                    border: isSelected ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-border)',
                    backgroundColor: isSelected ? 'var(--sejal-espresso)' : '#FFFFFF',
                    color: isSelected ? '#FAF6F0' : 'var(--sejal-espresso)',
                    cursor: 'pointer',
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Subcategories if active category */}
        {filters.category && (
          <div>
            <h5
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--sejal-espresso)',
                marginBottom: '10px',
              }}
            >
              SUBCATEGORY
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {categories
                .find((c) => c.slug === filters.category)
                ?.subcategories.map((sub) => {
                  const isSelected = filters.subcategory === sub.slug;
                  return (
                    <button
                      key={sub.slug}
                      onClick={() => handleSubcategoryChange(sub.slug)}
                      style={{
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        borderRadius: '2px',
                        border: isSelected ? '1px solid var(--sejal-rose-gold)' : '1px solid var(--sejal-border-light)',
                        backgroundColor: isSelected ? 'var(--sejal-blush)' : '#FFFFFF',
                        color: 'var(--sejal-espresso)',
                        cursor: 'pointer',
                      }}
                    >
                      {sub.name}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* 3. Price Range Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h5
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--sejal-espresso)',
                margin: 0,
              }}
            >
              PRICE CEILING
            </h5>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--sejal-rose-gold)' }}>
              Up to {formatPrice(filters.priceRange ? filters.priceRange[1] : 1000000)}
            </span>
          </div>
          <input
            type="range"
            min={20000}
            max={1000000}
            step={25000}
            value={filters.priceRange ? filters.priceRange[1] : 1000000}
            onChange={(e) => handlePriceMaxChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--sejal-rose-gold)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--sejal-text-muted)', marginTop: '4px' }}>
            <span>{formatPrice(20000)}</span>
            <span>{formatPrice(1000000)}</span>
          </div>
        </div>

        {/* 4. Color Swatches */}
        <div>
          <h5
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--sejal-espresso)',
              marginBottom: '12px',
            }}
          >
            COLORWAY / METAL
          </h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableColors.map((color) => {
              const isSelected = filters.colors?.includes(color.name);
              return (
                <button
                  key={color.name}
                  onClick={() => handleColorToggle(color.name)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: isSelected ? '1px solid var(--sejal-espresso)' : '1px solid var(--sejal-border)',
                    backgroundColor: isSelected ? 'var(--sejal-espresso)' : '#FFFFFF',
                    color: isSelected ? '#FAF6F0' : 'var(--sejal-espresso)',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: color.hex,
                      border: '1px solid rgba(0,0,0,0.2)',
                    }}
                  />
                  <span>{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Haute Materials */}
        <div>
          <h5
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--sejal-espresso)',
              marginBottom: '12px',
            }}
          >
            PRECIOUS MATERIALS
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableMaterials.map((material) => {
              const isChecked = filters.materials?.includes(material);
              return (
                <label
                  key={material}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    color: 'var(--sejal-text-secondary)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleMaterialToggle(material)}
                    style={{ accentColor: 'var(--sejal-rose-gold)' }}
                  />
                  <span>{material}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 6. Availability */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.inStockOnly || false}
              onChange={(e) => onUpdateFilters({ ...filters, inStockOnly: e.target.checked || undefined })}
              style={{ accentColor: 'var(--sejal-rose-gold)' }}
            />
            <span style={{ fontWeight: 500, color: 'var(--sejal-espresso)' }}>Show In-Stock Masterpieces Only</span>
          </label>
        </div>

        {/* Apply & Reset Buttons */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--sejal-border-light)', display: 'flex', gap: '12px' }}>
          <button
            onClick={handleClearAll}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              border: '1px solid var(--sejal-border)',
              color: 'var(--sejal-espresso)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            RESET
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 2,
              padding: '12px',
              backgroundColor: 'var(--sejal-espresso)',
              border: 'none',
              color: 'var(--sejal-cream)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            VIEW SELECTIONS
          </button>
        </div>
      </div>
    </Drawer>
  );
};
