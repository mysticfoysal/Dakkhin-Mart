import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';

function DeliveryCountdown() {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const cutoffs = [
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 30),
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 30),
      ];
      let next = cutoffs.find(c => c > now);
      if (!next) {
        next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 6, 30);
      }
      const diff = next - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="countdown">Next cutoff in: <strong>{timeLeft}</strong></span>;
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div style={{ padding: 16 }}>
        <div className="skeleton skeleton-text short" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" style={{ width: '40%' }} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          api.get('/products/top-selling'),
          api.get('/categories'),
        ]);
        setTopProducts(pRes.data.products || []);
        setCategories(cRes.data.categories?.filter(c => !c.parent_id) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryIcons = {
    'fresh-fish': '🐟',
    'pure-honey': '🍯',
    'combo-offers': '🎁',
    'hilsa-fish': '🐠',
    'catfish': '🐡',
    'rohu-fish': '🐟',
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-content">
            <div className="hero-badge">
              🌿 100% Natural & Fresh
            </div>
            <h1>Premium Fresh Fish<br />& Pure Honey</h1>
            <p>
              Sourced directly from trusted farms and natural habitats. 
              Delivered to your doorstep within 12–24 hours. 
              Taste the freshness, every single time.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-accent btn-lg">🛒 Shop Now</Link>
              <Link to="/about" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                Learn More
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">500+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">50+</div>
                <div className="hero-stat-label">Products</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">12h</div>
                <div className="hero-stat-label">Fast Delivery</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-label">Natural</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-visual">🐟</div>
      </section>

      {/* Featured Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Browse by Category</span>
            <h2>Featured Categories</h2>
            <p>Find exactly what you're looking for</p>
          </div>
          <div className="category-grid">
            {loading
              ? [1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />)
              : categories.map(cat => (
                <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="category-card">
                  <div className="category-icon">{categoryIcons[cat.slug] || '📦'}</div>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.product_count || 0} products</div>
                </Link>
              ))
            }
          </div>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="section" style={{ background: 'var(--bg)', paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">🔥 Most Popular</span>
            <h2>Top Selling Products</h2>
            <p>Our customers' absolute favorites</p>
          </div>
          <div className="product-grid">
            {loading
              ? [1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)
              : topProducts.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/shop" className="btn btn-outline btn-lg">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* Delivery Info Banner */}
      <section className="delivery-banner">
        <div className="container">
          <div className="section-header">
            <h2 style={{ color: 'white' }}>Fast & Reliable Delivery</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>We bring freshness to your door</p>
          </div>
          <div className="delivery-grid">
            <div className="delivery-card">
              <div className="delivery-icon">⚡</div>
              <h3>Quick Commerce</h3>
              <p>
                Order before <strong>6:30 AM</strong> → Delivered same day<br />
                Order before <strong>6:30 PM</strong> → Delivered within 12 hours
              </p>
              <span className="delivery-badge">12 Hour Delivery</span>
              <div><DeliveryCountdown /></div>
            </div>
            <div className="delivery-card">
              <div className="delivery-icon">📦</div>
              <h3>Standard Delivery</h3>
              <p>
                Place your order anytime and receive your fresh products 
                within <strong>24 hours</strong>. Guaranteed freshness on every delivery.
              </p>
              <span className="delivery-badge">24 Hour Delivery</span>
            </div>
            <div className="delivery-card">
              <div className="delivery-icon">🆓</div>
              <h3>Free Delivery</h3>
              <p>
                Enjoy <strong>free delivery</strong> on all orders above 
                ৳1,000. No hidden charges, transparent pricing always.
              </p>
              <span className="delivery-badge" style={{ background: 'rgba(255,255,255,0.2)' }}>On Orders ৳1000+</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Why FreshMart</span>
            <h2>Quality You Can Trust</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: '🐟', title: 'Direct from Source', desc: 'Fish caught fresh and delivered straight from rivers and farms' },
              { icon: '🌿', title: '100% Natural', desc: 'No preservatives, no additives. Pure and natural products only' },
              { icon: '⭐', title: 'Quality Assured', desc: 'Every product passes strict quality checks before delivery' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Multiple payment options including bKash, Nagad, and card' },
            ].map((item, i) => (
              <div key={i} className="card card-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--accent-light), var(--primary-light))', padding: '48px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 12 }}>🍯 Special Offer on Sidr Honey</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '1.05rem' }}>
            Premium Sundarbans Sidr honey — now available. Limited stock!
          </p>
          <Link to="/shop?category=pure-honey" className="btn btn-primary btn-lg">
            Shop Honey Now
          </Link>
        </div>
      </section>
    </div>
  );
}