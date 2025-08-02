# 🚀 AFFILIMART - Marketplace va Affiliate Network

AFFILIMART - O'zbekistondagi birinchi integratsiyalashgan marketplace va affiliate network platformasi.

## 📋 Loyiha Haqida

AFFILIMART sotuvchilar, blogerlar va haridorlar uchun yagona ekotizim yaratadi. Platforma orqali:

- **Sotuvchilar** - Mahsulotlarini sotish va blogerlar orqali reklama qilish
- **Blogerlar** - Affiliate linklar orqali daromad qilish
- **Haridorlar** - Raqobatbardosh narxlarda mahsulotlarni sotib olish

## 🏗️ Texnik Arxitektura

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **UI Components:** Headless UI, Heroicons
- **Charts:** Recharts, Chart.js
- **Forms:** React Hook Form, Zod validation

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Knex.js
- **Cache:** Redis
- **Authentication:** JWT
- **Payment:** Stripe
- **Email:** Nodemailer
- **File Upload:** Multer, Cloudinary

### Infratuzilma
- **Cloud:** AWS/Google Cloud
- **CDN:** Cloudflare
- **Monitoring:** Prometheus, Grafana
- **CI/CD:** GitHub Actions

## 🚀 O'rnatish va Ishga Tushirish

### Talablar
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm yoki yarn

### 1. Loyihani klonlash
```bash
git clone https://github.com/affilimart/affilimart.git
cd affilimart
```

### 2. Dependencies o'rnatish
```bash
# Barcha dependencies bir vaqtda
npm run install:all
```

### 3. Environment variables
```bash
# Backend uchun
cp backend/env.example backend/.env

# Frontend uchun
cp frontend/env.example frontend/.env.local

# .env fayllarini tahrirlang
```

### 4. Database o'rnatish
```bash
npm run db:setup
```

### 5. Ishga tushirish
```bash
# Development rejimida (frontend + backend)
npm run dev

# Yoki alohida
npm run dev:frontend  # Frontend
npm run dev:backend   # Backend
```

### Replit Deployment
```bash
# Replit uchun maxsus setup
bash setup-replit.sh
npm run dev
```

## 📊 Asosiy Xususiyatlar

### 👨‍💼 Admin Panel
- Foydalanuvchilarni boshqarish
- Mahsulotlarni tasdiqlash
- Buyurtmalarni boshqarish
- Analytics va hisobotlar
- Tizim sozlamalari

### 🏪 Merchant Panel
- Mahsulotlarni qo'shish/tahrirlash
- Buyurtmalarni ko'rish
- Analytics va statistika
- Reklama xizmatlari
- Blogerlarga takliflar

### 🎯 Blogger Panel
- Affiliate linklar yaratish
- Mahsulot katalogi
- Daromadlar va statistika
- Takliflar va kampaniyalar
- Kontent kutubxonasi

### 🛒 Customer Interface
- Mahsulotlarni qidirish va filtrlash
- Xavfsiz to'lov
- Buyurtma kuzatish
- Sharhlar va reytinglar
- Aqlli mukofotlar tizimi (kunlik kirish, seriya bonuslari)
- Flash takliflar va chegirmalar

## 💰 Daromad Modeli

### Marketplace Daromadi
- Komissiyalar: 6-15% (kategoriyaga qarab)
- To'lov protsessingi: 0.5-2%
- Premium xizmatlar: $50-999/oy
- Reklama: $100-5000/oy

### Affiliate Daromadi
- Boshqaruv haq: 10-20%
- Obuna: $29-99/oy
- Premium vositalar: $49-199/oy

## 🔒 Xavfsizlik

- JWT authentication
- Role-based access control
- Rate limiting
- Input validation
- SQL injection himoyasi
- XSS himoyasi
- CSRF himoyasi

## 📈 Analytics

- Real-time tracking
- Conversion funnel
- A/B testing
- Heatmaps
- User behavior analytics
- Performance metrics

## 🌐 Xalqaro Kengayish

- Multi-language support (O'zbek, Rus, Ingliz)
- Multi-currency support
- Local payment methods
- Regional compliance

## 🤝 Hamkorlik

AFFILIMART ochiq manba loyiha bo'lib, jamiyat hissasini qabul qiladi.

### Hissa qo'shish
1. Repository ni fork qiling
2. Feature branch yarating
3. O'zgarishlarni commit qiling
4. Pull request yuboring

### Bug report
GitHub Issues orqali xabar bering.

## 📞 Aloqa

- **Email:** support@affilimart.com
- **Telegram:** @affilimart_support
- **Website:** https://affilimart.com

## 📄 Litsenziya

MIT License - [LICENSE](LICENSE) faylini ko'ring.

## 🎯 Roadmap

### Phase 1 (MVP) - 4 oy
- [x] Multi-vendor marketplace
- [x] Affiliate tracking
- [x] Payment gateways
- [x] Mobile-responsive design
- [x] Admin CRM
- [x] Basic analytics

### Phase 2 (Growth) - 8 oy
- [ ] AI recommendation engine
- [ ] Advanced affiliate tools
- [ ] Social commerce integration
- [ ] Live streaming
- [ ] Mobile apps

### Phase 3 (Dominance) - 12 oy
- [ ] ML optimization
- [ ] Blockchain tracking
- [ ] Voice commerce
- [ ] IoT integration
- [ ] White-label solutions

---

**AFFILIMART** - O'zbekistondagi yetakchi marketplace va affiliate network platformasi! 🚀 