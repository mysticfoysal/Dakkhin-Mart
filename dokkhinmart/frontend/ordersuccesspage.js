// OrderSuccessPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

export function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderNumber}`).then(r => setOrder(r.data.order)).catch(() => {});
  }, [orderNumber]);

  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: 24 }}>🎉</div>
      <h1 style={{ marginBottom: 12, color: 'var(--primary)' }}>Order Placed!</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 8 }}>
        Thank you for your order. We'll start preparing it right away.
      </p>
      <div style={{ background: 'var(--primary-light)', borderRadius: 16, padding: 28, margin: '28px 0' }}>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Order Number</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
          #{orderNumber}
        </div>
        {order && (
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
            <div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total</div><div style={{ fontWeight: 700 }}>৳{parseFloat(order.total).toLocaleString()}</div></div>
            <div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Payment</div><div style={{ fontWeight: 700, textTransform: 'uppercase' }}>{order.payment_method}</div></div>
            <div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Delivery</div><div style={{ fontWeight: 700 }}>{order.delivery_type === '12h' ? '12 Hours' : '24 Hours'}</div></div>
            <div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status</div><div style={{ fontWeight: 700, color: 'var(--primary)' }}>Confirmed ✓</div></div>
          </div>
        )}
      </div>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 28 }}>
        📱 We'll contact you on your phone to confirm delivery details.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        <Link to="/profile" className="btn btn-outline">View My Orders</Link>
        <a href="https://wa.me/8801700000000" className="btn btn-ghost" style={{ background: '#25d366', color: 'white' }}>💬 WhatsApp Us</a>
      </div>
    </div>
  );
}

export default OrderSuccessPage;