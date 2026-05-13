import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    setSearchParams(params);
  }, [filters.category, filters.search]);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories || []));
  }, []);

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'best_selling', label: 'Best Selling' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> / <span>Shop</span></div>
          <h1>Our Products</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>Fresh fish and pure honey, sourced with care</p>
        </div>
      </div>

      <div className="container" style={{ padding: '0 20px 60px' }}>
        {/* Sort Bar */}
        <div className="sort-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-sm btn-ghost" onClick={() => setFilterOpen(!filterOpen)} style={{ display: 'none' }}>
              ☰ Filters
            </button>
            <span className="results-count">
              {loading ? 'Loading...' : `${pagination.total || 0} products found`}
            </span>
          </div>

          <div className="search-bar">
            <input
              className="form-control"
              placeholder="Search products..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
            />
          </div>

          <select className="form-control" style={{ width: 200 }} value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="shop-layout" style={{ gridTemplateColumns: '240px 1fr' }}>
          {/* Sidebar Filters */}
          <aside className="filter-sidebar" style={{ display: 'block' }}>
            <div className="filter-section">
              <div className="filter-title">Categories</div>
              <label className="filter-option">
                <input type="radio" name="category" value="" checked={filters.category === ''} onChange={() => updateFilter('category', '')} />
                All Categories
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="filter-option">
                  <input type="radio" name="category" value={cat.slug} checked={filters.category === cat.slug} onChange={() => updateFilter('category', cat.slug)} />
                  {cat.name} ({cat.product_count || 0})
                </label>
              ))}
            </div>

            <div className="filter-section">
              <div className="filter-title">Price Range</div>
              <div className="price-range">
                <input
                  className="form-control" type="number" placeholder="Min ৳"
                  value={filters.minPrice}
                  onChange={e => updateFilter('minPrice', e.target.value)}
                  style={{ width: '100%' }}
                />
                <span>–</span>
                <input
                  className="form-control" type="number" placeholder="Max ৳"
                  value={filters.maxPrice}
                  onChange={e => updateFilter('maxPrice', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <button className="btn btn-sm btn-primary btn-block" style={{ marginTop: 12 }} onClick={() => fetchProducts()}>
                Apply
              </button>
            </div>

            <div className="filter-section">
              <div className="filter-title">Sort By</div>
              {sortOptions.map(o => (
                <label key={o.value} className="filter-option">
                  <input type="radio" name="sort" value={o.value} checked={filters.sort === o.value} onChange={() => updateFilter('sort', o.value)} />
                  {o.label}
                </label>
              ))}
            </div>

            <button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 8 }} onClick={() => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })}>
              Clear All Filters
            </button>
          </aside>

          {/* Product Grid */}
          <div>
            {loading ? (
              <div className="product-grid">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="skeleton-card card">
                    <div className="skeleton skeleton-img" style={{ height: 240 }} />
                    <div style={{ padding: 16 }}>
                      <div className="skeleton skeleton-text short" />
                      <div className="skeleton skeleton-text" />
                      <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`btn btn-sm ${filters.page === p ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilters(f => ({ ...f, page: p }))}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}