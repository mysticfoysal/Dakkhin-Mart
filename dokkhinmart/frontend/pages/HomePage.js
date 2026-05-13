import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsData, categories, combos, testimonials, deliveryOptions, faqs } from '../data/products-data';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: 'Premium Coastal Products',
      subtitle: 'দক্ষিণের স্বাদ - Fresh from Sundarbans',
      desc: 'Authentic honey, fish, and local groceries delivered fresh to your doorstep',
      icon: '🍯',
      color: '#1a3a2a'
    },
    {
      title: 'Fresh Seafood Daily',
      subtitle: 'Caught Fresh Every Morning',
      desc: 'Direct from fishermen to your table - Hilsha, Shrimp, and more',
      icon: '🐟',
      color: '#2d6a4f'
    },
    {
      title: 'Sundarbans Honey',
      subtitle: 'Pure & 100% Organic',
      desc: 'Raw honey with natural enzymes and bee pollen. No additives, just pure nature.',
      icon: '🐝',
      color: '#1a3a2a'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="hero-slider" style={{ background: `linear-gradient(135deg, ${slide.color} 0%, ${slide.color}dd 100%)` }}>
      <div className="hero-slider-content">
        <div className="hero-slider-text">
          <span className="hero-badge">{slide.subtitle}</span>
          <h1>{slide.title}</h1>
          <p>{slide.desc}</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
            <Link to="/about" className="btn btn-outline btn-lg">Learn More</Link>
          </div>
        </div>
        <div className="hero-slider-icon" style={{ fontSize: '200px' }}>{slide.icon}</div>
      </div>

      {/* Slider Controls */}
      <div className="slider-controls">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedCategories() {
  return (
    <section className="section featured-categories">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">🏆 Categories</span>
          <h2>Shop by Category</h2>
          <p>Discover our premium coastal product collections</p>
        </div>

        <div className="categories-grid">
          {categories.map(cat => (
            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="category-card">
              <div className="cat-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              <span className="cat-count">
                {productsData.filter(p => p.category === cat.slug).length} products
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeliverySystem() {
  return (
    <section className="section delivery-system" style={{ background: 'var(--green-dark)', color: 'white', padding: '72px 0' }}>
      <div className="container">
        <div className="section-header" style={{ color: 'white' }}>
          <span className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>⚡ Fast & Reliable</span>
          <h2 style={{ color: 'white' }}>Express Delivery Options</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Same-day delivery in Khulna, Express delivery to Dhaka</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '48px' }}>
          {deliveryOptions.map(opt => (
            <div key={opt.id} className="delivery-card" style={{ 
              background: 'rgba(255,255,255,0.08)', 
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '32px 24px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{opt.icon}</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'white' }}>{opt.city}</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e9c46a', marginBottom: '8px' }}>{opt.time}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '8px 0' }}>{opt.label}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>{opt.description}</p>
              {opt.note && <p style={{ fontSize: '11px', color: '#e9c46a', marginTop: '12px', fontWeight: '600' }}>{opt.note}</p>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '48px', padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h4 style={{ marginBottom: '16px', color: 'white' }}>📞 Emergency Orders?</h4>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>Call or WhatsApp us for urgent orders</p>
          <a href="https://wa.me/8801700000000" className="btn btn-gold">💬 WhatsApp Now</a>
        </div>
      </div>
    </section>
  );
}

function ComboOffers() {
  return (
    <section className="section combo-offers">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">🎁 Special Offers</span>
          <h2>Combo Deals & Packages</h2>
          <p>Save big with our curated combo packages</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {combos.map(combo => (
            <div key={combo.id} className="combo-card" style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                background: `linear-gradient(135deg, var(--green-mid) 0%, var(--green-light) 100%)`,
                color: 'white',
                padding: '24px',
                textAlign: 'center',
                fontSize: '60px'
              }}>
                {combo.image}
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', color: 'var(--text-dark)', margin: '0' }}>{combo.name}</h3>
                  <span style={{
                    background: 'var(--danger)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>Save {combo.discount}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-light)', margin: '0 0 12px 0' }}>{combo.description}</p>
                <div style={{ fontSize: '12px', color: 'var(--text-mid)', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  {combo.items.join(' • ')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: 'var(--text-light)', textDecoration: 'line-through', fontSize: '13px' }}>৳{combo.price}</span>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--green-mid)' }}>৳{combo.salePrice}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>Save ৳{combo.save}</div>
                </div>
                <button className="btn btn-primary btn-block" style={{ justifyContent: 'center' }}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section testimonials" style={{ background: 'var(--green-pale)', padding: '72px 0' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">⭐ Love From Customers</span>
          <h2>What Our Customers Say</h2>
          <p>Trusted by thousands across Bangladesh</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {testimonials.map(test => (
            <div key={test.id} style={{
              background: 'white',
              borderRadius: 'var(--radius)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                {[...Array(test.rating)].map((_, i) => <span key={i}>⭐</span>)}
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-mid)', marginBottom: '16px', fontStyle: 'italic', lineHeight: '1.7' }}>"{test.text}"</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-dark)' }}>{test.name}</strong>
                  <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>📍 {test.city}</small>
                </div>
                <span style={{ fontSize: '24px' }}>{test.image}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing! আপনার সাবস্ক্রিপশনের জন্য ধন্যবাদ!');
    setEmail('');
  };

  return (
    <section className="section newsletter" style={{ background: 'linear-gradient(135deg, var(--green-mid) 0%, var(--green-dark) 100%)', color: 'white', padding: '72px 0' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '12px' }}>Subscribe to Our Newsletter</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>Get exclusive offers, fresh product updates, and recipes delivered to your inbox</p>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px'
              }}
            />
            <button type="submit" className="btn btn-gold">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <section className="section faq-section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">❓ FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers to common questions about DokkhinMart</p>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {faqs.map(faq => (
            <div key={faq.id} style={{
              marginBottom: '16px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: openFAQ === faq.id ? 'var(--green-pale)' : 'white',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--text-dark)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>{faq.question}</span>
                <span style={{ fontSize: '20px', transition: 'transform 0.3s ease', transform: openFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
              </button>
              {openFAQ === faq.id && (
                <div style={{
                  padding: '18px',
                  background: 'var(--cream)',
                  borderTop: '1px solid var(--border)',
                  fontSize: '14px',
                  color: 'var(--text-mid)',
                  lineHeight: '1.7'
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Trust Strip */}
      <div className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">✅</div>
              <div>
                <h4>100% Fresh</h4>
                <p>Daily catch delivered fresh</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">⚡</div>
              <div>
                <h4>Fast Delivery</h4>
                <p>4-24 hours throughout Bangladesh</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🔒</div>
              <div>
                <h4>Safe Payment</h4>
                <p>Multiple payment options available</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">💯</div>
              <div>
                <h4>Guaranteed Quality</h4>
                <p>Money-back guarantee on all products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Featured Products */}
      <section className="section featured-products">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">🌟 Featured</span>
            <h2>Best Sellers This Week</h2>
            <p>Our most popular products</p>
          </div>
          <div className="products-grid">
            {productsData.slice(0, 8).map(product => (
              <div key={product.id} className="product-card">
                <div className="product-card-image">
                  <span className="product-img-placeholder">{product.image}</span>
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                </div>
                <div className="product-card-body">
                  <div className="product-category">{product.category.toUpperCase()}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <span className="stars">{'★'.repeat(Math.floor(product.rating))} ☆</span>
                    <span className="rating-count">({product.reviews})</span>
                  </div>
                  <div className="product-price-row">
                    <div>
                      <span className="product-price">৳{product.salePrice}</span>
                      <span className="product-old-price">৳{product.price}</span>
                    </div>
                    <button className="product-add-btn">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery System */}
      <DeliverySystem />

      {/* Combo Offers */}
      <ComboOffers />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />

      {/* FAQ */}
      <FAQSection />
    </div>
  );
}
