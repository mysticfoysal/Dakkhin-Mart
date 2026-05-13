import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

// ─── CART CONTEXT ─────────────────────────────────────────────────────────────

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = `${action.item.id}-${action.item.selectedWeight}`;
      const existing = state.items.find(i => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.key === key ? { ...i, quantity: i.quantity + action.item.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, key }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.key !== action.key) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.key === action.key ? { ...i, quantity: action.quantity } : i
        ).filter(i => i.quantity > 0),
      };
    case 'CLEAR':
      return { items: [] };
    case 'LOAD':
      return { items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const saved = localStorage.getItem('fm_cart');
    if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem('fm_cart', JSON.stringify(state.items));
  }, [state.items]);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, dispatch, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('fm_token', data.token);
    localStorage.setItem('fm_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('fm_token', data.token);
    localStorage.setItem('fm_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fm_token');
    localStorage.removeItem('fm_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ─── TOAST / NOTIFICATION CONTEXT ─────────────────────────────────────────────

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// ─── WISHLIST CONTEXT ──────────────────────────────────────────────────────────

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth ? useAuth() : { user: null };

  const fetchWishlist = useCallback(async () => {
    if (!localStorage.getItem('fm_token')) return;
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data.items.map(i => i.product_id));
    } catch {}
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggle = async (product_id) => {
    if (!localStorage.getItem('fm_token')) return false;
    try {
      const { data } = await api.post('/wishlist/toggle', { product_id });
      if (data.action === 'added') setWishlist(w => [...w, product_id]);
      else setWishlist(w => w.filter(id => id !== product_id));
      return data.action;
    } catch { return false; }
  };

  const isWishlisted = (id) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);