-- FreshMart eCommerce Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS freshmart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE freshmart;

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  avatar VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(255),
  parent_id INT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Products Table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  category_id INT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  unit ENUM('kg', 'piece', 'pack', 'litre') DEFAULT 'kg',
  stock_quantity INT DEFAULT 0,
  min_order_qty DECIMAL(5,2) DEFAULT 0.5,
  weight_options JSON,
  images JSON,
  thumbnail VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  tags VARCHAR(500),
  sku VARCHAR(100) UNIQUE,
  total_sold INT DEFAULT 0,
  meta_title VARCHAR(200),
  meta_description VARCHAR(300),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Product Attributes (for weight-based pricing)
CREATE TABLE product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'kg',
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  sku VARCHAR(100),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(30) UNIQUE NOT NULL,
  user_id INT,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(150),
  delivery_address TEXT NOT NULL,
  delivery_type ENUM('12h', '24h') DEFAULT '24h',
  delivery_charge DECIMAL(8,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  coupon_code VARCHAR(50),
  payment_method ENUM('cod', 'bkash', 'nagad', 'card') DEFAULT 'cod',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  order_status ENUM('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
  tracking_notes TEXT,
  estimated_delivery DATETIME,
  delivered_at DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(200) NOT NULL,
  product_image VARCHAR(255),
  weight DECIMAL(5,2),
  unit VARCHAR(20),
  quantity DECIMAL(8,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Reviews Table
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_id INT,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  UNIQUE KEY unique_review (product_id, user_id, order_id)
);

-- Wishlist / Favorites Table
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist (user_id, product_id)
);

-- Coupons Table
CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('percentage', 'fixed') DEFAULT 'percentage',
  value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INT DEFAULT 1,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('cod', 'bkash', 'nagad', 'card') NOT NULL,
  transaction_id VARCHAR(100),
  gateway_response JSON,
  status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  paid_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Cart Sessions (for guest users)
CREATE TABLE cart_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  cart_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Banner / Promo Table
CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300),
  image VARCHAR(255),
  link VARCHAR(255),
  position ENUM('hero', 'promo', 'sidebar') DEFAULT 'hero',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  starts_at DATETIME,
  ends_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- Seed: Default Admin User (password: admin123)
INSERT INTO users (name, email, password, role, is_verified) VALUES
('Admin', 'admin@freshmart.com', '$2b$10$YourHashedPasswordHere', 'admin', TRUE);

-- Seed: Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Fresh Fish', 'fresh-fish', 'Farm-fresh fish delivered to your door', 1),
('Pure Honey', 'pure-honey', 'Natural organic honey from trusted beekeepers', 2),
('Combo Offers', 'combo-offers', 'Great value combo packs', 3),
('Hilsa Fish', 'hilsa-fish', 'Premium Hilsa (Ilish) fish', 4),
('Catfish', 'catfish', 'Fresh catfish varieties', 5),
('Rohu Fish', 'rohu-fish', 'Fresh Rohu fish', 6);

-- Update parent categories for fish sub-categories
UPDATE categories SET parent_id = 1 WHERE slug IN ('hilsa-fish', 'catfish', 'rohu-fish');

-- Seed: Sample Products
INSERT INTO products (name, slug, description, short_description, category_id, price, unit, stock_quantity, weight_options, is_active, is_featured, total_sold) VALUES
('Fresh Hilsa Fish (Ilish)', 'fresh-hilsa-fish', 'Premium quality Hilsa fish sourced directly from the river. Rich in omega-3 fatty acids and known for its distinctive taste.', 'Premium river Hilsa fish', 4, 850.00, 'kg', 50, '[0.5, 1, 1.5, 2]', TRUE, TRUE, 245),
('Fresh Rohu Fish', 'fresh-rohu-fish', 'Farm-fresh Rohu fish, cleaned and scaled. Perfect for curry and fry preparations.', 'Fresh farm-raised Rohu fish', 6, 280.00, 'kg', 80, '[0.5, 1, 2]', TRUE, TRUE, 312),
('Wild Honey (Raw)', 'wild-honey-raw', 'Pure, unfiltered wild honey collected from natural forests. 100% natural with no additives.', 'Natural unfiltered wild honey', 2, 650.00, 'kg', 30, '[0.25, 0.5, 1]', TRUE, TRUE, 189),
('Catfish (Magur)', 'catfish-magur', 'Live Magur catfish, ideal for health-conscious consumers. High in protein.', 'Fresh live Magur catfish', 5, 380.00, 'kg', 40, '[0.5, 1, 2]', TRUE, FALSE, 98),
('Hilsa + Honey Combo', 'hilsa-honey-combo', 'Special combo pack with 1kg Hilsa fish and 500g Pure Honey at a discounted price.', '1kg Hilsa + 500g Honey combo', 3, 1150.00, 'piece', 20, '[1]', TRUE, TRUE, 67),
('Sidr Honey (Beri Phul)', 'sidr-honey', 'Premium Sidr honey from the Sundarbans. Dark golden color with rich aroma.', 'Premium Sundarbans Sidr honey', 2, 1200.00, 'kg', 15, '[0.25, 0.5, 1]', TRUE, TRUE, 145),
('Fresh Pangasius Fish', 'fresh-pangasius', 'Farm-raised Pangasius fish, boneless fillets available. Mild flavor, perfect for multiple preparations.', 'Farm-raised Pangasius fillets', 1, 220.00, 'kg', 100, '[0.5, 1, 2, 3]', TRUE, FALSE, 423);

-- Seed: Settings
INSERT INTO settings (key_name, value, type) VALUES
('site_name', 'FreshMart', 'text'),
('site_tagline', 'Fresh Fish & Pure Honey – Direct from Source', 'text'),
('currency', 'BDT', 'text'),
('currency_symbol', '৳', 'text'),
('delivery_charge_12h', '80', 'number'),
('delivery_charge_24h', '50', 'number'),
('free_delivery_min', '1000', 'number'),
('whatsapp_number', '+8801700000000', 'text'),
('phone', '+8801700000000', 'text'),
('email', 'info@freshmart.com', 'text'),
('address', 'Dhaka, Bangladesh', 'text'),
('quick_delivery_cutoff_am', '06:30', 'text'),
('quick_delivery_cutoff_pm', '18:30', 'text');