# 🔐 DUBAYMALL - Test Accounts

## Test Uchun Accountlar

### 👨‍💼 Admin Account
```
Email:    admin@dubaymall.uz
Password: admin123
Role:     Admin
Status:   Active
```

**Imkoniyatlar:**
- Barcha foydalanuvchilarni ko'rish
- Seller va blogger arizalarini tasdiqlash/rad etish
- Platform boshqaruvi
- Moliyaviy hisobotlar
- Marketing kampaniyalari

---

### 🛒 Mijoz (Customer) Account
```
Email:    customer@test.uz
Password: customer123
Role:     Customer
Status:   Active (avtomatik)
```

**Imkoniyatlar:**
- Mahsulotlarni ko'rish va xarid qilish
- Buyurtmalarni kuzatish
- Sharh va baholash
- Sevimlilar ro'yxati

---

### 🏪 Sotuvchi (Seller) Account - Tasdiqlangan

```
Email:    seller@test.uz
Password: seller123
Role:     Seller
Status:   Approved
```

**Ma'lumotlar:**
- Kompaniya: Test Company LLC
- Litsenziya: 123456789
- STIR: 987654321

**Imkoniyatlar:**
- AI kamera bilan mahsulot yaratish
- Buyurtmalarni boshqarish
- Ombor nazorati
- Moliyaviy hisobotlar
- **Hold period:** 14 kun (pul yechish uchun)

---

### 🏪 Sotuvchi (Seller) Account - Kutilmoqda

```
Email:    seller.pending@test.uz
Password: seller123
Role:     Seller
Status:   Pending
```

**Ma'lumotlar:**
- Kompaniya: Pending Company LLC
- Litsenziya: 111222333
- STIR: 444555666

**Holat:**
- Admin tekshiruvida
- Profilga kirish imkoni yo'q
- Pending approval sahifasida

---

### 🏪 Sotuvchi (Seller) Account - Rad etilgan

```
Email:    seller.rejected@test.uz
Password: seller123
Role:     Seller
Status:   Rejected
```

**Ma'lumotlar:**
- Kompaniya: Rejected Company LLC
- Litsenziya: 999888777
- STIR: 666555444

**Holat:**
- Admin tomonidan rad etilgan
- Sabab: "Biznes litsenziya noto'g'ri"
- Qayta ro'yxatdan o'tishi kerak

---

### 📢 Bloger (Blogger) Account - Tasdiqlangan

```
Email:    blogger@test.uz
Password: blogger123
Role:     Blogger
Status:   Approved
```

**Ijtimoiy tarmoqlar:**
- YouTube: @testblogger (5000 obunachi)
- Instagram: @testblogger (3000 obunachi)
- Telegram: @testblogger (2000 obunachi)
- **Jami:** 10,000 obunachi ✅

**Imkoniyatlar:**
- 1-tap promo kod yaratish
- Referal havolalar
- Daromad kuzatuvi
- **Hold period:** 14 kun (pul yechish uchun)

---

### 📢 Bloger (Blogger) Account - Kutilmoqda

```
Email:    blogger.pending@test.uz
Password: blogger123
Role:     Blogger
Status:   Pending
```

**Ijtimoiy tarmoqlar:**
- YouTube: @pendingblogger (800 obunachi)
- Instagram: @pendingblogger (600 obunachi)
- Telegram: @pendingblogger (400 obunachi)
- **Jami:** 1,800 obunachi ✅

**Holat:**
- Admin tekshiruvida
- Profilga kirish imkoni yo'q
- Pending approval sahifasida

---

### 📢 Bloger (Blogger) Account - Rad etilgan

```
Email:    blogger.rejected@test.uz
Password: blogger123
Role:     Blogger
Status:   Rejected
```

**Ijtimoiy tarmoqlar:**
- YouTube: @rejectedblogger (200 obunachi)
- Instagram: @rejectedblogger (150 obunachi)
- Telegram: @rejectedblogger (100 obunachi)
- **Jami:** 450 obunachi ❌ (500 dan kam)

**Holat:**
- Admin tomonidan rad etilgan
- Sabab: "Obunachilari 500 dan kam (jami 450)"
- Qayta ro'yxatdan o'tishi kerak

---

## 🧪 Test Scenariylari

### 1. Mijoz Ro'yxatdan O'tish
```
1. /register ga kiring
2. "Mijoz" ni tanlang
3. Ma'lumotlarni kiriting
4. "Ro'yxatdan o'tish" bosing
5. ✅ Avtomatik bosh sahifaga o'tadi
```

### 2. Sotuvchi Ro'yxatdan O'tish
```
1. /register ga kiring
2. "Sotuvchi" ni tanlang
3. Ma'lumotlarni kiriting:
   - Kompaniya nomi
   - Biznes litsenziya
   - STIR raqami
4. "Ro'yxatdan o'tish" bosing
5. ⏳ Pending approval sahifasiga o'tadi
6. Admin tasdiqlashi kerak
```

### 3. Bloger Ro'yxatdan O'tish
```
1. /register ga kiring
2. "Bloger" ni tanlang
3. Ijtimoiy tarmoq ma'lumotlarini kiriting:
   - YouTube (kanal + obunachilari)
   - Instagram (username + obunachilari)
   - Telegram (kanal + obunachilari)
4. Jami obunachilari >= 500 bo'lishi kerak
5. "Ro'yxatdan o'tish" bosing
6. ⏳ Pending approval sahifasiga o'tadi
7. Admin tekshiradi va tasdiqlaydi
```

### 4. Admin Tasdiqlash
```
1. admin@dubaymall.uz bilan kiring
2. /admin/users ga o'ting
3. "Pending" statusdagi foydalanuvchilarni ko'ring
4. Har birini tekshiring:
   - Seller: Litsenziya va STIR
   - Blogger: Ijtimoiy tarmoqlar va obunachilari
5. "Tasdiqlash" yoki "Rad etish" bosing
6. Foydalanuvchiga email yuboriladi
```

### 5. Hold Period Test (Seller/Blogger)
```
1. Tasdiqlangan seller/blogger bilan kiring
2. Mahsulot sotish / Promo kod ishlatish
3. Daromad ko'rinadi
4. "Pul yechish" tugmasini bosing
5. ⏳ "14 kun kutish kerak" xabari
6. 14 kundan keyin pul yechish mumkin
```

---

## 📊 Holat Diagrammasi

### Mijoz (Customer)
```
Register → Active → Dashboard
```

### Sotuvchi/Bloger (Seller/Blogger)
```
Register → Pending → Admin Review → Approved/Rejected
                                    ↓
                              Dashboard (Hold period)
```

---

## 🔄 Holat O'zgarishlari

### Pending → Approved
```sql
UPDATE users 
SET status = 'approved', 
    approved_at = NOW() 
WHERE id = 'user_id';
```

### Pending → Rejected
```sql
UPDATE users 
SET status = 'rejected', 
    rejected_at = NOW(),
    rejection_reason = 'Sabab' 
WHERE id = 'user_id';
```

### Approved → Active (birinchi login)
```sql
UPDATE users 
SET status = 'active' 
WHERE id = 'user_id' AND status = 'approved';
```

---

## 💰 Hold Period (Pul Yechish)

### Seller Hold Period
```
Mahsulot sotildi → 14 kun kutish → Pul yechish mumkin
```

### Blogger Hold Period
```
Promo kod ishlatildi → 14 kun kutish → Komissiya yechish mumkin
```

### Hold Period Tekshirish
```typescript
const canWithdraw = (transactionDate: Date) => {
  const holdPeriod = 14 * 24 * 60 * 60 * 1000 // 14 days in ms
  const now = Date.now()
  const transactionTime = transactionDate.getTime()
  
  return (now - transactionTime) >= holdPeriod
}
```

---

## 🎯 Tekshirish Kriteriylari

### Seller Tekshirish
- ✅ Kompaniya nomi to'ldirilgan
- ✅ Biznes litsenziya raqami mavjud
- ✅ STIR raqami to'g'ri formatda
- ✅ Telefon raqami tasdiqlangan
- ✅ Email tasdiqlangan

### Blogger Tekshirish
- ✅ Kamida bitta ijtimoiy tarmoq hisobi
- ✅ Jami obunachilari >= 500
- ✅ Hisoblar faol (oxirgi 30 kunda post bor)
- ✅ Fake hisoblar emas
- ✅ Telefon raqami tasdiqlangan
- ✅ Email tasdiqlangan

---

## 📧 Email Xabarlari

### Tasdiqlangan
```
Subject: Arizangiz tasdiqlandi! 🎉

Hurmatli [Ism],

Sizning [Seller/Blogger] arizangiz tasdiqlandi!

Endi siz platformaga kirishingiz va ishlashni boshlashingiz mumkin.

Login: [email]

Eslatma: Pul yechish uchun 14 kun hold period mavjud.

DUBAYMALL jamoasi
```

### Rad etilgan
```
Subject: Arizangiz rad etildi

Hurmatli [Ism],

Afsus, sizning arizangiz qabul qilinmadi.

Sabab: [rejection_reason]

Iltimos, ma'lumotlaringizni to'g'rilang va qayta urinib ko'ring.

DUBAYMALL jamoasi
```

---

## 🔐 Xavfsizlik

### Password Requirements
- Minimum 6 ta belgi
- Katta va kichik harflar (tavsiya)
- Raqamlar (tavsiya)
- Maxsus belgilar (tavsiya)

### Account Security
- Email verification
- Phone verification
- 2FA (keyingi versiya)
- Session timeout: 24 soat
- Failed login attempts: 5 (keyin block)

---

## 📱 Mobil Test

### iOS Safari
```
1. Safari da oching
2. Share → Add to Home Screen
3. PWA sifatida o'rnating
4. Test qiling
```

### Android Chrome
```
1. Chrome da oching
2. Install prompt paydo bo'ladi
3. "Install" bosing
4. Test qiling
```

---

## 🐛 Bug Report

Agar xato topsangiz:

```
Email: support@dubaymall.uz
Subject: Bug Report - [Qisqa tavsif]

Ma'lumotlar:
- Account: [email]
- Sahifa: [URL]
- Xato: [Tavsif]
- Screenshot: [Agar bor bo'lsa]
```

---

## ✅ Test Checklist

### Registration
- [ ] Mijoz ro'yxatdan o'tishi
- [ ] Seller ro'yxatdan o'tishi (pending)
- [ ] Blogger ro'yxatdan o'tishi (pending)
- [ ] Validation ishlashi
- [ ] Error messages ko'rinishi

### Admin Approval
- [ ] Pending users ko'rinishi
- [ ] Approve ishlashi
- [ ] Reject ishlashi
- [ ] Email yuborilishi

### Hold Period
- [ ] Seller pul yechish (14 kun)
- [ ] Blogger komissiya yechish (14 kun)
- [ ] Hold period tugagandan keyin yechish

### Mobile
- [ ] PWA o'rnatish
- [ ] Offline ishlash
- [ ] Camera scanner
- [ ] Touch gestures

---

<div align="center">

**DUBAYMALL - Test Accounts**

Barcha accountlar test uchun mo'ljallangan

</div>
