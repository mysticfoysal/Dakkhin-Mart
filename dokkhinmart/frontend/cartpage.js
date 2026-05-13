import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/AppContext';

export default function CartPage() {
  const { items, dispatch, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div className="empty-state">
        <div className="empty-state-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some fresh products to get started</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Products</Link>
      </div>
    </div>
  );

  const deliveryCharge = subtotal >= 1000 ? 0 : 60;
  const total = subtotal + deliveryCharge;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>{items.length} item(s)</p>
        </div>
      </div>
      <div className="container" style={{ padding: '0 20px 60px' }}>
        <div className="cart-layout">
          {/* Items */}
          <div className="card">
            {items.map(item => (
              <div key={item.key} className="cart-item">
                <div className="cart-item-img" style={{ background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  {item.image
                    ? <img src={`http://localhost:5000${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    : '🐟'
                  }
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">{item.selectedWeight} {item.unit} · ৳{item.price.toLocaleString()} / {item.unit}</div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', key: item.key, quantity: item.quantity - 0.5 })}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => dispatch({ type: 'UPDATE_QTY', key: item.key, quantity: item.quantity + 0.5 })}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <div className="cart-item-price">৳{(item.price * item.quantity).toLocaleString()}</div>
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => dispatch({ type: 'REMOVE_ITEM', key: item.key })}>✕ Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `৳${deliveryCharge}`}</span>
            </div>
            {deliveryCharge > 0 && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0' }}>
                Add ৳{(1000 - subtotal).toLocaleString()} more for free delivery
              </p>
            )}
            <div className="summary-row summary-total"><span>Total</span><span>৳{total.toLocaleString()}</span></div>

            <div style={{ marginTop: 20 }}>
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>
              <Link to="/shop" className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>
                ← Continue Shopping
              </Link>
            </div>

            {/* Delivery info */}
            <div style={{ marginTop: 20, padding: 16, background: 'var(--primary-light)', borderRadius: 12 }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>⚡ Delivery Options</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>12h: ৳80 | 24h: ৳50</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--success)' }}>FREE delivery on orders ৳1,000+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}