// Seed script to populate DokkhinMart database with premium products
// Run with: node seed-products.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'freshmart',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const categories = [
  { name: 'Pure Honey', slug: 'honey', description: 'Premium honey from Sundarbans and beyond' },
  { name: 'Fish & Seafood', slug: 'fish-seafood', description: 'Fresh catch from coastal waters' },
  { name: 'Dried Fish', slug: 'dried-fish', description: 'Traditional sun-dried fish varieties' },
  { name: 'Local Groceries', slug: 'local-groceries', description: 'Authentic Sundarbans local products' }
];

const products = [
  // Honey Products
  {
    name: 'Sundarbans Raw Honey',
    slug: 'sundarbans-raw-honey',
    category_slug: 'honey',
    price: 850,
    sale_price: 750,
    description: 'Pure raw honey from the Sundarbans forest. Unfiltered, unheated, packed with natural enzymes and bee pollen.',
    short_description: 'Raw honey from Sundarbans - unfiltered and unheated',
    unit: 'kg',
    stock: 45,
    is_featured: true,
    tags: 'honey,organic,raw,sundarbans'
  },
  {
    name: 'Mustard Flower Honey',
    slug: 'mustard-flower-honey',
    category_slug: 'honey',
    price: 720,
    sale_price: 640,
    description: 'Amber honey from mustard flowers. Light flavor with subtle sweetness. Perfect for daily use.',
    short_description: 'Light mustard flower honey - perfect daily choice',
    unit: 'kg',
    stock: 32,
    is_featured: false,
    tags: 'honey,mustard,light'
  },
  {
    name: 'Black Seed Honey (Kalonji)',
    slug: 'black-seed-honey',
    category_slug: 'honey',
    price: 950,
    sale_price: 850,
    description: 'Premium honey infused with black seeds. Known for immune-boosting properties.',
    short_description: 'Honey with black seeds - immune booster',
    unit: 'kg',
    stock: 28,
    is_featured: true,
    tags: 'honey,black-seed,premium,immune'
  },
  {
    name: 'Premium Organic Honey',
    slug: 'premium-organic-honey',
    category_slug: 'honey',
    price: 1200,
    sale_price: 980,
    description: 'Certified organic honey from pesticide-free zones. Lab tested for purity.',
    short_description: 'Certified organic honey - lab tested',
    unit: 'kg',
    stock: 25,
    is_featured: true,
    tags: 'honey,organic,certified,premium'
  },

  // Fish & Seafood
  {
    name: 'Coral Fish (Fresh)',
    slug: 'coral-fish-fresh',
    category_slug: 'fish-seafood',
    price: 650,
    sale_price: 580,
    description: 'Beautiful colored coral fish. Delicate white meat, perfect for frying or grilling.',
    short_description: 'Fresh coral fish - delicate white meat',
    unit: 'kg',
    stock: 15,
    is_featured: true,
    tags: 'fish,fresh,coral,daily-catch'
  },
  {
    name: 'Poshur River Hilsha (Ilish)',
    slug: 'poshur-hilsha',
    category_slug: 'fish-seafood',
    price: 1200,
    sale_price: 999,
    description: 'The king of fish from Poshur river. Rich, oily meat with distinctive flavor.',
    short_description: 'Premium Hilsha from Poshur river',
    unit: 'kg',
    stock: 10,
    is_featured: true,
    tags: 'fish,hilsha,premium,poshur'
  },
  {
    name: 'Paisha Fish (ফাইশা মাছ)',
    slug: 'paisha-fish',
    category_slug: 'fish-seafood',
    price: 480,
    sale_price: 420,
    description: 'Small sweet fish perfect for curry. Tender meat, no large bones.',
    short_description: 'Sweet paisha fish - perfect for curry',
    unit: 'kg',
    stock: 25,
    is_featured: false,
    tags: 'fish,paisha,curry'
  },
  {
    name: 'Fresh Shrimp (Prawn)',
    slug: 'fresh-shrimp',
    category_slug: 'fish-seafood',
    price: 1100,
    sale_price: 950,
    description: 'Large sweet water prawns. Ideal for biryani, frying, and grilling.',
    short_description: 'Large fresh prawns - premium quality',
    unit: 'kg',
    stock: 18,
    is_featured: true,
    tags: 'shrimp,prawn,seafood,fresh'
  },

  // Dried Fish
  {
    name: 'Loitta Shutki (Dried Fish)',
    slug: 'loitta-shutki',
    category_slug: 'dried-fish',
    price: 580,
    sale_price: 499,
    description: 'Traditional sun-dried loitta fish. Strong aromatic flavor.',
    short_description: 'Sun-dried loitta fish - traditional taste',
    unit: 'kg',
    stock: 40,
    is_featured: false,
    tags: 'dried-fish,shutki,loitta,traditional'
  },
  {
    name: 'Chingri Shutki (Dried Shrimp)',
    slug: 'chingri-shutki',
    category_slug: 'dried-fish',
    price: 1200,
    sale_price: 999,
    description: 'Premium dried shrimp. Rich umami flavor. Used in curries, rice, and appetizers.',
    short_description: 'Premium dried shrimp - umami rich',
    unit: 'kg',
    stock: 28,
    is_featured: true,
    tags: 'dried-fish,shrimp,shutki,premium'
  },

  // Local Groceries
  {
    name: 'Chui Jhal (Prickly Ash)',
    slug: 'chui-jhal',
    category_slug: 'local-groceries',
    price: 280,
    sale_price: 240,
    description: 'Traditional coastal spice from Sundarbans. Unique numbing, peppery flavor.',
    short_description: 'Coastal prickly ash spice',
    unit: 'pack',
    stock: 50,
    is_featured: false,
    tags: 'spice,chui-jhal,sundarbans,local'
  },
  {
    name: 'Gol Fruit (Jujube)',
    slug: 'gol-fruit',
    category_slug: 'local-groceries',
    price: 450,
    sale_price: 399,
    description: 'Sweet round fruits from coastal orchards. Fresh, crunchy, rich in vitamin C.',
    short_description: 'Sweet jujube fruits - vitamin C rich',
    unit: 'pack',
    stock: 35,
    is_featured: true,
    tags: 'fruit,gol,jujube,seasonal,local'
  }
];

async function seedDatabase() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing categories and products
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM categories');
    console.log('✓ Cleared existing data');

    // Insert categories
    for (const cat of categories) {
      await connection.query(
        'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
        [cat.name, cat.slug, cat.description]
      );
    }
    console.log(`✓ Inserted ${categories.length} categories`);

    // Get category IDs
    const [catRows] = await connection.query('SELECT id, slug FROM categories');
    const categoryMap = {};
    catRows.forEach(row => {
      categoryMap[row.slug] = row.id;
    });

    // Insert products
    for (const prod of products) {
      const categoryId = categoryMap[prod.category_slug];
      await connection.query(
        `INSERT INTO products (
          name, slug, category_id, price, sale_price, description, 
          short_description, unit, stock_quantity, is_featured, tags, meta_title, meta_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.name, prod.slug, categoryId, prod.price, prod.sale_price,
          prod.description, prod.short_description, prod.unit, prod.stock,
          prod.is_featured ? 1 : 0, prod.tags,
          prod.name + ' - DokkhinMart',
          prod.short_description + ' | Premium coastal products'
        ]
      );
    }
    console.log(`✓ Inserted ${products.length} products`);

    // Insert combo offers
    const comboOffers = [
      {
        name: 'Family Fish Combo',
        category_id: categoryMap['fish-seafood'],
        price: 2200,
        sale_price: 1799,
        description: 'Assorted fish collection: Hilsha + Coral Fish + Paisha Fish',
        tags: 'combo,fish,family-pack'
      },
      {
        name: 'Honey Lover Combo',
        category_id: categoryMap['honey'],
        price: 2500,
        sale_price: 1999,
        description: 'Premium honey collection: Raw Honey + Mustard Flower + Black Seed',
        tags: 'combo,honey,love'
      },
      {
        name: 'Coastal Grocery Combo',
        category_id: categoryMap['local-groceries'],
        price: 1800,
        sale_price: 1499,
        description: 'Local authentic products: Chui Jhal + Gol Fruit + Spice Pack',
        tags: 'combo,grocery,local'
      }
    ];

    for (const combo of comboOffers) {
      await connection.query(
        `INSERT INTO products (
          name, slug, category_id, price, sale_price, description, unit, 
          is_featured, tags, stock_quantity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          combo.name, combo.name.toLowerCase().replace(/\s+/g, '-'),
          combo.category_id, combo.price, combo.sale_price, combo.description,
          'pack', 1, combo.tags, 20
        ]
      );
    }
    console.log(`✓ Inserted ${comboOffers.length} combo offers`);

    console.log('✅ Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await connection.release();
    await pool.end();
    process.exit(0);
  }
}

seedDatabase();
