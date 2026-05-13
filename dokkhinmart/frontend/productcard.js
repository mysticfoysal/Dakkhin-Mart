import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useWishlist, useToast, useAuth } from '../../context/AppContext';

function StarRating({ rating, count }) {
  const stars = Math.round(rating);
  return (
    <div className="product-rating">
      <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
      {count > 0 && <span className="rating-count">({count})</span>}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const inWishlist = isWishlisted(product.id);
  const price = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id: product.id,
        name: product.name,
        price: parseFloat(price),
        image: product.thumbnail,
        unit: product.unit,
        selectedWeight: product.weight_options?.[0] || 1,
        quantity: 1,
        slug: product.slug,
      },
    });
    addToast(`${product.name} added to cart ✓`, 'success');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    const action = await toggle(product.id);
    if (action === 'added') addToast('Added to wishlist ♡', 'success');
    else if (action === 'removed') addToast('Removed from wishlist', 'success');
  };

  const imgSrc = product.thumbnail
    ? (product.thumbnail.startsWith('http') ? product.thumbnail : `http://localhost:5000${product.thumbnail}`)
    : null;

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`}>
        <div className="product-img-wrap">
          {imgSrc
            ? <img src={imgSrc} alt={product.name} loading="lazy" />
            : <div className="product-img-placeholder">{product.category_slug?.includes('honey') ? '🍯' : '🐟'}</div>
          }
          <div className="product-overlay">
            <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>Add to Cart</button>
          </div>
          {hasDiscount && <span className="product-badge">{discountPct}% OFF</span>}
          {product.total_sold > 200 && !hasDiscount && <span className="product-badge hot">🔥 Hot</span>}
          <button
            className={`wishlist-btn${inWishlist ? ' active' : ''}`}
            onClick={handleWishlist}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? '♥' : '♡'}
          </button>
        </div>

        <div className="product-info">
          <div className="product-category">{product.category_name || 'FreshMart'}</div>
          <div className="product-name">{product.name}</div>
          <StarRating rating={product.avg_rating || 0} count={product.review_count || 0} />
          <div className="product-price">
            <span className="price-current">৳{parseFloat(price).toLocaleString()}</span>
            {hasDiscount && <span className="price-old">৳{parseFloat(product.price).toLocaleString()}</span>}
            <span className="price-unit">/ {product.unit}</span>
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 16px 16px' }}>
        <button className="btn btn-primary btn-sm btn-block" onClick={handleAddToCart}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}