// DokkhinMart - Premium Coastal Products Database
// All products with categories, prices, descriptions

export const productsData = [
  // ============ HONEY CATEGORY ============
  {
    id: 1,
    name: 'Sundarbans Raw Honey',
    category: 'honey',
    price: 850,
    salePrice: 750,
    unit: 'kg',
    description: 'Pure raw honey from the Sundarbans forest. Unfiltered, unheated, packed with natural enzymes and bee pollen. Rich golden color with distinctive floral notes.',
    image: '🍯',
    rating: 4.8,
    reviews: 324,
    stock: 45,
    badge: 'Best Seller',
    variants: [
      { size: '250g', price: 200 },
      { size: '500g', price: 380 },
      { size: '1kg', price: 750 }
    ]
  },
  {
    id: 2,
    name: 'Mustard Flower Honey',
    category: 'honey',
    price: 720,
    salePrice: 640,
    unit: 'kg',
    description: 'Amber honey from mustard flowers. Light flavor with subtle sweetness. Perfect for daily use and medicinal purposes.',
    image: '🌼',
    rating: 4.6,
    reviews: 198,
    stock: 32,
    variants: [
      { size: '250g', price: 180 },
      { size: '500g', price: 320 },
      { size: '1kg', price: 640 }
    ]
  },
  {
    id: 3,
    name: 'Black Seed Honey (Kalonji)',
    category: 'honey',
    price: 950,
    salePrice: 850,
    unit: 'kg',
    description: 'Premium honey infused with black seeds (kalonji). Known for immune-boosting properties. Rich and distinctive taste.',
    image: '✨',
    rating: 4.9,
    reviews: 267,
    stock: 28,
    badge: 'Premium',
    variants: [
      { size: '250g', price: 220 },
      { size: '500g', price: 425 },
      { size: '1kg', price: 850 }
    ]
  },
  {
    id: 4,
    name: 'Premium Organic Honey',
    category: 'honey',
    price: 1200,
    salePrice: 980,
    unit: 'kg',
    description: 'Certified organic honey from pesticide-free zones. Lab tested for purity. Perfect for health-conscious families.',
    image: '🏆',
    rating: 4.7,
    reviews: 412,
    stock: 25,
    badge: 'Certified',
    variants: [
      { size: '500g', price: 490 },
      { size: '1kg', price: 980 }
    ]
  },
  {
    id: 5,
    name: 'Honey Lover Combo Pack',
    category: 'honey',
    price: 2500,
    salePrice: 1999,
    unit: 'pack',
    description: 'Assorted honey collection: Raw Honey + Mustard Flower + Black Seed. Perfect gift set.',
    image: '🎁',
    rating: 4.8,
    reviews: 156,
    stock: 20,
    badge: 'Hot Deal',
    variants: [
      { size: '750g (250g x 3)', price: 1999 }
    ]
  },

  // ============ FISH & SEAFOOD CATEGORY ============
  {
    id: 6,
    name: 'Coral Fish (Fresh)',
    category: 'fish-seafood',
    price: 650,
    salePrice: 580,
    unit: 'kg',
    description: 'Beautiful colored coral fish. Delicate white meat, perfect for frying or grilling. Fresh daily catch from coastal waters.',
    image: '🐠',
    rating: 4.7,
    reviews: 89,
    stock: 15,
    badge: 'Fresh Daily',
    variants: [
      { size: '500g', price: 290 },
      { size: '1kg', price: 580 },
      { size: '2kg', price: 1100 }
    ]
  },
  {
    id: 7,
    name: 'Poshur River Hilsha (Ilish)',
    category: 'fish-seafood',
    price: 1200,
    salePrice: 999,
    unit: 'kg',
    description: 'The king of fish from Poshur river. Rich, oily meat with distinctive flavor. Premium quality for special occasions.',
    image: '🐟',
    rating: 4.9,
    reviews: 234,
    stock: 10,
    badge: 'Premium',
    variants: [
      { size: '500g', price: 525 },
      { size: '1kg', price: 999 }
    ]
  },
  {
    id: 8,
    name: 'Paisha Fish (ফাইশা মাছ)',
    category: 'fish-seafood',
    price: 480,
    salePrice: 420,
    unit: 'kg',
    description: 'Small sweet fish perfect for curry. Tender meat, no large bones. Great for family meals.',
    image: '🐟',
    rating: 4.5,
    reviews: 67,
    stock: 25,
    variants: [
      { size: '500g', price: 210 },
      { size: '1kg', price: 420 }
    ]
  },
  {
    id: 9,
    name: 'Tangra Fish (ট্যাংরা মাছ)',
    category: 'fish-seafood',
    price: 380,
    salePrice: 340,
    unit: 'kg',
    description: 'Traditional Bengali fish. Medium size, suitable for various recipes. Loved by locals.',
    image: '🐟',
    rating: 4.4,
    reviews: 54,
    stock: 30,
    variants: [
      { size: '500g', price: 170 },
      { size: '1kg', price: 340 }
    ]
  },
  {
    id: 10,
    name: 'Fresh Shrimp (Prawn)',
    category: 'fish-seafood',
    price: 1100,
    salePrice: 950,
    unit: 'kg',
    description: 'Large sweet water prawns. Ideal for biryani, frying, and grilling. Superior quality.',
    image: '🦐',
    rating: 4.8,
    reviews: 178,
    stock: 18,
    badge: 'Fresh',
    variants: [
      { size: '500g', price: 475 },
      { size: '1kg', price: 950 }
    ]
  },
  {
    id: 11,
    name: 'Tiger Shrimp (Large)',
    category: 'fish-seafood',
    price: 1500,
    salePrice: 1299,
    unit: 'kg',
    description: 'Premium large tiger shrimp. Perfect for special dishes. Extra tender and juicy.',
    image: '🦐',
    rating: 4.9,
    reviews: 145,
    stock: 12,
    badge: 'Premium',
    variants: [
      { size: '500g', price: 650 },
      { size: '1kg', price: 1299 }
    ]
  },
  {
    id: 12,
    name: 'Mud Crab (Mangrove Crab)',
    category: 'fish-seafood',
    price: 2200,
    salePrice: 1899,
    unit: 'kg',
    description: 'Fresh mud crab from mangrove forests. Sweet, tender meat. Perfect for special celebrations.',
    image: '🦀',
    rating: 4.8,
    reviews: 92,
    stock: 8,
    badge: 'Special',
    variants: [
      { size: '500g (1pc)', price: 950 },
      { size: '1kg (1-2pc)', price: 1899 }
    ]
  },
  {
    id: 13,
    name: 'Fresh Water Crab',
    category: 'fish-seafood',
    price: 1400,
    salePrice: 1200,
    unit: 'kg',
    description: 'Fresh water crab with delicate flavor. Great for curry or grilled preparations.',
    image: '🦀',
    rating: 4.6,
    reviews: 78,
    stock: 14,
    variants: [
      { size: '500g (2-3pc)', price: 600 },
      { size: '1kg (4-6pc)', price: 1200 }
    ]
  },
  {
    id: 14,
    name: 'Mixed Seafood Pack',
    category: 'fish-seafood',
    price: 3000,
    salePrice: 2499,
    unit: 'pack',
    description: 'Assorted seafood: Fish + Shrimp + Crab + Squid. 2kg total mix. Perfect for a seafood feast.',
    image: '🌊',
    rating: 4.7,
    reviews: 134,
    stock: 10,
    badge: 'Hot Deal',
    variants: [
      { size: '2kg combo', price: 2499 }
    ]
  },

  // ============ DRIED FISH CATEGORY ============
  {
    id: 15,
    name: 'Loitta Shutki (Dried Fish)',
    category: 'dried-fish',
    price: 580,
    salePrice: 499,
    unit: 'kg',
    description: 'Traditional sun-dried loitta fish. Strong aromatic flavor. Essential ingredient in Bengali curry.',
    image: '☀️',
    rating: 4.5,
    reviews: 124,
    stock: 40,
    variants: [
      { size: '250g', price: 125 },
      { size: '500g', price: 249 },
      { size: '1kg', price: 499 }
    ]
  },
  {
    id: 16,
    name: 'Chingri Shutki (Dried Shrimp)',
    category: 'dried-fish',
    price: 1200,
    salePrice: 999,
    unit: 'kg',
    description: 'Premium dried shrimp. Rich umami flavor. Used in curries, rice, and appetizers.',
    image: '☀️',
    rating: 4.7,
    reviews: 156,
    stock: 28,
    badge: 'Premium',
    variants: [
      { size: '250g', price: 250 },
      { size: '500g', price: 500 },
      { size: '1kg', price: 999 }
    ]
  },
  {
    id: 17,
    name: 'Rupchanda Shutki',
    category: 'dried-fish',
    price: 650,
    salePrice: 570,
    unit: 'kg',
    description: 'Dried pomfret fish. Delicate, sweet flavor. Perfect for traditional Bengali recipes.',
    image: '☀️',
    rating: 4.6,
    reviews: 87,
    stock: 35,
    variants: [
      { size: '250g', price: 145 },
      { size: '500g', price: 285 },
      { size: '1kg', price: 570 }
    ]
  },
  {
    id: 18,
    name: 'Mixed Shutki Pack',
    category: 'dried-fish',
    price: 1800,
    salePrice: 1499,
    unit: 'pack',
    description: 'Assorted dried fish: Loitta + Chingri + Rupchanda. 1.5kg total. Variety pack for diverse recipes.',
    image: '☀️',
    rating: 4.6,
    reviews: 103,
    stock: 22,
    badge: 'Best Value',
    variants: [
      { size: '1.5kg (3x500g)', price: 1499 }
    ]
  },
  {
    id: 19,
    name: 'Premium Dry Fish Box',
    category: 'dried-fish',
    price: 3500,
    salePrice: 2899,
    unit: 'pack',
    description: 'Premium collection of premium dried fish. 2kg assorted. Beautifully packaged for gifting.',
    image: '🎁',
    rating: 4.8,
    reviews: 89,
    stock: 12,
    badge: 'Gift Set',
    variants: [
      { size: '2kg collection', price: 2899 }
    ]
  },

  // ============ LOCAL GROCERIES CATEGORY ============
  {
    id: 20,
    name: 'Chui Jhal (Prickly Ash)',
    category: 'local-groceries',
    price: 280,
    salePrice: 240,
    unit: 'pack',
    description: 'Traditional coastal spice from Sundarbans. Unique numbing, peppery flavor. Used in Bengali cuisine.',
    image: '🌶️',
    rating: 4.5,
    reviews: 67,
    stock: 50,
    variants: [
      { size: '100g', price: 120 },
      { size: '250g', price: 240 }
    ]
  },
  {
    id: 21,
    name: 'Gol Fruit (Jujube)',
    category: 'local-groceries',
    price: 450,
    salePrice: 399,
    unit: 'pack',
    description: 'Sweet round fruits from coastal orchards. Fresh, crunchy, rich in vitamin C.',
    image: '🟤',
    rating: 4.7,
    reviews: 78,
    stock: 35,
    badge: 'Seasonal',
    variants: [
      { size: '1kg', price: 399 }
    ]
  },
  {
    id: 22,
    name: 'Keora Fruit (Barringtonia)',
    category: 'local-groceries',
    price: 320,
    salePrice: 280,
    unit: 'pack',
    description: 'Rare fruit from Sundarbans. Unique flavour profile. Used in traditional Bengali recipes.',
    image: '🟠',
    rating: 4.4,
    reviews: 54,
    stock: 20,
    variants: [
      { size: '500g', price: 280 }
    ]
  },
  {
    id: 23,
    name: 'Coastal Spice Pack',
    category: 'local-groceries',
    price: 650,
    salePrice: 549,
    unit: 'pack',
    description: 'Assorted coastal spices: Chui Jhal + Bay leaves + Local chillies. 300g total.',
    image: '🌿',
    rating: 4.6,
    reviews: 92,
    stock: 30,
    badge: 'Essential',
    variants: [
      { size: '300g combo', price: 549 }
    ]
  },
  {
    id: 24,
    name: 'Sundarbans Organic Grocery Box',
    category: 'local-groceries',
    price: 2200,
    salePrice: 1799,
    unit: 'pack',
    description: 'Premium collection of Sundarbans organic products: Honey + Spices + Fruits. Perfect gift box.',
    image: '🎁',
    rating: 4.8,
    reviews: 156,
    stock: 15,
    badge: 'Gift Set',
    variants: [
      { size: 'Premium box', price: 1799 }
    ]
  }
];

export const categories = [
  {
    id: 1,
    name: 'Pure Honey',
    slug: 'honey',
    icon: '🐝',
    description: 'Premium honey from Sundarbans and beyond',
    color: '#e9c46a'
  },
  {
    id: 2,
    name: 'Fish & Seafood',
    slug: 'fish-seafood',
    icon: '🐟',
    description: 'Fresh catch from coastal waters',
    color: '#40916c'
  },
  {
    id: 3,
    name: 'Dried Fish',
    slug: 'dried-fish',
    icon: '☀️',
    description: 'Traditional sun-dried fish varieties',
    color: '#2d6a4f'
  },
  {
    id: 4,
    name: 'Local Groceries',
    slug: 'local-groceries',
    icon: '🌿',
    description: 'Authentic Sundarbans local products',
    color: '#74c69d'
  }
];

export const combos = [
  {
    id: 101,
    name: 'Family Fish Combo',
    price: 2200,
    salePrice: 1799,
    discount: '18%',
    description: 'Assorted fish collection for family meals',
    items: ['Hilsha', 'Coral Fish', 'Paisha Fish'],
    save: 401,
    image: '🐟',
    badge: 'Family Pack'
  },
  {
    id: 102,
    name: 'Honey Lover Combo',
    price: 2500,
    salePrice: 1999,
    discount: '20%',
    description: 'Premium honey collection with all varieties',
    items: ['Raw Honey', 'Mustard Flower', 'Black Seed Honey'],
    save: 501,
    image: '🍯',
    badge: 'Popular'
  },
  {
    id: 103,
    name: 'Coastal Grocery Combo',
    price: 1800,
    salePrice: 1499,
    discount: '17%',
    description: 'Local authentic coastal products',
    items: ['Chui Jhal', 'Gol Fruit', 'Coastal Spice Pack'],
    save: 301,
    image: '🌿',
    badge: 'Essential'
  },
  {
    id: 104,
    name: 'Premium Seafood Box',
    price: 3500,
    salePrice: 2899,
    discount: '17%',
    description: 'Deluxe seafood collection with everything',
    items: ['Hilsha', 'Shrimp', 'Mud Crab', 'Mixed Seafood'],
    save: 601,
    image: '🦐',
    badge: 'Premium'
  },
  {
    id: 105,
    name: 'Sundarbans Gift Pack',
    price: 4200,
    salePrice: 3499,
    discount: '17%',
    description: 'Complete Sundarbans experience gift set',
    items: ['Raw Honey', 'Hilsha', 'Dried Fish', 'Coastal Spices'],
    save: 701,
    image: '🎁',
    badge: 'Gift Set'
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'রহিম আহমেদ',
    city: 'খুলনা',
    text: 'দোক্ষিণের স্বাদের মাছ একেবারে তাজা এবং স্বাস্থ্যকর। পরিবারের সবাই খুব খুশি। প্রতি সপ্তাহে অর্ডার করি।',
    rating: 5,
    image: '👨',
    product: 'Hilsha Fish'
  },
  {
    id: 2,
    name: 'ফাতেমা বেগম',
    city: 'ঢাকা',
    text: 'এই মধু সত্যিই খাঁটি। কোনো মিশ্রয় নেই। আমার সন্তানদের প্রতিদিন দিই, সুস্থ থাকে।',
    rating: 5,
    image: '👩',
    product: 'Sundarbans Honey'
  },
  {
    id: 3,
    name: 'করিম সাহেব',
    city: 'ঢাকা',
    text: 'দ্রুত ডেলিভারি, ভালো প্যাকেজিং। অনলাইন অর্ডার করে ১২ ঘণ্টায় পেয়ে গেলাম।',
    rating: 5,
    image: '👨',
    product: 'Fast Delivery'
  }
];

export const deliveryOptions = [
  {
    id: 1,
    city: 'খুলনা',
    time: '৪ ঘণ্টা',
    label: 'Ultra Fast',
    description: 'তাৎক্ষণিক ডেলিভারি সেবা। সকাল ৬টা থেকে রাত ১০টা পর্যন্ত।',
    icon: '⚡',
    color: 'green',
    available: true
  },
  {
    id: 2,
    city: 'ঢাকা',
    time: '১২ ঘণ্টা (সকাল)',
    label: '12h Express',
    description: 'সকাল ৫টার আগে অর্ডার করুন। পরদিন সকাল ৯টার মধ্যে ডেলিভারি।',
    icon: '🚀',
    color: 'blue',
    available: true
  },
  {
    id: 3,
    city: 'ঢাকা',
    time: '১২ ঘণ্টা (সন্ধ্যা)',
    label: '12h Express',
    description: 'সন্ধ্যা ৬টার আগে অর্ডার করুন। পরদিন সন্ধ্যা ৯টার মধ্যে ডেলিভারি।',
    icon: '🚀',
    color: 'blue',
    available: true,
    note: '+৫০ টাকা অতিরিক্ত'
  },
  {
    id: 4,
    city: 'সারাদেশ',
    time: '২৪ ঘণ্টা',
    label: 'Standard',
    description: 'সাধারণ ডেলিভারি সেবা। যেকোনো সময় অর্ডার করুন।',
    icon: '🚚',
    color: 'gray',
    available: true
  }
];

export const faqs = [
  {
    id: 1,
    question: 'ডেলিভারি কতক্ষণ লাগে?',
    answer: 'খুলনায় ৪ ঘণ্টা, ঢাকায় ১২ ঘণ্টা এক্সপ্রেস বা ২৪ ঘণ্টা স্ট্যান্ডার্ড ডেলিভারি পাওয়া যায়।'
  },
  {
    id: 2,
    question: 'মাছ সত্যিই তাজা?',
    answer: 'হ্যাঁ, আমরা প্রতিদিন সকালে তাজা মাছ সংগ্রহ করি সরাসরি জেলেদের কাছ থেকে।'
  },
  {
    id: 3,
    question: 'ক্যাশ অন ডেলিভারি পাওয়া যায়?',
    answer: 'হ্যাঁ, সম্পূর্ণ বিনামূল্যে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।'
  },
  {
    id: 4,
    question: 'আমি ঢাকা থেকে অর্ডার করতে পারি?',
    answer: 'হ্যাঁ, ঢাকা এবং আশেপাশের সকল এলাকায় ডেলিভারি করি।'
  },
  {
    id: 5,
    question: 'আমার অর্ডার ট্র্যাক করব কিভাবে?',
    answer: 'অর্ডারের পর আপনি SMS এবং অ্যাপে রিয়েল-টাইম ট্র্যাকিং পাবেন।'
  },
  {
    id: 6,
    question: 'মধু সত্যি খাঁটি?',
    answer: 'হ্যাঁ, সকল মধু পরীক্ষিত এবং সার্টিফাইড। ১০০% খাঁটি গ্যারান্টি সহ।'
  },
  {
    id: 7,
    question: 'রিটার্ন পলিসি কী?',
    answer: 'ডেলিভারির ৭ দিনের মধ্যে যেকোনো কারণে পণ্য ফেরত দিতে পারবেন।'
  }
];
