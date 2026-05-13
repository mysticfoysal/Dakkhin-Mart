import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>দক্ষিণের স্বাদ / DokkhinMart 🐟</h3>
            <p>Premium coastal products from Bangladesh's richest waters and forests. Authentic Sundarbans honey and fresh seafood delivered with care. Quality you can taste, freshness you can trust.</p>
            <div className="social-links" style={{ marginTop: 20 }}>
              <a href="https://wa.me/8801700000000" className="social-link" title="WhatsApp">📱</a>
              <a href="#" className="social-link" title="Facebook">📘</a>
              <a href="#" className="social-link" title="Instagram">📷</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/profile">My Account</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <div className="footer-links">
              <Link to="/shop?category=honey">Pure Honey</Link>
              <Link to="/shop?category=fish-seafood">Fish & Seafood</Link>
              <Link to="/shop?category=dried-fish">Dried Fish</Link>
              <Link to="/shop?category=local-groceries">Local Groceries</Link>
              <Link to="/shop?category=combo-offers">Combo Offers</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="footer-links">
              <span>📞 +880 1700-000000</span>
              <span>📧 info@dokkhinmart.com</span>
              <span>📍 Khulna & Dhaka, Bangladesh</span>
              <a href="https://wa.me/8801700000000" style={{ color: '#25d366', fontWeight: 600 }}>💬 WhatsApp Chat</a>
            </div>
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: 8, fontSize: '0.8rem' }}>
              <strong style={{ color: 'white' }}>⚡ Express Delivery</strong><br />
              <span style={{ opacity: 0.7 }}>Khulna: 4 Hours</span><br />
              <span style={{ opacity: 0.7 }}>Dhaka: 12h Express / 24h Standard</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} দক্ষিণের স্বাদ / DokkhinMart. All rights reserved.</span>
          <span>Made with ❤️ in Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}