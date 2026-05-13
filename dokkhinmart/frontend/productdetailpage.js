import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import { useCart, useWishlist, useToast, useAuth } from '../context/AppContext';

function StarRating({ rating }) {
  const stars = Math.round(rating);
  return <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>;
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [quantity, setQuantity] = useState(0.5);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const { dispatch } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`)
      .then(r => {
        setData(r.data);
        const weights = r.data.product?.weight_options;
        if (weights) {
          const parsed = typeof weights === 'string' ? JSON.parse(weights) : weights;
          setSelectedWeight(parsed[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
        <div>
          {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-text" style={{ marginBottom: 16, height: i === 1 ? 40 : 20 }} />)}
        </div>
      </div>
    </div>
  );

  if (!data) return <div className="empty-state"><h3>Product not found</h3></div>;

  const { product, reviews, variants, related } = data;
  const images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []);
  const weightOptions = typeof product.weight_options === 'string' ? JSON.parse(product.weight_options || '[]') : (product.weight_options || []);
  const price = (product.sale_price || product.price) * (selectedWeight || 1);
  const inWishlist = isWishlisted(product.id);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id: product.id,
        name: product.name,
        price: parseFloat(product.sale_price || product.price),
        image: product.thumbnail,
        unit: product.unit,
        selectedWeight: selectedWeight || 1,
        quantity,
        slug: product.slug,
      },
    });
    addToast('Added to cart ✓', 'success');
  };

  const handleWishlist = async () => {
    if (!user) { addToast('Please login to save favorites', 'error'); return; }
    const action = await toggle(product.id);
    addToast(action === 'added' ? 'Added to wishlist ♡' : 'Removed from wishlist', 'success');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { addToast('Please login to leave a review', 'error'); return; }
    setSubmitting(true);
    try {
      await api.post('/reviews', { product_id: product.id, ...reviewForm });
      addToast('Review submitted!', 'success');
      setReviewForm({ rating: 5, title: '', comment: '' });
      const r = await api.get(`/products/${slug}`);
      setData(r.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Error submitting review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '0 20px 60px' }}>
      <div className="breadcrumb" style={{ padding: '20px 0' }}>
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
      </div>

      <div className="product-detail-layout">
        {/* Gallery */}
        <div className="detail-gallery">
          <div className="gallery-main">
            {images[selectedImg]
              ? <img src={`http://localhost:5000${images[selectedImg]}`} alt={product.name} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', background: 'var(--primary-light)' }}>
                  {product.category_slug?.includes('honey') ? '🍯' : '🐟'}
                </div>
            }
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <div key={i} className={`gallery-thumb${selectedImg === i ? ' active' : ''}`} onClick={() => setSelectedImg(i)}>
                  <img src={`http://localhost:5000${img}`} alt={`View ${i+1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <span className="tag">{product.category_name}</span>
          <h1 style={{ marginTop: 10 }}>{product.name}</h1>

          <div className="product-rating" style={{ marginTop: 10 }}>
            <StarRating rating={product.avg_rating || 0} />
            <span className="rating-count">({product.review_count || 0} reviews)</span>
            {product.total_sold > 0 && <span className="rating-count"> · {product.total_sold} sold</span>}
          </div>

          <div className="detail-price">
            ৳{parseFloat(price).toLocaleString()}
            {selectedWeight && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}> / {selectedWeight} {product.unit}</span>}
          </div>

          {product.sale_price && (
            <div style={{ marginTop: -12, marginBottom: 16 }}>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: 8 }}>
                ৳{(product.price * (selectedWeight || 1)).toLocaleString()}
              </span>
              <span className="product-badge" style={{ position: 'static' }}>
                {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
              </span>
            </div>
          )}

          {/* Weight Selector */}
          {weightOptions.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div className="filter-title" style={{ marginBottom: 10 }}>Select Weight</div>
              <div className="weight-selector">
                {weightOptions.map(w => (
                  <button
                    key={w}
                    className={`weight-btn${selectedWeight === w ? ' active' : ''}`}
                    onClick={() => setSelectedWeight(w)}
                  >
                    {w} {product.unit}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: 20 }}>
            <div className="filter-title" style={{ marginBottom: 10 }}>Quantity</div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(0.5, q - 0.5))}>−</button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(q => q + 0.5)}>+</button>
            </div>
          </div>

          {/* Stock */}
          <div style={{ marginBottom: 20 }}>
            {product.stock_quantity > 10
              ? <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.88rem' }}>✓ In Stock ({product.stock_quantity} available)</span>
              : product.stock_quantity > 0
                ? <span style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.88rem' }}>⚠ Low Stock (only {product.stock_quantity} left)</span>
                : <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '0.88rem' }}>✕ Out of Stock</span>
            }
          </div>

          <div className="detail-actions">
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock_quantity === 0}>
              🛒 Add to Cart
            </button>
            <button
              className={`btn btn-lg${inWishlist ? ' btn-danger' : ' btn-outline'}`}
              onClick={handleWishlist}
            >
              {inWishlist ? '♥ Saved' : '♡ Save'}
            </button>
          </div>

          <Link to="/checkout" className="btn btn-accent btn-lg btn-block" style={{ marginTop: 10 }} onClick={handleAddToCart}>
            ⚡ Buy Now
          </Link>

          {/* Delivery info */}
          <div style={{ background: 'var(--primary-light)', borderRadius: 12, padding: 16, marginTop: 20 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem' }}>⚡ <strong>12h delivery</strong> available</span>
              <span style={{ fontSize: '0.85rem' }}>🆓 <strong>Free delivery</strong> above ৳1000</span>
            </div>
          </div>

          {product.description && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 10, fontSize: '1rem' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 60 }}>
        <h2 style={{ marginBottom: 32 }}>Customer Reviews</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div>
            {reviews?.length === 0
              ? <div className="empty-state" style={{ padding: '40px 0' }}>
                  <div className="empty-state-icon">💬</div>
                  <p>No reviews yet. Be the first!</p>
                </div>
              : reviews?.map(r => (
                <div key={r.id} className="card card-body" style={{ marginBottom: 16 }}>
                  <div className="flex-between" style={{ marginBottom: 8 }}>
                    <strong>{r.user_name}</strong>
                    <StarRating rating={r.rating} />
                  </div>
                  {r.title && <p style={{ fontWeight: 600, marginBottom: 4 }}>{r.title}</p>}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r.comment}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    {new Date(r.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
              ))
            }
          </div>

          {user && (
            <div className="card card-body">
              <h3 style={{ marginBottom: 20, fontSize: '1.1rem' }}>Write a Review</h3>
              <form onSubmit={handleReview}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select className="form-control" value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: parseInt(e.target.value) }))}>
                    <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ Good</option>
                    <option value={3}>⭐⭐⭐ Average</option>
                    <option value={2}>⭐⭐ Poor</option>
                    <option value={1}>⭐ Terrible</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Title (optional)</label>
                  <input className="form-control" placeholder="Summary of your review" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Review</label>
                  <textarea className="form-control" rows={4} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
                </div>
                <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related?.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <h2 style={{ marginBottom: 28 }}>Related Products</h2>
          <div className="product-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}