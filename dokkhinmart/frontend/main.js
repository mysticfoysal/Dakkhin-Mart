// ═══════════════════════════════════════════════════
//  DOKKHINMART  ·  main.js  (unified + fixed)
// ═══════════════════════════════════════════════════
const API = 'http://localhost:5000/api';

// ── State ────────────────────────────────────────────
const state = {
  cart:     JSON.parse(localStorage.getItem('fm_cart')     || '[]'),
  wishlist: JSON.parse(localStorage.getItem('fm_wishlist') || '[]'),
  user:     JSON.parse(localStorage.getItem('fm_user')     || 'null'),
  token:    localStorage.getItem('fm_token')               || null,
  darkMode: localStorage.getItem('fm_dark') === 'true',
};

// ── Persist ──────────────────────────────────────────
function saveCart()    { localStorage.setItem('fm_cart',     JSON.stringify(state.cart)); updateCartUI(); }
function saveUser()    { localStorage.setItem('fm_user',     JSON.stringify(state.user)); }
function saveWishlist(){ localStorage.setItem('fm_wishlist', JSON.stringify(state.wishlist)); }

// ── API Helper ───────────────────────────────────────
async function apiCall(endpoint, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (state.token) opts.headers['Authorization'] = `Bearer ${state.token}`;
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(API + endpoint, opts);
    return await res.json();
  } catch (e) {
    console.error('API error:', e);
    return { success: false, message: 'Network error — is the server running?' };
  }
}

// ── Toast ────────────────────────────────────────────
function toast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100%)'; t.style.transition = 'all 0.3s'; }, 3200);
  setTimeout(() => t.remove(), 3600);
}

// ── Product Emoji ────────────────────────────────────
function getProductEmoji(name = '') {
  const n = name.toLowerCase();
  if (n.includes('hilsa') || n.includes('ilish')) return '🐟';
  if (n.includes('rohu'))                          return '🐠';
  if (n.includes('catfish') || n.includes('magur'))return '🐡';
  if (n.includes('pangasius'))                     return '🐟';
  if (n.includes('honey') || n.includes('মধু'))   return '🍯';
  if (n.includes('sidr'))                          return '🍯';
  if (n.includes('combo'))                         return '🎁';
  if (n.includes('fish') || n.includes('মাছ'))    return '🐟';
  return '🛒';
}

// ── Stars ────────────────────────────────────────────
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

// ── Product Card ─────────────────────────────────────
function renderProductCard(p, basePath = '') {
  const wished      = isWished(p.id);
  const displayPrice= p.sale_price || p.price;
  const hasDiscount = p.sale_price && Number(p.sale_price) < Number(p.price);
  const discountPct = hasDiscount ? Math.round((1 - p.sale_price / p.price) * 100) : 0;
  const pJson       = JSON.stringify(p).replace(/"/g, '&quot;');
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-card-image">
      ${hasDiscount ? `<span class="product-badge sale">-${discountPct}%</span>` : p.is_featured ? `<span class="product-badge">Featured</span>` : ''}
      ${p.thumbnail ? `<img src="${API.replace('/api','')}/uploads/${p.thumbnail}" alt="${p.name}" class="product-img">` : `<div class="product-img-placeholder">${getProductEmoji(p.name)}</div>`}
      <div class="product-actions-hover">
        <button class="action-btn ${wished?'wished':''}" title="Wishlist" onclick="toggleWishlistBtn(event,${pJson},this)">${wished?'❤️':'🤍'}</button>
        <button class="action-btn" title="Quick View" onclick="quickView(${p.id})">👁</button>
        <button class="action-btn" title="Add to Cart" onclick="addToCart(${pJson})">🛒</button>
      </div>
    </div>
    <div class="product-card-body">
      <div class="product-category">${p.category_name || 'Product'}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating">
        <span class="stars">${renderStars(Number(p.avg_rating)||0)}</span>
        <span class="rating-count">(${p.review_count||0})</span>
      </div>
      <div class="product-price-row">
        <div>
          <span class="product-price">৳${Number(displayPrice).toLocaleString()} <span>/${p.unit||'kg'}</span></span>
          ${hasDiscount ? `<span class="product-old-price">৳${Number(p.price).toLocaleString()}</span>` : ''}
        </div>
        <button class="product-add-btn" onclick="addToCart(${pJson})">+</button>
      </div>
    </div>
  </div>`;
}

// ── Cart ─────────────────────────────────────────────
function addToCart(product, qty = 1) {
  const existing = state.cart.find(i => i.id == product.id);
  if (existing) existing.quantity += qty;
  else state.cart.push({ ...product, quantity: qty });
  saveCart();
  toast(`${product.name} added to cart! 🛒`);
  openCart();
}
function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id != id);
  saveCart(); renderCartItems();
}
function updateQty(id, delta) {
  const item = state.cart.find(i => i.id == id);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart(); renderCartItems();
}
function getCartTotal() { return state.cart.reduce((s,i) => s + (Number(i.price)*(i.sale_price ? Number(i.sale_price)/Number(i.price) : 1) * i.quantity), 0); }
function getCartTotalRaw() { return state.cart.reduce((s,i) => s + ((Number(i.sale_price)||Number(i.price)) * i.quantity), 0); }
function getCartCount() { return state.cart.reduce((s,i) => s + i.quantity, 0); }

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = getCartCount() || '';
  renderCartItems();
}

function openCart() {
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('active');
}
function closeCart() {
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('active');
}

function renderCartItems() {
  const el     = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  if (!el) return;
  if (!state.cart.length) {
    el.innerHTML = `<div class="cart-empty"><span>🛒</span><h4>Your cart is empty</h4><p>Add some fresh products!</p></div>`;
    if (footer) footer.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = 'block';
  el.innerHTML = state.cart.map(item => {
    const price = Number(item.sale_price) || Number(item.price);
    return `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.thumbnail ? `<img src="${API.replace('/api','')}/uploads/${item.thumbnail}" alt="${item.name}">` : getProductEmoji(item.name)}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">৳${(price * item.quantity).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQty(${item.id},1)">+</button>
          <button class="cart-remove" onclick="removeFromCart(${item.id})" title="Remove">🗑</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const subtotal = getCartTotalRaw();
  const delivery = subtotal >= 1000 ? 0 : 50;
  const total    = subtotal + delivery;
  const elSub = document.getElementById('cart-subtotal');
  const elDel = document.getElementById('cart-delivery');
  const elTot = document.getElementById('cart-total');
  if (elSub) elSub.textContent = `৳${subtotal.toLocaleString()}`;
  if (elDel) elDel.textContent = delivery === 0 ? 'FREE' : `৳${delivery}`;
  if (elTot) elTot.textContent = `৳${total.toLocaleString()}`;
}

// ── Wishlist ─────────────────────────────────────────
function toggleWishlist(product, btn) {
  const idx = state.wishlist.findIndex(i => i.id == product.id);
  if (idx > -1) {
    state.wishlist.splice(idx, 1);
    if (btn) { btn.textContent = '🤍'; btn.classList.remove('wished'); }
    toast('Removed from wishlist', 'info');
  } else {
    state.wishlist.push(product);
    if (btn) { btn.textContent = '❤️'; btn.classList.add('wished'); }
    toast('Added to wishlist ❤️');
  }
  saveWishlist();
  const wb = document.getElementById('wishlist-badge');
  if (wb) wb.textContent = state.wishlist.length || '';
}
function isWished(id) { return state.wishlist.some(i => i.id == id); }
function toggleWishlistBtn(e, product, btn) {
  e.stopPropagation();
  toggleWishlist(product, btn);
}

// ── Auth ─────────────────────────────────────────────
function isLoggedIn() { return !!state.token && !!state.user; }

function login(user, token) {
  state.user  = user;
  state.token = token;
  localStorage.setItem('fm_token', token);
  saveUser(); updateAuthUI();
}

function logout() {
  state.user  = null;
  state.token = null;
  localStorage.removeItem('fm_token');
  localStorage.removeItem('fm_user');
  updateAuthUI();
  toast('Logged out', 'info');
  window.location.href = '/index.html';
}

function updateAuthUI() {
  const authBtns = document.getElementById('auth-btns');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');
  if (isLoggedIn()) {
    if (authBtns) authBtns.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName) userName.textContent = state.user.name?.split(' ')[0] || 'Profile';
  } else {
    if (authBtns) authBtns.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
  }
}

// ── Dark Mode ─────────────────────────────────────────
function initDarkMode() {
  if (state.darkMode) document.documentElement.classList.add('dark');
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.textContent = state.darkMode ? '☀️' : '🌙';
}
function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.documentElement.classList.toggle('dark', state.darkMode);
  localStorage.setItem('fm_dark', state.darkMode);
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.textContent = state.darkMode ? '☀️' : '🌙';
}

// ── Navbar Inject ─────────────────────────────────────
function renderNavbar(activePage, base = '') {
  const navEl = document.getElementById('navbar-root');
  if (!navEl) return;

  navEl.innerHTML = `
  <header id="site-header">

    <!-- MAIN NAVBAR -->
    <nav class="main-navbar">
      <!-- Logo -->
      <a href="${base}/index.html" class="nav-logo" aria-label="DokkhinMart Home">
        <div class="logo-icon"></div>
        <div class="brand-text">
          <span class="brand-name">DokkhinMart</span>
          <span class="brand-tagline">Pure · Fresh · Local</span>
        </div>
      </a>

      <!-- Right Actions -->
      <div class="nav-actions">

        <!-- Track Order -->
        <button class="nav-btn" title="Track Order" onclick="window.location.href='${base}/pages/profile.html'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/>
            <path d="M8 4l4-2 4 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="btn-label">Track</span>
        </button>

        <div class="nav-divider"></div>

        <!-- Auth buttons (toggled by updateAuthUI) -->
        <div id="auth-btns" style="display:flex;gap:6px;align-items:center;">
          <a href="${base}/pages/auth.html" class="nav-btn signin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.7"/>
              <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="white" stroke-width="1.7" stroke-linecap="round"/>
            </svg>
            <span class="btn-label">Sign In</span>
          </a>
        </div>
        <div id="user-menu" style="display:none;align-items:center;gap:6px;">
          <a href="${base}/pages/profile.html" class="nav-btn signin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.7"/>
              <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="white" stroke-width="1.7" stroke-linecap="round"/>
            </svg>
            <span class="btn-label" id="user-name">Account</span>
          </a>
          <button class="nav-btn" onclick="logout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 12a9 9 0 019-9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            </svg>
            <span class="btn-label">Logout</span>
          </button>
        </div>

        <!-- Dark mode -->
        <button class="nav-btn" id="dark-toggle" onclick="toggleDarkMode()" title="Dark mode">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="btn-label">Theme</span>
        </button>

        <!-- Wishlist -->
        <button class="nav-btn" title="Wishlist" onclick="window.location.href='${base}/pages/wishlist.html'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 21C12 21 4 15.5 4 9.5C4 7.01 5.91 5 8.5 5C10.24 5 11.91 5.91 12 7C12.09 5.91 13.76 5 15.5 5C18.09 5 20 7.01 20 9.5C20 15.5 12 21 12 21Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="btn-label">Wishlist</span>
          <span class="badge" id="wishlist-badge">${state.wishlist.length||''}</span>
        </button>

        <!-- Cart -->
        <button class="nav-btn" title="Cart" onclick="openCart()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="btn-label">Cart</span>
          <span class="badge" id="cart-badge">${getCartCount()||''}</span>
        </button>

        <!-- Hamburger (mobile) -->
        <button class="hamburger" id="nav-hamburger" onclick="toggleMobileNav()" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- Mobile Drawer -->
      <div class="mobile-menu" id="mobile-menu">
        <div class="mobile-search">
          <input type="text" placeholder="Search products…"/>
          <button>Search</button>
        </div>
        <div class="mobile-actions">
          <a href="${base}/pages/auth.html" class="mobile-action-btn primary" id="mob-signin-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.7"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="white" stroke-width="1.7" stroke-linecap="round"/></svg>
            Sign In / Register
          </a>
          <button class="mobile-action-btn" onclick="window.location.href='${base}/pages/profile.html'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/></svg>
            Track Order
          </button>
          <button class="mobile-action-btn" onclick="window.location.href='${base}/pages/wishlist.html'">
            <div class="rel">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 4 15.5 4 9.5C4 7.01 5.91 5 8.5 5C10.24 5 11.91 5.91 12 7C12.09 5.91 13.76 5 15.5 5C18.09 5 20 7.01 20 9.5C20 15.5 12 21 12 21Z" stroke="currentColor" stroke-width="1.7"/></svg>
              <span class="badge" id="mob-wishlist-badge">${state.wishlist.length||''}</span>
            </div>
            Wishlist
          </button>
          <button class="mobile-action-btn" onclick="openCart()">
            <div class="rel">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-width="1.7"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1.7"/><path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="1.7"/></svg>
              <span class="badge" id="mob-cart-badge">${getCartCount()||''}</span>
            </div>
            Cart
          </button>
          <button class="mobile-action-btn" onclick="toggleDarkMode()" style="grid-column:1/-1;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.7"/></svg>
            Toggle Dark Mode
          </button>
        </div>

        <!-- Mobile Category Accordion -->
        <div class="mob-cat-section">
          <div class="mob-cat-title">Shop by Category</div>
          <div id="mob-cat-list"></div>
        </div>
      </div>

    </nav>

    <!-- CATEGORY BAR -->
    <nav class="category-bar" aria-label="Category navigation">
      <div class="cat-inner" id="cat-inner-bar"></div>
    </nav>

  </header>
  <div id="mobile-overlay" class="mobile-overlay" onclick="closeMobileNav()"></div>`;

  updateAuthUI();
  initDarkMode();
  renderCategoryBar(base);
  initNavbarScroll();
}

function initNavbarScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.removeEventListener('scroll', window._navScrollHandler);
  window._navScrollHandler = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    const mm = document.getElementById('mobile-menu');
    const ham = document.getElementById('nav-hamburger');
    if (mm && ham && !mm.contains(e.target) && !ham.contains(e.target)) {
      mm.classList.remove('open');
      ham.classList.remove('open');
    }
  });
}

// ── Category Bar ─────────────────────────────────────
const CATEGORIES = [
  {
    id: 'honey', label: 'Honey', emoji: '🍯',
    items: [
      { label: 'Sundarbans Wild Honey',   icon: '🌸', slug: 'sundarbans-wild-honey',  tag: 'hot' },
      { label: 'Mustard Flower Honey',    icon: '🌿', slug: 'mustard-flower-honey',   tag: 'new' },
      { label: 'Litchi Honey',            icon: '🌺', slug: 'litchi-honey',           tag: '' },
      { label: 'Mixed Flower Honey',      icon: '🌾', slug: 'mixed-flower-honey',     tag: '' },
      { label: 'Raw Unfiltered Honey',    icon: '🏺', slug: 'raw-unfiltered-honey',   tag: 'sale' },
      { label: 'Honey Gift Sets',         icon: '🫙', slug: 'honey-gift-sets',        tag: '' },
    ]
  },
  {
    id: 'fresh-fish', label: 'Fresh Fish', emoji: '🐟',
    items: [
      { label: 'Hilsa (Ilish)',           icon: '🐠', slug: 'hilsa-ilish',            tag: 'hot' },
      { label: 'Rohu (Rui)',              icon: '🐡', slug: 'rohu-rui',               tag: '' },
      { label: 'Catla (Katla)',           icon: '🐟', slug: 'catla-katla',            tag: '' },
      { label: 'Pangas',                  icon: '🦈', slug: 'pangas',                 tag: '' },
      { label: 'Tilapia',                 icon: '🐾', slug: 'tilapia',                tag: 'fresh' },
      { label: 'Boal',                    icon: '🌊', slug: 'boal',                   tag: '' },
      { label: 'Whole / Cut / Fillet',    icon: '🫙', slug: 'whole-cut-fillet',       tag: '' },
    ]
  },
  {
    id: 'seafood', label: 'Seafood', emoji: '🦐',
    items: [
      { label: 'Tiger Prawn (Bagda)',     icon: '🦞', slug: 'tiger-prawn',            tag: 'hot' },
      { label: 'Galda Prawn',             icon: '🦐', slug: 'galda-prawn',            tag: '' },
      { label: 'Blue Crab',              icon: '🦀', slug: 'blue-crab',              tag: '' },
      { label: 'Squid (Calamari)',        icon: '🦑', slug: 'squid',                  tag: '' },
      { label: 'Lobster',                 icon: '🐙', slug: 'lobster',                tag: 'new' },
      { label: 'Clams & Oysters',         icon: '🐚', slug: 'clams-oysters',          tag: '' },
      { label: 'Sea Bass',                icon: '🐠', slug: 'sea-bass',               tag: '' },
    ]
  },
  {
    id: 'dried-fish', label: 'Dried Fish', emoji: '🐡',
    items: [
      { label: 'Loitta Shutki',           icon: '🌬️', slug: 'loitta-shutki',          tag: 'sale' },
      { label: 'Churi Shutki',            icon: '🔥', slug: 'churi-shutki',           tag: '' },
      { label: 'Rupchanda Shutki',        icon: '🌊', slug: 'rupchanda-shutki',       tag: '' },
      { label: 'Koral Shutki',            icon: '🐟', slug: 'koral-shutki',           tag: '' },
      { label: 'Shutki Pack (Mix)',        icon: '🫙', slug: 'shutki-mix',             tag: '' },
      { label: 'Dried Prawn (Chingri)',    icon: '📦', slug: 'dried-prawn',            tag: '' },
    ]
  },
  {
    id: 'local-groceries', label: 'Local Groceries', emoji: '🥬',
    items: [
      { label: 'Cold Press Mustard Oil',  icon: '🫒', slug: 'mustard-oil',            tag: 'new' },
      { label: 'Aromatic Rice (Basmati)', icon: '🌾', slug: 'aromatic-rice',          tag: '' },
      { label: 'Spices & Masala',         icon: '🌶️', slug: 'spices-masala',          tag: '' },
      { label: 'Lentils & Dal',           icon: '🫘', slug: 'lentils-dal',            tag: '' },
      { label: 'Seasonal Vegetables',     icon: '🍅', slug: 'vegetables',             tag: '' },
      { label: 'Coconut Products',        icon: '🥥', slug: 'coconut',                tag: '' },
      { label: 'Garlic & Onion',          icon: '🧄', slug: 'garlic-onion',           tag: '' },
    ]
  },
  {
    id: 'combo-offers', label: 'Combo Offers', emoji: '🎁',
    items: [
      { label: 'Fish Lovers Pack',        icon: '🐟', slug: 'fish-lovers-pack',       tag: 'sale' },
      { label: 'Honey + Mustard Bundle',  icon: '🍯', slug: 'honey-mustard-bundle',   tag: 'hot' },
      { label: 'Seafood Feast Box',       icon: '🦐', slug: 'seafood-feast-box',      tag: '' },
      { label: 'Weekly Grocery Kit',      icon: '🥬', slug: 'weekly-grocery-kit',     tag: '' },
      { label: 'Eid Gift Hamper',         icon: '🎀', slug: 'eid-gift-hamper',        tag: 'new' },
      { label: 'Family Value Pack',       icon: '👨‍👩‍👧', slug: 'family-value-pack',     tag: '' },
    ]
  },
];

function _tagHTML(tag) {
  if (!tag) return '';
  const map = { hot:'hot', new:'new', sale:'sale', fresh:'fresh' };
  return `<span class="tag ${map[tag]||''}">${tag}</span>`;
}

function renderCategoryBar(base = '') {
  const bar = document.getElementById('cat-inner-bar');
  if (!bar) return;

  // Render only the trigger links (no inline dropdown divs)
  bar.innerHTML = CATEGORIES.map(cat => `
    <div class="cat-item" data-cat="${cat.id}">
      <div class="cat-link" onclick="navigateCategory('${cat.id}','${base}')">
        <span class="cat-emoji">${cat.emoji}</span>
        ${cat.label}
        <svg class="chevron" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>`).join('');

  // Build mobile category accordion
  const mobList = document.getElementById('mob-cat-list');
  if (mobList) {
    mobList.innerHTML = CATEGORIES.map(cat => `
      <div class="mob-cat-item">
        <button class="mob-cat-header" onclick="toggleMobCat('${cat.id}')">
          <span>${cat.emoji} ${cat.label}</span>
          <svg class="mob-chevron" id="mob-chev-${cat.id}" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="mob-cat-body" id="mob-cat-body-${cat.id}">
          ${cat.items.map(it => `
            <a href="${base}/pages/shop.html?category=${it.slug}" class="mob-cat-subitem">${it.icon} ${it.label}</a>`).join('')}
          <a href="${base}/pages/shop.html?category=${cat.id}" class="mob-cat-subitem mob-cat-all">View all</a>
        </div>
      </div>`).join('');
  }

  // Create a single shared portal div at body level (outside all stacking contexts)
  let portal = document.getElementById('cat-dropdown-portal');
  if (!portal) {
    portal = document.createElement('div');
    portal.id = 'cat-dropdown-portal';
    document.body.appendChild(portal);
  }
  portal.innerHTML = '';

  // Pre-build all dropdown panels into the portal
  CATEGORIES.forEach(cat => {
    const dd = document.createElement('div');
    dd.className = 'cat-dropdown';
    dd.dataset.cat = cat.id;
    dd.innerHTML =
      '<div class="dd-header">' + cat.emoji + ' ' + cat.label + '</div>' +
      cat.items.map(it =>
        '<a class="dd-item" href="' + base + '/pages/shop.html?category=' + it.slug + '">' +
        '<span class="item-icon">' + it.icon + '</span>' +
        it.label +
        _tagHTML(it.tag) +
        '</a>'
      ).join('') +
      '<a class="dd-view-all" href="' + base + '/pages/shop.html?category=' + cat.id + '">View all ' + cat.label + '</a>';
    portal.appendChild(dd);
  });

  let hideTimer = null;

  function showDropdown(catId, triggerEl) {
    clearTimeout(hideTimer);
    portal.querySelectorAll('.cat-dropdown').forEach(d => {
      d.style.opacity = '0';
      d.style.visibility = 'hidden';
      d.style.transform = 'translateY(-6px) scale(0.97)';
    });
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));

    const dd = portal.querySelector('.cat-dropdown[data-cat="' + catId + '"]');
    if (!dd) return;

    const rect = triggerEl.getBoundingClientRect();
    dd.style.position = 'fixed';
    dd.style.top = (rect.bottom + 4) + 'px';
    dd.style.left = rect.left + 'px';
    dd.style.opacity = '1';
    dd.style.visibility = 'visible';
    dd.style.transform = 'translateY(0) scale(1)';
    triggerEl.classList.add('active');
  }

  function scheduleHide(catId, triggerEl) {
    hideTimer = setTimeout(function() {
      const dd = portal.querySelector('.cat-dropdown[data-cat="' + catId + '"]');
      if (dd) {
        dd.style.opacity = '0';
        dd.style.visibility = 'hidden';
        dd.style.transform = 'translateY(-6px) scale(0.97)';
      }
      if (triggerEl) triggerEl.classList.remove('active');
    }, 120);
  }

  document.querySelectorAll('.cat-item').forEach(function(item) {
    const catId = item.dataset.cat;

    if (window.innerWidth > 860) {
      item.addEventListener('mouseenter', function() { showDropdown(catId, item); });
      item.addEventListener('mouseleave', function() { scheduleHide(catId, item); });

      const dd = portal.querySelector('.cat-dropdown[data-cat="' + catId + '"]');
      if (dd) {
        dd.addEventListener('mouseenter', function() { clearTimeout(hideTimer); });
        dd.addEventListener('mouseleave', function() { scheduleHide(catId, item); });
      }
    }

    item.querySelector('.cat-link').addEventListener('click', function(e) {
      if (window.innerWidth <= 860) {
        e.stopPropagation();
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.cat-item').forEach(function(i) { i.classList.remove('active'); });
        portal.querySelectorAll('.cat-dropdown').forEach(function(d) {
          d.style.opacity = '0'; d.style.visibility = 'hidden';
        });
        if (!wasActive) showDropdown(catId, item);
      }
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.cat-item') && !e.target.closest('.cat-dropdown')) {
      portal.querySelectorAll('.cat-dropdown').forEach(function(d) {
        d.style.opacity = '0';
        d.style.visibility = 'hidden';
        d.style.transform = 'translateY(-6px) scale(0.97)';
      });
      document.querySelectorAll('.cat-item').forEach(function(i) { i.classList.remove('active'); });
    }
  });
}

function toggleMobCat(catId) {
  const body = document.getElementById('mob-cat-body-' + catId);
  const chev = document.getElementById('mob-chev-' + catId);
  if (!body) return;
  const open = body.classList.toggle('open');
  if (chev) chev.style.transform = open ? 'rotate(180deg)' : '';
}

function navigateCategory(catId, base) {
  window.location.href = (base || '') + '/pages/shop.html?category=' + catId;
}

function toggleMobileNav() {
  const mm  = document.getElementById('mobile-menu');
  const ham = document.getElementById('nav-hamburger');
  const ov  = document.getElementById('mobile-overlay');
  if (!mm) return;
  const open = mm.classList.toggle('open');
  if (ham) ham.classList.toggle('open', open);
  if (ov)  ov.classList.toggle('active', open);
}

function closeMobileNav() {
  const mm  = document.getElementById('mobile-menu');
  const ham = document.getElementById('nav-hamburger');
  const ov  = document.getElementById('mobile-overlay');
  if (mm)  mm.classList.remove('open');
  if (ham) ham.classList.remove('open');
  if (ov)  ov.classList.remove('active');
}

// ── Cart Sidebar Inject ───────────────────────────────
function renderCartSidebar(checkoutPath = 'pages/checkout.html') {
  const el = document.getElementById('cart-root');
  if (!el) return;
  el.innerHTML = `
  <div id="cart-overlay" class="cart-overlay" onclick="closeCart()"></div>
  <div id="cart-sidebar" class="cart-sidebar">
    <div class="cart-header">
      <h3>🛒 Your Cart</h3>
      <button class="modal-close" onclick="closeCart()">×</button>
    </div>
    <div class="cart-items" id="cart-items"></div>
    <div class="cart-footer" id="cart-footer" style="display:none;">
      <div class="cart-totals">
        <div class="cart-total-row"><span>Subtotal</span><span id="cart-subtotal">৳0</span></div>
        <div class="cart-total-row"><span>Delivery</span><span id="cart-delivery">৳50</span></div>
        <div class="cart-total-row total"><span>Total</span><span id="cart-total">৳0</span></div>
      </div>
      <p style="font-size:12px;color:var(--text-light);margin-bottom:12px;">Free delivery on orders over ৳1000</p>
      <a href="${checkoutPath}" class="btn btn-primary btn-block">Proceed to Checkout →</a>
    </div>
  </div>`;
  renderCartItems();
}

// ── Footer Inject ─────────────────────────────────────
function renderFooter(base = '..') {
  const el = document.getElementById('footer-root');
  if (!el) return;
  el.innerHTML = `
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand-name">🐟 DokkhinMart</div>
          <p>Fresh Fish & Pure Honey delivered directly from the source to your doorstep. Quality you can taste, freshness you can trust.</p>
          <div class="footer-socials">
            <a href="#" class="social-link">📘</a>
            <a href="#" class="social-link">📸</a>
            <a href="https://wa.me/8801700000000" class="social-link" target="_blank">💬</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="${base}/index.html">Home</a></li>
            <li><a href="${base}/pages/shop.html">Shop</a></li>
            <li><a href="${base}/pages/about.html">About Us</a></li>
            <li><a href="${base}/pages/contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="${base}/pages/shop.html?category=fresh-fish">Fresh Fish</a></li>
            <li><a href="${base}/pages/shop.html?category=pure-honey">Pure Honey</a></li>
            <li><a href="${base}/pages/shop.html?category=hilsa-fish">Hilsa Fish</a></li>
            <li><a href="${base}/pages/shop.html?category=combo-offers">Combo Offers</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <div class="footer-contact-item"><span>📞</span><span>+880 17 0000 0000</span></div>
          <div class="footer-contact-item"><span>📧</span><span>info@dokkhinmart.com</span></div>
          <div class="footer-contact-item"><span>📍</span><span>Dhaka, Bangladesh</span></div>
          <div class="footer-contact-item"><span>⏰</span><span>Delivery: 6AM – 10PM</span></div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 DokkhinMart. All rights reserved.</p>
        <div class="payment-icons">
          <span class="pay-icon">💵 COD</span>
          <span class="pay-icon">📱 bKash</span>
          <span class="pay-icon">📱 Nagad</span>
          <span class="pay-icon">💳 Card</span>
        </div>
      </div>
    </div>
  </footer>`;
}

// ── Quick View ────────────────────────────────────────
async function quickView(productId) {
  let overlay = document.getElementById('quick-view-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'quick-view-overlay';
    overlay.className = 'modal-overlay';
    overlay.onclick = e => { if (e.target === overlay) closeQuickView(); };
    document.body.appendChild(overlay);
  }
  overlay.classList.add('active');
  overlay.innerHTML = `<div class="modal"><div class="loading-center"><div class="loading-spinner"></div></div></div>`;

  const data = await apiCall(`/products/${productId}`);
  if (!data.success) {
    overlay.innerHTML = `<div class="modal"><p style="color:var(--danger)">Failed to load product.</p></div>`;
    return;
  }
  const p    = data.product;
  const pJson= JSON.stringify(p).replace(/"/g,'&quot;');
  overlay.innerHTML = `
  <div class="modal">
    <div class="modal-header">
      <h3 class="modal-title">${p.name}</h3>
      <button class="modal-close" onclick="closeQuickView()">×</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start;">
      <div style="background:var(--green-pale);border-radius:14px;height:220px;display:flex;align-items:center;justify-content:center;font-size:90px;">
        ${getProductEmoji(p.name)}
      </div>
      <div>
        <div class="product-rating" style="margin-bottom:10px;">
          <span class="stars">${renderStars(Number(p.avg_rating)||0)}</span>
          <span class="rating-count">(${p.review_count||0})</span>
        </div>
        <div style="font-size:28px;font-weight:800;color:var(--green-dark);margin-bottom:8px;">
          ৳${Number(p.sale_price||p.price).toLocaleString()} <span style="font-size:14px;color:var(--text-light)">/${p.unit}</span>
        </div>
        <p style="font-size:14px;color:var(--text-mid);margin-bottom:20px;line-height:1.7;">${p.short_description||p.description?.substring(0,150)||''}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="addToCart(${pJson});closeQuickView()">🛒 Add to Cart</button>
          <a href="product.html?slug=${p.slug}" class="btn btn-outline">View Details</a>
        </div>
      </div>
    </div>
  </div>`;
}
function closeQuickView() {
  document.getElementById('quick-view-overlay')?.classList.remove('active');
}

// ── Live Chat Widget ──────────────────────────────────
function renderLiveChat() {
  if (document.getElementById('live-chat-root')) return;
  const el = document.createElement('div');
  el.id = 'live-chat-root';
  document.body.appendChild(el);

  el.innerHTML = `
  <div id="live-chat-widget">
    <!-- Toggle Button -->
    <button id="live-chat-toggle" onclick="toggleLiveChat()" title="Live Support" aria-label="Open Live Chat">
      <svg id="chat-icon-open" width="26" height="26" viewBox="0 0 24 24" fill="none" style="display:block">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="9" cy="10" r="1" fill="white"/><circle cx="12" cy="10" r="1" fill="white"/><circle cx="15" cy="10" r="1" fill="white"/>
      </svg>
      <svg id="chat-icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" style="display:none">
        <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span id="chat-unread-dot"></span>
    </button>

    <!-- Chat Panel -->
    <div id="live-chat-panel" style="display:none;">
      <div class="lc-header">
        <div class="lc-header-info">
          <div class="lc-avatar">🐟</div>
          <div>
            <div class="lc-title">DokkhinMart Support</div>
            <div class="lc-status"><span class="lc-online-dot"></span> Online now</div>
          </div>
        </div>
        <button onclick="toggleLiveChat()" class="lc-close-btn" aria-label="Close chat">✕</button>
      </div>

      <div class="lc-messages" id="lc-messages">
        <div class="lc-msg bot">
          <div class="lc-bubble">হাই! 👋 DokkhinMart-এ স্বাগতম।<br>আমরা কীভাবে সাহায্য করতে পারি?</div>
          <div class="lc-time">Just now</div>
        </div>
      </div>

      <div class="lc-quick-replies" id="lc-quick-replies">
        <button onclick="lcQuickReply('ডেলিভারি সম্পর্কে জানতে চাই')">🚚 ডেলিভারি</button>
        <button onclick="lcQuickReply('মাছের দাম জানতে চাই')">🐟 মাছের দাম</button>
        <button onclick="lcQuickReply('অর্ডার ট্র্যাক করতে চাই')">📦 অর্ডার ট্র্যাক</button>
        <button onclick="lcQuickReply('মধুর মান সম্পর্কে')">🍯 মধু</button>
      </div>

      <div class="lc-input-bar">
        <input type="text" id="lc-input" placeholder="Type a message…" onkeydown="if(event.key==='Enter')lcSend()"/>
        <button onclick="lcSend()" class="lc-send-btn" aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>`;
}

const lcBotReplies = {
  'ডেলিভারি': 'আমরা ঢাকা ও আশেপাশের এলাকায় প্রতিদিন সকাল ৬টা – রাত ১০টার মধ্যে ডেলিভারি দিই। ৳৫০০+ অর্ডারে ফ্রি ডেলিভারি! 🚚',
  'মাছ': 'আমাদের সব মাছ তাজা ও সরাসরি সুন্দরবন থেকে আনা হয়। ইলিশ, চিংড়ি, ভেটকি সব পাওয়া যায়। Shop পেজ দেখুন! 🐟',
  'অর্ডার': 'আপনার অর্ডার ট্র্যাক করতে Profile পেজে যান অথবা আমাদের হোয়াটসঅ্যাপে যোগাযোগ করুন: +880 17 0000 0000 📦',
  'মধু': 'আমাদের মধু ১০০% খাঁটি সুন্দরবনের মধু। কোনো কৃত্রিম উপাদান নেই। বিস্তারিত জানতে Shop পেজ দেখুন 🍯',
  'default': 'ধন্যবাদ আপনার বার্তার জন্য! আরো সাহায্যের জন্য আমাদের কল করুন: 📞 +880 17 0000 0000 বা ইমেইল করুন: info@dokkhinmart.com'
};

function toggleLiveChat() {
  const panel = document.getElementById('live-chat-panel');
  const openIcon = document.getElementById('chat-icon-open');
  const closeIcon = document.getElementById('chat-icon-close');
  const dot = document.getElementById('chat-unread-dot');
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'flex';
  openIcon.style.display = isOpen ? 'block' : 'none';
  closeIcon.style.display = isOpen ? 'none' : 'block';
  if (!isOpen && dot) dot.style.display = 'none';
  if (!isOpen) document.getElementById('lc-input')?.focus();
}

function lcSend() {
  const input = document.getElementById('lc-input');
  const text = input?.value.trim();
  if (!text) return;
  input.value = '';
  lcAddMsg(text, 'user');
  document.getElementById('lc-quick-replies').style.display = 'none';
  setTimeout(() => {
    const key = Object.keys(lcBotReplies).find(k => text.includes(k)) || 'default';
    lcAddMsg(lcBotReplies[key], 'bot');
  }, 600);
}

function lcQuickReply(text) {
  document.getElementById('lc-quick-replies').style.display = 'none';
  lcAddMsg(text, 'user');
  setTimeout(() => {
    const key = Object.keys(lcBotReplies).find(k => text.includes(k)) || 'default';
    lcAddMsg(lcBotReplies[key], 'bot');
  }, 600);
}

function lcAddMsg(text, type) {
  const container = document.getElementById('lc-messages');
  if (!container) return;
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `lc-msg ${type}`;
  div.innerHTML = `<div class="lc-bubble">${text}</div><div class="lc-time">${time}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// ── DOMContentLoaded ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // update badges
  updateCartUI();
  const wb = document.getElementById('wishlist-badge');
  if (wb && state.wishlist.length) wb.textContent = state.wishlist.length;
  // render live chat
  renderLiveChat();
});