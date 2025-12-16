# 🚂 RAILWAY'GA DEPLOY QILISH - QADAMMA-QADAM

## ✅ BUILD MUVAFFAQIYATLI!

Loyiha Railway'da deploy qilishga tayyor! ✅

---

## 🚀 RAILWAY DEPLOY QADAMLARI

### 1. Railway Account Yaratish

```
1. https://railway.app ga kiring
2. "Start a New Project" tugmasini bosing
3. "Login with GitHub" ni tanlang
4. GitHub account bilan login qiling
```

---

### 2. GitHub Repository Ulash

```
1. Railway dashboard'da "New Project" bosing
2. "Deploy from GitHub repo" ni tanlang
3. "MarketplacePro" repository'ni toping
4. "Deploy Now" tugmasini bosing
```

---

### 3. Environment Variables Qo'shish

Railway dashboard → Project → Variables tab

#### Minimal (Mock DB bilan):

```bash
# Mock DB mode (Supabase'siz)
NEXT_PUBLIC_USE_SUPABASE=false

# App URL (Railway beradi)
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
NEXT_PUBLIC_APP_NAME=DUBAYMALL

# Warehouse
WAREHOUSE_ADDRESS=Toshkent, O'zbekiston
WAREHOUSE_PHONE=+998901234567
```

#### To'liq (Supabase bilan):

```bash
# Supabase (https://supabase.com dan oling)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_USE_SUPABASE=true

# OpenAI (https://platform.openai.com dan oling)
OPENAI_API_KEY=sk-proj-...

# Telegram Bot (https://t.me/BotFather dan oling)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=dubaymall_bot

# Click Payment (https://click.uz dan oling)
CLICK_MERCHANT_ID=12345
CLICK_SERVICE_ID=67890
CLICK_SECRET_KEY=your_secret_key

# Payme (https://payme.uz dan oling)
PAYME_MERCHANT_ID=your_merchant_id
PAYME_SECRET_KEY=your_secret_key

# Uzum Bank (https://uzumbank.uz dan oling)
UZUM_MERCHANT_ID=your_merchant_id
UZUM_SECRET_KEY=your_secret_key

# App
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
NEXT_PUBLIC_APP_NAME=DUBAYMALL

# Warehouse
WAREHOUSE_ADDRESS=Toshkent, O'zbekiston
WAREHOUSE_PHONE=+998901234567
```

---

### 4. Deploy

Railway avtomatik deploy qiladi:

```
1. GitHub'ga push qilganingizda avtomatik deploy bo'ladi
2. Railway dashboard'da "Deployments" tab'ida jarayonni ko'ring
3. Build muvaffaqiyatli bo'lsa, URL paydo bo'ladi
```

---

### 5. Custom Domain (Optional)

```
1. Railway dashboard → Settings → Domains
2. "Add Domain" tugmasini bosing
3. O'z domeningizni kiriting (masalan: dubaymall.uz)
4. DNS sozlamalarini yangilang:
   - Type: CNAME
   - Name: @ yoki www
   - Value: your-app.railway.app
5. SSL certificate avtomatik qo'shiladi
```

---

## 🗄️ SUPABASE SOZLASH (Optional)

Agar Supabase ishlatmoqchi bo'lsangiz:

### 1. Supabase Account

```
1. https://supabase.com ga kiring
2. "Start your project" tugmasini bosing
3. GitHub bilan login qiling
```

### 2. Project Yaratish

```
1. "New Project" tugmasini bosing
2. Project name: dubaymall
3. Database password: (kuchli parol yarating)
4. Region: Singapore (yoki yaqin region)
5. "Create new project" tugmasini bosing
```

### 3. Database Migration

Supabase Dashboard → SQL Editor:

```sql
-- supabase/migrations/001_initial_schema.sql faylini
-- copy-paste qiling va "Run" tugmasini bosing
```

Yoki Supabase CLI:

```bash
# 1. CLI o'rnatish
npm install -g supabase

# 2. Login
supabase login

# 3. Link project
supabase link --project-ref your-project-ref

# 4. Migration
supabase db push
```

### 4. API Keys Olish

Supabase Dashboard → Settings → API:

```
URL: https://xxx.supabase.co
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Bu keylarni Railway environment variables'ga qo'shing.

---

## 🔧 RAILWAY SOZLAMALARI

### Build Command

Railway avtomatik aniqlaydi:
```bash
npm install && npm run build
```

### Start Command

Railway avtomatik aniqlaydi:
```bash
npm start
```

### Port

Railway avtomatik `PORT` environment variable beradi.
Next.js avtomatik ishlatadi.

---

## 📊 DEPLOY CHECKLIST

### Railway

- [ ] GitHub repository ulangan
- [ ] Environment variables qo'shilgan
- [ ] Build muvaffaqiyatli
- [ ] Deploy muvaffaqiyatli
- [ ] URL ishlayapti
- [ ] Custom domain sozlangan (optional)

### Supabase (Optional)

- [ ] Project yaratilgan
- [ ] Database migration ishga tushgan
- [ ] API keys olingan
- [ ] Railway'ga keys qo'shilgan
- [ ] `NEXT_PUBLIC_USE_SUPABASE=true` qilingan

### Test

- [ ] Bosh sahifa ochiladi
- [ ] Login ishlaydi
- [ ] Admin panel ishlaydi
- [ ] Seller panel ishlaydi
- [ ] Blogger panel ishlaydi
- [ ] API endpoints ishlaydi

---

## 🎯 DEPLOY VARIANTLARI

### Variant 1: Mock DB (Eng Oson) ✅

```bash
# Faqat shu kerak:
NEXT_PUBLIC_USE_SUPABASE=false
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

**Afzallik:**
- ✅ Juda oson
- ✅ Tez deploy
- ✅ Xarajat yo'q

**Kamchilik:**
- ⚠️ Ma'lumotlar RAM'da (server restart → yo'qoladi)
- ⚠️ Production uchun yaroqsiz

**Qachon ishlatish:**
- Demo
- Test
- Presentation

---

### Variant 2: Railway PostgreSQL

```bash
# Railway dashboard → Add Service → PostgreSQL
# Avtomatik DATABASE_URL beradi
```

**Afzallik:**
- ✅ Real database
- ✅ Ma'lumotlar saqlanadi
- ✅ Railway ichida

**Kamchilik:**
- ⚠️ Qo'shimcha narx ($5-10/oy)
- ⚠️ Auth o'zingiz qilishingiz kerak
- ⚠️ File storage o'zingiz

**Qachon ishlatish:**
- Kichik production
- Budget cheklangan

---

### Variant 3: Railway + Supabase ✅ (TAVSIYA)

```bash
# Railway: Hosting
# Supabase: Database + Auth + Storage
```

**Afzallik:**
- ✅ Real database
- ✅ Authentication tayyor
- ✅ File storage tayyor
- ✅ Real-time features
- ✅ Dashboard va monitoring

**Kamchilik:**
- ⚠️ Ikki platform sozlash kerak
- ⚠️ Qo'shimcha narx ($25/oy Supabase Pro)

**Qachon ishlatish:**
- Production
- Real biznes
- Scalable app

---

## 💰 NARX

### Railway

```
Free tier: $5/oy credit
- Hobby projects uchun yetadi
- 500 soat/oy
- 512MB RAM
- 1GB disk

Pro: $20/oy
- Unlimited projects
- Priority support
```

### Supabase

```
Free tier:
- 500MB database
- 1GB file storage
- 50,000 MAU
- 2GB bandwidth

Pro: $25/oy
- 8GB database
- 100GB file storage
- 100,000 MAU
- 50GB bandwidth
```

### Jami

```
Mock DB: $5/oy (Railway free credit)
Railway + Supabase Free: $5/oy
Railway + Supabase Pro: $30/oy
```

---

## 🔍 TROUBLESHOOTING

### Build Failed

```bash
# Railway logs'ni ko'ring:
Railway Dashboard → Deployments → View Logs

# Umumiy muammolar:
1. Environment variables noto'g'ri
2. Node.js version mos emas
3. Dependencies o'rnatilmagan
```

### Deploy Failed

```bash
# Port muammosi:
# Railway avtomatik PORT beradi
# Next.js avtomatik ishlatadi

# Agar muammo bo'lsa:
# package.json'da "start": "next start -p $PORT"
```

### Supabase Connection Failed

```bash
# API keys to'g'ri ekanligini tekshiring
# URL https:// bilan boshlanishini tekshiring
# NEXT_PUBLIC_USE_SUPABASE=true ekanligini tekshiring
```

---

## 🎉 MUVAFFAQIYATLI DEPLOY!

Agar barcha qadamlar to'g'ri bajarilsa:

```
✅ Railway'da deploy bo'ldi
✅ URL ishlayapti
✅ Barcha sahifalar ochiladi
✅ API endpoints ishlaydi
✅ Database ulangan (agar Supabase ishlatilsa)
```

---

## 📞 YORDAM

Agar deploy qilishda muammo bo'lsa:

1. Railway logs'ni ko'ring
2. Environment variables'ni tekshiring
3. Build command'ni tekshiring
4. GitHub repository'ni tekshiring

Yordam kerakmi? So'rang! 🚀

---

## 🔗 FOYDALI LINKLAR

- Railway: https://railway.app
- Supabase: https://supabase.com
- Next.js Docs: https://nextjs.org/docs
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs

---

**Omad! Deploy muvaffaqiyatli bo'lsin! 🎉🚀**
