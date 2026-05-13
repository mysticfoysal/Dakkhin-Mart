# FreshMart – Setup Guide

## Project Structure

```
freshmart/
├── index.html              ← Homepage
├── css/style.css           ← Global styles
├── js/main.js              ← Frontend JS (cart, auth, helpers)
├── pages/
│   ├── auth.html           ← Login / Register
│   ├── shop.html           ← Shop listing
│   ├── product.html        ← Product detail
│   ├── checkout.html       ← Checkout
│   ├── profile.html        ← User account
│   ├── about.html          ← About Us
│   ├── contact.html        ← Contact
│   └── wishlist.html       ← Wishlist
├── admin/
│   └── index.html          ← Admin dashboard
└── backend/
    ├── server.js
    ├── config/Db.js
    ├── middleware/Auth.js
    ├── controllers/
    │   ├── Authcontroller.js
    │   ├── Productcontroller.js
    │   ├── Ordercontroller.js
    │   ├── Admincontroller.js
    │   └── Misccontroller.js
    └── routes/
        ├── auth.js
        ├── products.js
        ├── orders.js
        ├── categories.js
        ├── reviews.js
        ├── wishlist.js
        ├── coupons.js
        ├── admin.js
        ├── users.js
        └── cart.js
```

## Backend Setup

### 1. Prerequisites
- Node.js 18+
- MySQL 8.0+

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials and a JWT secret
```

### 4. Set up the database
```bash
mysql -u root -p < schema.sql
```

### 5. Create admin user
Update the seed in `schema.sql` — replace the hashed password placeholder with a real bcrypt hash:
```bash
node -e "const b=require('bcryptjs');b.hash('admin123',10).then(console.log)"
```
Then run `UPDATE users SET password='<hash>' WHERE email='admin@freshmart.com';`

### 6. Create uploads folder
```bash
mkdir -p backend/uploads
```

### 7. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

API runs at: http://localhost:5000/api

## Frontend Setup

The frontend is plain HTML/CSS/JS — no build step needed.

### Option A: VS Code Live Server
Install the "Live Server" extension, right-click `index.html` → Open with Live Server.

### Option B: Simple HTTP server
```bash
npx serve .
# or
python3 -m http.server 3000
```

### Configure API URL
In `js/main.js`, line 2:
```js
const API = 'http://localhost:5000/api';
```
Change this to your backend URL in production.

## Admin Panel

Visit `/admin/index.html` in your browser.  
Log in with an admin account. The panel auto-redirects if you're not an admin.

**Features:**
- Dashboard with stats, revenue chart, and order breakdown
- Full order management with status updates
- Product CRUD (add, edit, delete, toggle active/featured)
- Category management
- Customer list with spend totals
- Coupon management (create, enable/disable)

## Production Notes

- Put the backend behind nginx/Apache as a reverse proxy
- Set `FRONTEND_URL` in `.env` to your actual domain for CORS
- Store `uploads/` on persistent storage (or use S3)
- Use PM2 to keep the Node server running: `pm2 start server.js --name freshmart`
- Enable HTTPS with Let's Encrypt
