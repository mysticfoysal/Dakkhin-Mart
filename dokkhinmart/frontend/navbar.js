import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../../context/AppContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-text">
            <span>দক্ষিণের স্বাদ</span>
            <small>DokkhinMart</small>
          </div>
        </Link>

        <div className="navbar-nav">
          <NavLink to="/" className={({isActive})=>`nav-link${isActive?' active':''}`} end>Home</NavLink>
          <NavLink to="/shop" className={({isActive})=>`nav-link${isActive?' active':''}`}>Shop</NavLink>
          <NavLink to="/about" className={({isActive})=>`nav-link${isActive?' active':''}`}>About</NavLink>
          <NavLink to="/contact" className={({isActive})=>`nav-link${isActive?' active':''}`}>Contact</NavLink>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/wishlist" className="btn-icon" title="Wishlist">♡</Link>
              <Link to="/profile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '6px 12px' }}>
                👤 {user.name.split(' ')[0]}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-sm btn-secondary">Admin</Link>
              )}
              <button className="btn btn-sm btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
            </>
          )}
          <Link to="/cart" className="cart-btn">
            🛒 Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '16px', zIndex: 200 }}>
          <NavLink to="/" className="nav-link" style={{ display: 'block', marginBottom: 6 }} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/shop" className="nav-link" style={{ display: 'block', marginBottom: 6 }} onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/about" className="nav-link" style={{ display: 'block', marginBottom: 6 }} onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className="nav-link" style={{ display: 'block' }} onClick={() => setMenuOpen(false)}>Contact</NavLink>
        </div>
      )}
    </nav>
  );
}