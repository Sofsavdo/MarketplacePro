# 🧪 DUBAYMALL TESTING GUIDE

## ✅ YANGI TUZATISHLAR (2024-12-16)

### Qo'shilgan Funksiyalar:
1. **Navigation System** - To'liq navigatsiya tizimi
2. **Auth Context** - Foydalanuvchi autentifikatsiyasi
3. **Navbar** - Qidiruv, savat, foydalanuvchi menyusi
4. **Footer** - Linklar va kontakt ma'lumotlari
5. **Products Page** - Filtrlar va qidiruv bilan
6. **Categories Page** - Barcha kategoriyalar

---

## 🌐 RAILWAY URL OLISH

```bash
# 1. Railway Dashboard'ga kiring
https://railway.app/dashboard

# 2. MarketplacePro project'ni oching

# 3. Settings → Domains
# URL: https://marketplacepro-production-XXXX.up.railway.app
```

---

## 🧪 TEST QILISH

### 1. HOME PAGE (/)

**Test:**
```
✅ Navbar ko'rinadi
✅ Logo bosilsa home page'ga qaytadi
✅ Qidiruv ishlaydi
✅ Kategoriyalar ko'rinadi
✅ Mahsulotlar ko'rinadi
✅ Footer ko'rinadi
✅ "Sotuvchi bo'lish" tugmasi ishlaydi
✅ "Bloger bo'lish" tugmasi ishlaydi
```

**URL:** `https://your-app.railway.app/`

---

### 2. PRODUCTS PAGE (/products)

**Test:**
```
✅ Barcha mahsulotlar ko'rinadi
✅ Qidiruv ishlaydi
✅ Kategoriya filtri ishlaydi
✅ Saralash ishlaydi
✅ Mahsulotga bosilsa detail page ochiladi
✅ "Savat" tugmasi ishlaydi
✅ "Sevimli" tugmasi ishlaydi
```

**URL:** `https://your-app.railway.app/products`

---

### 3. CATEGORIES PAGE (/categories)

**Test:**
```
✅ Barcha kategoriyalar ko'rinadi
✅ Kategoriya bosilsa mahsulotlar ochiladi
✅ Subkategoriyalar ko'rinadi
✅ Mahsulot soni ko'rinadi
```

**URL:** `https://your-app.railway.app/categories`

---

### 4. LOGIN PAGE (/login)

**Test Accounts:**

```javascript
// Admin
Email: admin@dubaymall.uz
Password: admin123

// Seller
Email: seller@dubaymall.uz
Password: seller123

// Blogger
Email: blogger@dubaymall.uz
Password: blogger123

// Customer
Email: customer@dubaymall.uz
Password: customer123
```

**Test:**
```
✅ Email input ishlaydi
✅ Password input ishlaydi
✅ "Ko'rish" tugmasi parolni ko'rsatadi
✅ "Kirish" tugmasi ishlaydi
✅ Admin → /admin/dashboard
✅ Seller → /seller/dashboard
✅ Blogger → /blogger/dashboard
✅ Customer → /
```

**URL:** `https://your-app.railway.app/login`

---

### 5. ADMIN DASHBOARD (/admin/dashboard)

**Login:** admin@dubaymall.uz / admin123

**Test:**
```
✅ Sidebar ko'rinadi
✅ Header ko'rinadi
✅ Statistika ko'rinadi
✅ Grafiklar ko'rinadi
✅ Barcha linklar ishlaydi:
  - Dashboard
  - Products
  - Orders
  - Users
  - Warehouse
  - Monitoring
  - Settings
```

**URL:** `https://your-app.railway.app/admin/dashboard`

---

### 6. SELLER DASHBOARD (/seller/dashboard)

**Login:** seller@dubaymall.uz / seller123

**Test:**
```
✅ Sidebar ko'rinadi
✅ Header ko'rinadi
✅ Statistika ko'rinadi
✅ So'nggi buyurtmalar ko'rinadi
✅ Mahsulotlar ro'yxati ko'rinadi
✅ Barcha linklar ishlaydi:
  - Dashboard
  - Mahsulotlar
  - Mahsulot qo'shish
  - Buyurtmalar
  - Moliya
  - Statistika
  - Sozlamalar
```

**URL:** `https://your-app.railway.app/seller/dashboard`

---

### 7. BLOGGER DASHBOARD (/blogger/dashboard)

**Login:** blogger@dubaymall.uz / blogger123

**Test:**
```
✅ Sidebar ko'rinadi
✅ Header ko'rinadi
✅ Statistika ko'rinadi
✅ Promo kod ko'rinadi
✅ Daromad ko'rinadi
✅ Barcha linklar ishlaydi:
  - Dashboard
  - Products
  - Promo
  - Stats
  - Earnings
  - Company
  - Settings
```

**URL:** `https://your-app.railway.app/blogger/dashboard`

---

### 8. CART PAGE (/cart)

**Test:**
```
✅ Savat mahsulotlari ko'rinadi
✅ Miqdorni o'zgartirish ishlaydi
✅ O'chirish tugmasi ishlaydi
✅ Jami summa to'g'ri hisoblanadi
✅ "Checkout" tugmasi ishlaydi
```

**URL:** `https://your-app.railway.app/cart`

---

### 9. CHECKOUT PAGE (/checkout)

**Test:**
```
✅ Yetkazib berish ma'lumotlari
✅ To'lov usullari ko'rinadi
✅ Buyurtma xulosasi ko'rinadi
✅ "Buyurtma berish" tugmasi ishlaydi
```

**URL:** `https://your-app.railway.app/checkout`

---

### 10. ORDERS PAGE (/orders)

**Test:**
```
✅ Buyurtmalar ro'yxati ko'rinadi
✅ Status ko'rinadi
✅ Tracking ishlaydi
✅ Chat tugmasi ishlaydi
✅ Review tugmasi ishlaydi
```

**URL:** `https://your-app.railway.app/orders`

---

## 🔍 API ENDPOINTS TEST

### Authentication
```bash
# Login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dubaymall.uz","password":"admin123"}'

# Register
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User","role":"customer"}'
```

### Products
```bash
# Get all products
curl https://your-app.railway.app/api/products

# Create product
curl -X POST https://your-app.railway.app/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Product","price":100000,"category":"electronics"}'
```

### Orders
```bash
# Get orders
curl https://your-app.railway.app/api/orders

# Create order
curl -X POST https://your-app.railway.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"1","quantity":1}],"total":100000}'
```

---

## 🐛 XATOLARNI TOPISH

### Browser Console
```javascript
// F12 bosing va Console'ni oching
// Qizil xatolar bormi tekshiring
```

### Network Tab
```javascript
// F12 → Network
// Failed requests bormi tekshiring
// 404, 500 xatolar bormi tekshiring
```

### Railway Logs
```bash
# Railway Dashboard → Deployments → Latest → View Logs
# Real-time xatolarni ko'ring
```

---

## ✅ EXPECTED RESULTS

### Barcha sahifalar:
- ✅ Tez yuklanadi (< 3 soniya)
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Xatosiz ishlaydi
- ✅ Navigation ishlaydi
- ✅ Linklar to'g'ri

### Barcha tugmalar:
- ✅ Bosilganda ishlaydi
- ✅ Loading state ko'rinadi
- ✅ Success/Error message ko'rinadi

### Barcha formalar:
- ✅ Validation ishlaydi
- ✅ Submit ishlaydi
- ✅ Error handling ishlaydi

---

## 🚨 AGAR XATO BO'LSA

### 1. Railway Logs Tekshiring
```
Railway Dashboard → Deployments → Latest → View Logs
```

### 2. Browser Console Tekshiring
```
F12 → Console → Xatolarni ko'ring
```

### 3. Network Requests Tekshiring
```
F12 → Network → Failed requests
```

### 4. Menga Xabar Bering
```
Xato screenshot'ini yuboring
URL'ni yuboring
Qaysi sahifada xato bo'lganini ayting
```

---

## 📊 PERFORMANCE TEST

### Lighthouse Test
```bash
# Chrome DevTools → Lighthouse → Run
# Performance: > 80
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 80
```

---

## 🎉 SUCCESS CRITERIA

✅ Barcha 30 sahifa ishlaydi
✅ Barcha 25 API endpoint ishlaydi
✅ Barcha tugmalar ishlaydi
✅ Barcha linklar ishlaydi
✅ Authentication ishlaydi
✅ Navigation ishlaydi
✅ Mobile responsive
✅ Xatosiz

---

## 📞 YORDAM

Agar muammo bo'lsa:
1. Railway logs'ni tekshiring
2. Browser console'ni tekshiring
3. Screenshot yuboring
4. Menga xabar bering

**DUBAYMALL TAYYOR!** 🚀
