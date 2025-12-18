# 🏪 DUBAYMALL

Premium E-commerce Platform with Influencer Marketing & Warehouse Logistics

## 🎉 LIVE DEMO

**Main Site:** [https://3000--019b203d-11a8-788a-aebb-a37fe4b731e7.eu-central-1-01.gitpod.dev](https://3000--019b203d-11a8-788a-aebb-a37fe4b731e7.eu-central-1-01.gitpod.dev)

**Dashboards:**
- Admin: [/admin/dashboard](https://3000--019b203d-11a8-788a-aebb-a37fe4b731e7.eu-central-1-01.gitpod.dev/admin/dashboard)
- Seller: [/seller/dashboard](https://3000--019b203d-11a8-788a-aebb-a37fe4b731e7.eu-central-1-01.gitpod.dev/seller/dashboard)
- Blogger: [/blogger/dashboard](https://3000--019b203d-11a8-788a-aebb-a37fe4b731e7.eu-central-1-01.gitpod.dev/blogger/dashboard)

## 🎯 Features

### For Sellers
- Product management with images/videos
- Warehouse delivery system
- Real-time sales analytics
- Automated payments

### For Bloggers
- Personal promo codes
- Referral link tracking
- AI-generated marketing materials
- Telegram bot integration
- 14-day payment cycle

### For Customers
- Premium product catalog
- Bundle deals with bonuses
- Fast delivery (1-2 days)
- Multiple payment methods
- Order tracking

### For Admin
- AI product verification
- Warehouse management
- Logistics coordination
- Financial reports
- User management

## 🚀 Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **AI:** OpenAI GPT-4
- **Bot:** Telegram Bot API
- **Payment:** Click, Payme, Uzum

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

1. Create Supabase project
2. Run migrations from `/supabase/migrations`
3. Update `.env.local` with Supabase credentials

## 📱 Telegram Bot Setup

1. Create bot via @BotFather
2. Get bot token
3. Add token to `.env.local`
4. Bot will auto-start with the app

## 💳 Payment Integration

### Click
1. Register at click.uz
2. Get merchant credentials
3. Add to `.env.local`

## 🏗️ Project Structure

```
dubaymall/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── (auth)/       # Auth pages
│   │   ├── (dashboard)/  # Dashboard layouts
│   │   ├── admin/        # Admin panel
│   │   ├── seller/       # Seller cabinet
│   │   ├── blogger/      # Blogger cabinet
│   │   ├── api/          # API routes
│   │   └── (shop)/       # E-commerce pages
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript types
│   └── store/            # Zustand stores
├── supabase/
│   └── migrations/       # Database migrations
└── public/               # Static files
```

## 🔐 User Roles

- **Admin:** Platform management
- **Seller:** Product management
- **Blogger:** Marketing & promotion
- **Customer:** Shopping

## 💰 Business Model

### Commission Structure
- Platform fee: 20% (includes warehouse & logistics)
- Blogger commission: 20%
- Delivery fee: 25,000-50,000 UZS (customer pays)

### Payment Flow
1. Customer pays full amount
2. Platform holds payment
3. Product delivered
4. 14-day waiting period
5. Automated payout to seller & blogger

## 📊 Key Metrics

- Real-time sales tracking
- Blogger performance analytics
- Warehouse inventory
- Logistics status
- Financial reports

## 🤖 AI Features

- Product verification
- Price calculation
- Marketing text generation
- Fraud detection
- Smart recommendations

## 🚚 Logistics

- Centralized warehouse
- 1-2 day delivery
- Real-time tracking
- Automated notifications

## 📈 Roadmap

### Phase 1 (MVP - 6 weeks)
- [x] Project setup
- [ ] Authentication
- [ ] Admin panel
- [ ] Seller cabinet
- [ ] Blogger cabinet
- [ ] E-commerce frontend
- [ ] Payment integration
- [ ] Telegram bot

### Phase 2 (Growth - 8 weeks)
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Dropshipping integration
- [ ] Multi-language support

### Phase 3 (Scale - 12 weeks)
- [ ] AI recommendations
- [ ] Affiliate network
- [ ] White-label solution

## 📞 Support

- Email: support@dubaymall.uz
- Telegram: @dubaymall_support

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ by Ona AI**
