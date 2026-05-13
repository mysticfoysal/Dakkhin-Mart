import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { categories, productsData } from '../data/products-data';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: 1,
  });

  // Load products
  useEffect(() => {
    setProducts(productsData);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Price filter
    if (filters.minPrice) {
      result = result.filter(p => p.salePrice >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.salePrice <= parseInt(filters.maxPrice));
    }

    // Sorting
    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case 'price_desc':
        result.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  };

  const handleSearchChange = (e) => {
    updateFilter('search', e.target.value);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  const priceRanges = [
    { min: 0, max: 500, label: '০-৫০০ টাকা' },
    { min: 500, max: 1000, label: '৫০০-১০০০ টাকা' },
    { min: 1000, max: 2000, label: '১০০০-২০০০ টাকা' },
    { min: 2000, max: 999999, label: '২০০০+ টাকা' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)',
        color: 'white',
        padding: '40px 0 32px'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '12px' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.85)' }}>Home</Link>
            <span style={{ opacity: 0.6 }}>/ </span>
            <span>Shop</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginBottom: '8px' }}>Our Products</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '0' }}>
            Premium coastal products from DokkhinMart
          </p>
        </div>
      </div>

      {/* Main Shop Layout */}
      <div className="container" style={{ padding: '48px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
          {/* Sidebar Filters */}
          <aside className="shop-filters" style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            height: 'fit-content',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '700', color: 'var(--text-dark)' }}>Filters</h3>

            {/* Category Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Category
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => updateFilter('category', '')}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    background: !filters.category ? 'var(--green-pale)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'var(--text-dark)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => !filters.category && (e.target.style.background = 'var(--green-pale)')}
                  onMouseOut={(e) => !filters.category || (e.target.style.background = 'transparent')}
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.slug)}
                    style={{
                      padding: '8px 12px',
                      textAlign: 'left',
                      background: filters.category === cat.slug ? 'var(--green-pale)' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--text-dark)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-mid)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Price Range
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {priceRanges.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      updateFilter('minPrice', range.min);
                      updateFilter('maxPrice', range.max);
                    }}
                    style={{
                      padding: '8px 12px',
                      textAlign: 'left',
                      background: filters.minPrice === range.min.toString() ? 'var(--green-pale)' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--text-dark)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--danger)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Clear All Filters
            </button>
          </aside>

          {/* Products Section */}
          <main>
            {/* Sort & Search Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '16px',
              marginBottom: '32px',
              alignItems: 'center'
            }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}>
                  🔍
                </span>
              </div>

              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  cursor: 'pointer'
                }}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <div style={{
                background: 'var(--green-pale)',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--green-mid)'
              }}>
                {filteredProducts.length} items
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-card-image">
                      <span className="product-img-placeholder">{product.image}</span>
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                      {product.price > product.salePrice && (
                        <span className="product-badge sale" style={{
                          position: 'absolute', top: '12px', right: '12px', left: 'auto',
                          background: 'var(--danger)'
                        }}>
                          -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="product-card-body">
                      <div className="product-category">{product.category}</div>
                      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                        <h3 className="product-name">{product.name}</h3>
                      </Link>
                      <div className="product-rating">
                        <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
                        <span className="rating-count">({product.reviews})</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '12px' }}>
                        {product.stock > 0 ? (
                          <span style={{ color: 'var(--success)' }}>✓ In Stock</span>
                        ) : (
                          <span style={{ color: 'var(--danger)' }}>Out of Stock</span>
                        )}
                      </div>
                      <div className="product-price-row">
                        <div>
                          <span className="product-price">৳{product.salePrice}</span>
                          {product.price > product.salePrice && (
                            <span className="product-old-price">৳{product.price}</span>
                          )}
                        </div>
                        <button className="product-add-btn">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--cream)',
                borderRadius: 'var(--radius)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                <h3 style={{ color: 'var(--text-dark)', marginBottom: '6px' }}>No Products Found</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
