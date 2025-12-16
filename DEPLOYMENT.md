# 🚀 DUBAYMALL - DEPLOYMENT GUIDE

## ✅ HOZIRGI HOLAT: 70% TAYYOR

### **ISHLAYDIGAN QISMLAR:**

#### 1. **Authentication** ✅
- Login/Register (real API)
- Session management
- Role-based access
- Test accounts mavjud

#### 2. **E-commerce** ✅
- Mahsulotlar ko'rish
- Savatga qo'shish
- Promo kod validation (real API)
- Checkout va buyurtma yaratish (real API)

#### 3. **API** ✅
- 12 ta endpoint tayyor
- Mock database ishlaydi
- Error handling

#### 4. **UI/UX** ✅
- 12 ta sahifa
- 3 ta dashboard
- Responsive dizayn
- Uzum.uz stilida

---

## 🔧 QOLGAN ISH (30%):

### **1. Real Database (Supabase)**
Hozir mock database ishlatilmoqda. Production uchun:

```bash
# 1. Supabase project yarating
# 2. .env.local ni yangilang:
NEXT_PUBLIC_SUPABASE_URL=your_real_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_key
SUPABASE_SERVICE_ROLE_KEY=your_real_service_key

# 3. Migrations run qiling:
cd supabase
supabase db push
```

### **2. File Upload**
Rasm yuklash uchun:
- Supabase Storage setup
- Image optimization
- CDN integration

### **3. Telegram Bot**
Bot aktivlashtirish:
```bash
# 1. @BotFather orqali bot yarating
# 2. Token oling
# 3. .env.local ga qo'shing:
TELEGRAM_BOT_TOKEN=your_bot_token

# 4. Webhook setup:
curl -X POST https://api.telegram.org/bot<TOKEN>/setWebhook \
  -d url=https://your-domain.com/api/telegram/webhook
```

### **4. Payment Gateway**
Click integratsiya:
```bash
# 1. Click.uz da ro'yxatdan o'ting
# 2. Merchant credentials oling
# 3. .env.local ga qo'shing:
CLICK_MERCHANT_ID=your_merchant_id
CLICK_SERVICE_ID=your_service_id
CLICK_SECRET_KEY=your_secret_key
```

### **5. AI Features (Optional)**
OpenAI integratsiya:
```bash
# .env.local:
OPENAI_API_KEY=your_openai_key
```

---

## 📦 DEPLOYMENT

### **Vercel (Tavsiya)**

```bash
# 1. Vercel CLI o'rnating
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Environment variables qo'shing:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... boshqa variables

# 5. Production deploy
vercel --prod
```

### **Railway**

```bash
# 1. Railway CLI o'rnating
npm i -g @railway/cli

# 2. Login
railway login

# 3. Init
railway init

# 4. Deploy
railway up
```

### **Docker**

```bash
# 1. Build
docker build -t dubaymall .

# 2. Run
docker run -p 3000:3000 dubaymall
```

---

## 🧪 TESTING

### **Local Testing**

```bash
# 1. Dependencies
npm install

# 2. Environment
cp .env.example .env.local
# Edit .env.local

# 3. Run
npm run dev

# 4. Test accounts:
# Admin: admin@dubaymall.uz / admin123
# Seller: seller@dubaymall.uz / seller123
# Blogger: blogger@dubaymall.uz / blogger123
```

### **Test Scenarios**

1. **Authentication:**
   - ✅ Login with test accounts
   - ✅ Register new user
   - ✅ Role-based redirects

2. **E-commerce:**
   - ✅ Browse products
   - ✅ Add to cart
   - ✅ Apply promo code (BLOGGER2024)
   - ✅ Checkout
   - ✅ Create order

3. **Dashboards:**
   - ✅ Admin dashboard
   - ✅ Seller dashboard
   - ✅ Blogger dashboard

---

## 🔐 SECURITY

### **Before Production:**

1. **Environment Variables:**
   - ❌ Never commit .env.local
   - ✅ Use Vercel/Railway secrets
   - ✅ Rotate keys regularly

2. **Authentication:**
   - ✅ Implement password hashing (bcrypt)
   - ✅ Add rate limiting
   - ✅ Enable CSRF protection

3. **API:**
   - ✅ Add input validation
   - ✅ Implement rate limiting
   - ✅ Add API authentication

4. **Database:**
   - ✅ Enable Row Level Security (Supabase)
   - ✅ Use prepared statements
   - ✅ Regular backups

---

## 📊 MONITORING

### **Setup Monitoring:**

1. **Vercel Analytics:**
   ```bash
   npm install @vercel/analytics
   ```

2. **Sentry (Error Tracking):**
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard -i nextjs
   ```

3. **PostHog (User Analytics):**
   ```bash
   npm install posthog-js
   ```

---

## 🚀 PRODUCTION CHECKLIST

### **Pre-Launch:**
- [ ] Real database (Supabase) setup
- [ ] Environment variables configured
- [ ] File upload working
- [ ] Payment gateway tested
- [ ] Telegram bot active
- [ ] SSL certificate
- [ ] Domain configured
- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel/PostHog)
- [ ] Backup strategy

### **Post-Launch:**
- [ ] Monitor errors
- [ ] Check performance
- [ ] User feedback
- [ ] Bug fixes
- [ ] Feature updates

---

## 📞 SUPPORT

**Issues:** GitHub Issues
**Email:** support@dubaymall.uz
**Telegram:** @dubaymall_support

---

## 📈 ROADMAP

### **Phase 1 (Current - 70% Complete)**
- ✅ Authentication
- ✅ E-commerce
- ✅ Mock database
- ⏳ Real database
- ⏳ File upload

### **Phase 2 (Next 2 weeks)**
- [ ] Admin product approval
- [ ] Seller product management
- [ ] Blogger promo system
- [ ] Real-time notifications
- [ ] Analytics dashboard

### **Phase 3 (Next 4 weeks)**
- [ ] Telegram bot full integration
- [ ] Payment processing
- [ ] AI features
- [ ] Mobile app
- [ ] Advanced analytics

---

**Built with ❤️ by Ona AI**
