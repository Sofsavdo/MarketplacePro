# DUBAYMALL - Production Deployment Guide

## 🚀 Production ga O'tish Qo'llanmasi

### 📋 BOSHLASHDAN OLDIN

**Hozirgi holat:**
- ✅ 80+ sahifa tayyor
- ✅ 120+ funksiya tayyor
- ✅ Frontend to'liq ishlaydi
- ✅ Authentication service tayyor (JWT + bcrypt)
- ✅ Product CRUD service tayyor
- ✅ Order management system tayyor
- ✅ Email templates tayyor
- ✅ Notification system tayyor
- ✅ Real-time features tayyor
- ✅ File upload service tayyor
- ✅ Image optimization utilities tayyor
- ✅ Error handling va logging tayyor
- ✅ API middleware tayyor
- ✅ Rate limiting tayyor
- ✅ Input validation tayyor
- ✅ Backup utilities tayyor
- ⚠️ Mock data ishlatilmoqda (development)
- ⚠️ Real database ulanishi kerak
- ⚠️ Real to'lovlar integratsiyasi kerak

**Production uchun kerak:**
1. ✅ Database (Supabase/PostgreSQL) - Service tayyor
2. ✅ Authentication (JWT + bcrypt) - Service tayyor
3. ⚠️ Payment (Click/Payme) - Integratsiya kerak
4. ✅ File Storage (Supabase Storage) - Service tayyor
5. ⚠️ Email Service (SendGrid) - Integratsiya kerak
6. ⚠️ SMS Service (Eskiz.uz) - Integratsiya kerak

---

## 1️⃣ DATABASE SETUP (Supabase)

### Step 1: Supabase Project Yaratish

```bash
# 1. https://supabase.com ga kiring
# 2. "New Project" bosing
# 3. Project nomi: dubaymall
# 4. Database password yarating
# 5. Region: Singapore (yaqin)
```

### Step 2: Database Schema Yaratish

```bash
# 1. Supabase Dashboard > SQL Editor
# 2. DATABASE_SCHEMA.sql faylini oching
# 3. Barcha SQL ni copy qiling
# 4. SQL Editor ga paste qiling
# 5. "Run" bosing
```

### Step 3: Environment Variables

`.env.local` faylini yarating:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
NEXT_PUBLIC_USE_SUPABASE=true
```

### Step 4: Supabase Client Yangilash

`src/lib/supabase-client.ts` faylini tekshiring:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 2️⃣ AUTHENTICATION SETUP

### Step 1: Supabase Auth Sozlash

```bash
# Supabase Dashboard > Authentication > Settings

# Email Templates
- Confirmation: Customize
- Reset Password: Customize
- Magic Link: Customize

# Providers
- Email: Enable
- Google: Enable (optional)
- Facebook: Enable (optional)
```

### Step 2: Auth Functions Yangilash

`src/lib/auth.ts` yarating:

```typescript
import { supabase } from './supabase-client'

export async function signUp(email: string, password: string, userData: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

---

## 3️⃣ PAYMENT INTEGRATION

### Click.uz Integration

```typescript
// src/lib/payment/click.ts

export async function createClickPayment(orderId: string, amount: number) {
  const merchantId = process.env.CLICK_MERCHANT_ID
  const serviceId = process.env.CLICK_SERVICE_ID
  const secretKey = process.env.CLICK_SECRET_KEY

  // Click API integration
  const response = await fetch('https://api.click.uz/v2/merchant/invoice/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': `${merchantId}:${secretKey}`
    },
    body: JSON.stringify({
      service_id: serviceId,
      amount: amount,
      transaction_param: orderId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-success`,
      merchant_trans_id: orderId
    })
  })

  return response.json()
}
```

### Payme Integration

```typescript
// src/lib/payment/payme.ts

export async function createPaymePayment(orderId: string, amount: number) {
  const merchantId = process.env.PAYME_MERCHANT_ID
  const secretKey = process.env.PAYME_SECRET_KEY

  // Payme API integration
  const paymentUrl = `https://checkout.paycom.uz/${btoa(`m=${merchantId};ac.order_id=${orderId};a=${amount * 100}`)}`
  
  return { paymentUrl }
}
```

### Environment Variables

```env
# Click
CLICK_MERCHANT_ID=your_merchant_id
CLICK_SERVICE_ID=your_service_id
CLICK_SECRET_KEY=your_secret_key

# Payme
PAYME_MERCHANT_ID=your_merchant_id
PAYME_SECRET_KEY=your_secret_key
```

---

## 4️⃣ FILE STORAGE SETUP

### Supabase Storage

```bash
# 1. Supabase Dashboard > Storage
# 2. Create bucket: "products"
# 3. Create bucket: "avatars"
# 4. Create bucket: "documents"
# 5. Set public access for "products" and "avatars"
```

### Upload Function

```typescript
// src/lib/storage.ts

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return publicUrl
}
```

---

## 5️⃣ EMAIL SERVICE SETUP

### SendGrid Integration

```bash
# 1. https://sendgrid.com ga kiring
# 2. API Key yarating
# 3. Sender email verify qiling
```

```typescript
// src/lib/email.ts

import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendEmail(to: string, subject: string, html: string) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject,
    html,
  }

  await sgMail.send(msg)
}

export async function sendOrderConfirmation(order: any) {
  const html = `
    <h1>Buyurtma tasdiqlandi</h1>
    <p>Buyurtma raqami: ${order.order_number}</p>
    <p>Jami: ${order.total} so'm</p>
  `
  
  await sendEmail(order.customer_email, 'Buyurtma tasdiqlandi', html)
}
```

### Environment Variables

```env
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=noreply@dubaymall.uz
```

---

## 6️⃣ SMS SERVICE SETUP

### Eskiz.uz Integration

```typescript
// src/lib/sms.ts

export async function sendSMS(phone: string, message: string) {
  const token = await getEskizToken()
  
  const response = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mobile_phone: phone,
      message: message,
      from: '4546'
    })
  })

  return response.json()
}

async function getEskizToken() {
  const response = await fetch('https://notify.eskiz.uz/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ESKIZ_EMAIL,
      password: process.env.ESKIZ_PASSWORD
    })
  })

  const data = await response.json()
  return data.data.token
}
```

### Environment Variables

```env
ESKIZ_EMAIL=your_email
ESKIZ_PASSWORD=your_password
```

---

## 7️⃣ DEPLOYMENT

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Production
vercel --prod
```

### Environment Variables (Vercel)

```bash
# Vercel Dashboard > Settings > Environment Variables

# Add all variables from .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
CLICK_MERCHANT_ID=...
PAYME_MERCHANT_ID=...
SENDGRID_API_KEY=...
ESKIZ_EMAIL=...
```

### Custom Domain

```bash
# Vercel Dashboard > Domains
# Add: dubaymall.uz
# Configure DNS:
# A record: @ -> 76.76.21.21
# CNAME: www -> cname.vercel-dns.com
```

---

## 8️⃣ MONITORING & ANALYTICS

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs

# sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### Google Analytics

```typescript
// src/lib/analytics.ts

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export const event = ({ action, category, label, value }: any) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
```

---

## 9️⃣ SECURITY CHECKLIST

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting implemented
- [ ] CSRF protection enabled
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] Input validation
- [ ] Password hashing (bcrypt)
- [ ] JWT tokens
- [ ] Secure cookies
- [ ] CORS configured
- [ ] Security headers
- [ ] Regular backups
- [ ] Error logging
- [ ] Access control

---

## 🔟 TESTING

### Before Production

```bash
# 1. Run tests
npm run test

# 2. Build check
npm run build

# 3. Type check
npm run type-check

# 4. Lint
npm run lint

# 5. Performance test
npm run lighthouse
```

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run load-test.js
```

---

## 📊 LAUNCH CHECKLIST

### Pre-Launch
- [ ] Database setup complete
- [ ] Authentication working
- [ ] Payment integration tested
- [ ] File upload working
- [ ] Email service configured
- [ ] SMS service configured
- [ ] All environment variables set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics installed
- [ ] Error tracking setup
- [ ] Backup system ready

### Launch Day
- [ ] Final testing
- [ ] Database backup
- [ ] Deploy to production
- [ ] Verify all features
- [ ] Monitor errors
- [ ] Check performance
- [ ] Test payments
- [ ] Test emails
- [ ] Test SMS

### Post-Launch
- [ ] Monitor traffic
- [ ] Check error logs
- [ ] Review analytics
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Optimize performance
- [ ] Update documentation

---

## 🆘 TROUBLESHOOTING

### Database Connection Issues
```bash
# Check Supabase status
# Verify environment variables
# Check network connectivity
# Review Supabase logs
```

### Payment Failures
```bash
# Verify API credentials
# Check webhook URLs
# Review transaction logs
# Test in sandbox mode
```

### Email Not Sending
```bash
# Verify SendGrid API key
# Check sender verification
# Review email templates
# Check spam folder
```

---

## 📞 SUPPORT

**Technical Issues:**
- GitHub Issues: https://github.com/Sofsavdo/MarketplacePro/issues
- Email: support@dubaymall.uz

**Documentation:**
- ROADMAP.md - Development roadmap
- DATABASE_SCHEMA.sql - Database structure
- ULTIMATE_FEATURES.md - All features

---

**Xulosa:** Production ga o'tish uchun yuqoridagi barcha qadamlarni ketma-ket bajaring. Har bir qadamni test qiling va keyingisiga o'ting.

**Muhim:** Birinchi navbatda database va authentication ni sozlang - bu eng muhim qismlar!
