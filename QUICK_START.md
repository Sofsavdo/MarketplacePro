# DUBAYMALL - Tezkor Boshlash Qo'llanmasi

## 🚀 Loyihani Ishga Tushirish

### 1. Dependencies O'rnatish
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

Server manzili: [https://3000--019b2d9e-dd9c-73f7-be09-8f576c08a0e3.us-east-1-01.gitpod.dev](https://3000--019b2d9e-dd9c-73f7-be09-8f576c08a0e3.us-east-1-01.gitpod.dev)

### 3. Production Build
```bash
npm run build
npm start
```

## 🔑 Test Hisoblar

| Rol | Email | Parol | Dashboard |
|-----|-------|-------|-----------|
| Admin | admin@dubaymall.uz | admin123 | /admin/dashboard |
| Sotuvchi | seller@dubaymall.uz | seller123 | /seller/dashboard |
| Bloger | blogger@dubaymall.uz | blogger123 | /blogger/dashboard |

## 📱 Asosiy Sahifalar

### Public Sahifalar
- `/` - Bosh sahifa
- `/products` - Mahsulotlar
- `/product/[id]` - Mahsulot tafsilotlari
- `/cart` - Savat
- `/checkout` - To'lov
- `/categories` - Kategoriyalar
- `/delivery` - Yetkazib berish
- `/terms` - Foydalanish shartlari
- `/privacy` - Maxfiylik siyosati

### Foydalanuvchi Sahifalari
- `/profile` - Profil
- `/orders` - Buyurtmalar
- `/wishlist` - Sevimlilar
- `/notifications` - Bildirishnomalar
- `/settings` - Sozlamalar

### Admin Sahifalari
- `/admin/dashboard` - Boshqaruv paneli
- `/admin/products` - Mahsulotlar
- `/admin/orders` - Buyurtmalar
- `/admin/users` - Foydalanuvchilar
- `/admin/categories` - Kategoriyalar
- `/admin/banners` - Bannerlar
- `/admin/warehouse` - Ombor
- `/admin/promos` - Promo kodlar
- `/admin/ai-settings` - AI sozlamalari
- `/admin/monitoring` - Monitoring
- `/admin/settings` - Sozlamalar

### Sotuvchi Sahifalari
- `/seller/dashboard` - Dashboard
- `/seller/products` - Mahsulotlar
- `/seller/products/add` - Mahsulot qo'shish
- `/seller/orders` - Buyurtmalar
- `/seller/finance` - Moliya
- `/seller/stats` - Statistika
- `/seller/reviews` - Sharhlar
- `/seller/settings` - Sozlamalar

### Bloger Sahifalari
- `/blogger/dashboard` - Dashboard
- `/blogger/products` - Mahsulotlar
- `/blogger/promo` - Promo kodlar
- `/blogger/earnings` - Daromad
- `/blogger/stats` - Statistika
- `/blogger/company` - Kompaniya
- `/blogger/settings` - Sozlamalar

## 🔧 Muhim Komandalar

```bash
# Development
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm run lint         # Linting
npm run type-check   # TypeScript tekshirish

# Git
git status           # O'zgarishlarni ko'rish
git add .            # Barcha o'zgarishlarni qo'shish
git commit -m "msg"  # Commit
git push             # Push
```

## 📦 Texnologiyalar

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Database:** Supabase (Mock DB hozirda)
- **Auth:** Cookie-based sessions
- **Payment:** Click, Payme
- **AI:** OpenAI
- **Bot:** Telegram

## 🐛 Muammolarni Hal Qilish

### Build Xatosi
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Port Band
```bash
# 3000 portni bo'shatish
lsof -ti:3000 | xargs kill -9
npm run dev
```

### TypeScript Xatolar
```bash
npm run type-check
```

### Cache Tozalash
```bash
rm -rf .next
npm run dev
```

## 📚 Qo'shimcha Ma'lumot

- **To'liq Hisobot:** `TUZATISHLAR.md`
- **Deployment:** `DEPLOYMENT.md`
- **Features:** `FEATURES.md`
- **Testing:** `TESTING_GUIDE.md`

## 💡 Maslahatlar

1. **Development:** Mock database ishlatilmoqda, ma'lumotlar restart qilinganda yo'qoladi
2. **Production:** Real Supabase database ulang
3. **Environment:** `.env` faylini to'ldiring
4. **Security:** Production uchun secret keylarni o'zgartiring

## 🆘 Yordam

Muammo yuzaga kelsa:
1. `TUZATISHLAR.md` faylini o'qing
2. Console loglarni tekshiring
3. Browser DevTools'ni oching
4. Network tab'da API so'rovlarni ko'ring

---

**Omad tilaymiz! 🚀**
