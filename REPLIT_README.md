# 🚀 AFFILIMART - Replit Deployment Guide

## 📋 Loyiha Haqida

AFFILIMART - O'zbekistondagi birinchi integratsiyalashgan marketplace va affiliate network platformasi. Bu loyiha sotuvchilar, blogerlar va haridorlar uchun yagona ekotizim yaratadi.

## 🎯 Asosiy Xususiyatlar

✅ **Multi-vendor Marketplace** - Ko'p sotuvchilar uchun platforma  
✅ **Affiliate Network** - Blogerlar uchun daromad tizimi  
✅ **Real-time Notifications** - WebSocket asosida bildirishnomalar  
✅ **AI Fraud Detection** - Sun'iy intellekt bilan aldovni aniqlash  
✅ **Smart Rewards System** - Aqlli mukofotlar tizimi  
✅ **Customer Loyalty Program** - Mijozlar sodiqlik dasturi  
✅ **Blogger Gamification** - Blogerlar uchun o'yinlashtirish  
✅ **Admin CRM Panel** - Boshqaruv paneli  
✅ **Merchant Dashboard** - Sotuvchilar kabineti  
✅ **Blogger Dashboard** - Blogerlar kabineti  

## 🚀 Replit'da O'rnatish

### 1. Replit'da yangi loyiha yarating

1. [Replit.com](https://replit.com) ga kiring
2. "Create Repl" tugmasini bosing
3. "Import from GitHub" ni tanlang
4. Repository URL'ni kiriting: `https://github.com/your-username/affilimart`
5. "Import from GitHub" ni bosing

### 2. Environment Variables'ni sozlang

Replit'da "Secrets" bo'limiga o'ting va quyidagi o'zgaruvchilarni qo'shing:

```bash
# Asosiy sozlamalar
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key

# Database (Replit DB yoki PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=affilimart
DB_USER=postgres
DB_PASSWORD=password

# Redis (Replit Redis yoki local)
REDIS_HOST=localhost
REDIS_PORT=6379

# Xavfsizlik
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 3. Dependencies'ni o'rnating

```bash
# Asosiy dependencies
npm run install:all
```

### 4. Database'ni sozlang

```bash
# Database migratsiyalari
npm run db:migrate

# Test ma'lumotlarini qo'shish
npm run db:seed
```

### 5. Loyihani ishga tushiring

```bash
# Development rejimida
npm run dev
```

## 📁 Loyiha Tuzilishi

```
affilimart/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router
│   │   ├── components/      # React komponentlar
│   │   └── types/           # TypeScript tiplar
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # API kontrollerlar
│   │   ├── models/          # Database modellar
│   │   ├── routes/          # API routelar
│   │   ├── services/        # Biznes logika
│   │   └── middleware/      # Middleware'lar
│   └── package.json
├── shared/                   # Umumiy kodlar
├── mobile/                   # React Native app
└── package.json             # Root package.json
```

## 🔧 API Endpoints

### Auth
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `POST /api/auth/logout` - Chiqish

### Users
- `GET /api/users/profile` - Profil ma'lumotlari
- `PUT /api/users/profile` - Profilni yangilash

### Products
- `GET /api/products` - Mahsulotlar ro'yxati
- `POST /api/products` - Yangi mahsulot
- `GET /api/products/:id` - Mahsulot ma'lumotlari

### Orders
- `GET /api/orders` - Buyurtmalar ro'yxati
- `POST /api/orders` - Yangi buyurtma
- `PUT /api/orders/:id` - Buyurtmani yangilash

### Affiliate
- `GET /api/affiliate/links` - Affiliate linklar
- `POST /api/affiliate/links` - Yangi link yaratish

### Smart Rewards
- `POST /api/smart-rewards/daily-login` - Kunlik mukofot
- `GET /api/smart-rewards/info` - Mukofot ma'lumotlari
- `POST /api/smart-rewards/redeem` - Ballarni ishlatish

## 🎨 Frontend Komponentlar

### Admin Panel
- `AdminDashboard` - Asosiy admin panel
- `UserManagement` - Foydalanuvchilarni boshqarish
- `ProductManagement` - Mahsulotlarni boshqarish
- `SmartRewardsStats` - Mukofotlar statistikasi

### Merchant Panel
- `MerchantDashboard` - Sotuvchi kabineti
- `AddProductForm` - Mahsulot qo'shish
- `OrderList` - Buyurtmalar ro'yxati

### Blogger Panel
- `BloggerDashboard` - Bloger kabineti
- `AffiliateLinks` - Affiliate linklar
- `GamificationPanel` - O'yinlashtirish

### Customer Interface
- `SmartRewards` - Mukofotlar tizimi
- `CheckoutWithRewards` - To'lov bilan mukofotlar

## 🗄️ Database Schema

### Asosiy jadvallar:
- `users` - Foydalanuvchilar
- `products` - Mahsulotlar
- `orders` - Buyurtmalar
- `affiliate_links` - Affiliate linklar
- `notifications` - Bildirishnomalar
- `smart_rewards` - Mukofotlar

## 🔒 Xavfsizlik

- JWT authentication
- Role-based access control
- Rate limiting
- Input validation
- SQL injection himoyasi
- XSS himoyasi
- CSRF himoyasi

## 📊 Analytics

- Real-time tracking
- Conversion funnel
- User behavior analytics
- Performance metrics
- Smart rewards analytics

## 🚀 Production Deployment

Replit'da production'ga deploy qilish uchun:

1. **Environment variables'ni to'g'ri sozlang**
2. **Database'ni production'ga o'tkazing**
3. **SSL sertifikatini o'rnating**
4. **Monitoring'ni yoqing**

## 📞 Yordam

Agar muammolar bo'lsa:

1. **Console'da xatolarni tekshiring**
2. **Log fayllarini ko'ring**
3. **Database ulanishini tekshiring**
4. **Environment variables'ni tekshiring**

## 🎉 Xulosa

AFFILIMART endi Replit'da to'liq ishlaydi! Barcha xususiyatlar implementatsiya qilingan va production-ready holatda.

**Keyingi qadamlar:**
1. Environment variables'ni sozlang
2. Database'ni o'rnating
3. Loyihani ishga tushiring
4. Test qiling

🚀 **AFFILIMART - O'zbekistondagi yetakchi marketplace!** 