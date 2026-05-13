import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth, useToast } from '../context/AppContext';
import api from '../utils/api';

export default function CheckoutPage() {
  const { items, subtotal, dispatch } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: user?.name || '',
    customer_phone: user?.phone || '',
    customer_email: user?.email || '',
    delivery_address: user?.address || '',
    delivery_type: '24h',
    payment_method: 'cod',
    coupon_code: '',
    notes: '',
  });
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const deliveryCharge = form.delivery_type === '12h' ? 80 : 50;
  const freeDelivery = subtotal >= 1000 ? 0 : deliveryCharge;
  const total = subtotal + freeDelivery - couponDiscount;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleCoupon = async () => {
    setValidatingCoupon(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: form.coupon_code, subtotal });
      setCouponDiscount(data.coupon.discount);
      setCouponApplied(true);
      addToast(`Coupon applied! ৳${data.coupon.discount} off`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid coupon', 'error');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone || !form.delivery_address) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map(i => ({
        product_id: i.id,
        product_name: i.name,
        product_image: i.image,
        weight: i.selectedWeight,
        unit: i.unit,
        quantity: i.quantity,
        unit_price: i.price,
      }));

      const { data } = await api.post('/orders', {
        ...form,
        items: orderItems,
      });

      dispatch({ type: 'CLEAR' });
      addToast('Order placed successfully! 🎉', 'success');
      navigate(`/order-success/${data.order.order_number}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const paymentMethods = [
    { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
    { value: 'bkash', label: 'bKash', icon: '📱' },
    { value: 'nagad', label: 'Nagad', icon: '💳' },
    { value: 'card', label: 'Card Payment', icon: '💳' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container"><h1>Checkout</h1></div>
      </div>
      <div className="container" style={{ padding: '0 20px 60px' }}>
        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Form */}
            <div>
              <div className="card card-body" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 20 }}>Delivery Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-control" name="customer_name" value={form.customer_name} onChange={handleChange} required placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input className="form-control" name="customer_phone" value={form.customer_phone} onChange={handleChange} required placeholder="01XXXXXXXXX" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" name="customer_email" value={form.customer_email} onChange={handleChange} placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Address *</label>
                  <textarea className="form-control" name="delivery_address" value={form.delivery_address} onChange={handleChange} required rows={3} placeholder="House/road/area, City" />
                </div>
                <div className="form-group">
                  <label className="form-label">Special Notes</label>
                  <input className="form-control" name="notes" value={form.notes} onChange={handleChange} placeholder="Any special instructions?" />
                </div>
              </div>

              {/* Delivery Type */}
              <div className="card card-body" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Delivery Option</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label className={`payment-option${form.delivery_type === '24h' ? ' selected' : ''}`} style={{ cursor: 'pointer' }}>
                    <input type="radio" name="delivery_type" value="24h" checked={form.delivery_type === '24h'} onChange={handleChange} style={{ display: 'none' }} />
                    <span className="payment-icon">📦</span>
                    Standard (24h)<br />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{subtotal >= 1000 ? 'FREE' : '৳50'}</span>
                  </label>
                  <label className={`payment-option${form.delivery_type === '12h' ? ' selected' : ''}`} style={{ cursor: 'pointer' }}>
                    <input type="radio" name="delivery_type" value="12h" checked={form.delivery_type === '12h'} onChange={handleChange} style={{ display: 'none' }} />
                    <span className="payment-icon">⚡</span>
                    Quick (12h)<br />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{subtotal >= 1000 ? 'FREE' : '৳80'}</span>
                  </label>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 12 }}>
                  ⚡ 12h delivery: order before 6:30 AM or 6:30 PM
                </p>
              </div>

              {/* Payment */}
              <div className="card card-body">
                <h3 style={{ marginBottom: 16 }}>Payment Method</h3>
                <div className="payment-methods">
                  {paymentMethods.map(pm => (
                    <label key={pm.value} className={`payment-option${form.payment_method === pm.value ? ' selected' : ''}`} style={{ cursor: 'pointer' }}>
                      <input type="radio" name="payment_method" value={pm.value} checked={form.payment_method === pm.value} onChange={handleChange} style={{ display: 'none' }} />
                      <span className="payment-icon">{pm.icon}</span>
                      {pm.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="cart-summary">
                <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
                <div style={{ marginBottom: 16 }}>
                  {items.map(item => (
                    <div key={item.key} className="summary-row">
                      <span style={{ fontSize: '0.85rem' }}>{item.name} × {item.quantity}</span>
                      <span style={{ fontSize: '0.85rem' }}>৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-row"><span>Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span>{freeDelivery === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `৳${freeDelivery}`}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="summary-row" style={{ color: 'var(--success)' }}>
                    <span>Coupon Discount</span><span>−৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="summary-row summary-total"><span>Total</span><span>৳{total.toLocaleString()}</span></div>

                {/* Coupon */}
                {!couponApplied && (
                  <div className="coupon-row">
                    <input className="form-control" placeholder="Coupon code" name="coupon_code" value={form.coupon_code} onChange={handleChange} />
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleCoupon} disabled={validatingCoupon || !form.coupon_code}>
                      {validatingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponApplied && (
                  <div style={{ padding: '8px 12px', background: 'var(--primary-light)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--primary)', marginBottom: 16 }}>
                    ✓ Coupon applied: −৳{couponDiscount}
                  </div>
                )}

                <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading} style={{ marginTop: 8 }}>
                  {loading ? '⏳ Placing Order...' : '✓ Place Order'}
                </button>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
                  🔒 Secure checkout · Your data is safe
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}