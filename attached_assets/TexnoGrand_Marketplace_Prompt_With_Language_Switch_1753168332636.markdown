# TexnoGrand Marketplace Prompt for AI Assistant

You are tasked with creating a fully functional, professional marketplace named **"TexnoGrand"**, inspired by the structure, layout, and operational principles of Uzum.uz (visit uzum.uz for reference). The marketplace must be SEO-optimized, fully responsive on mobile and desktop devices, and support a language switcher allowing users to choose between **Uzbek** or **Russian** with no language mixing within a single page. It will use Next.js for the frontend and Node.js for the backend, with every component, page, and feature implemented to a 100% functional state. The design must not feel like a copy of Uzum.uz, featuring a unique color scheme and modern, minimalistic aesthetics. Additional features like affiliate marketing for sellers and bloggers must be included.

## Objectives
- Build a marketplace mirroring Uzum.uz’s layout (e.g., sliders, product grids, category pages) and functionality (e.g., fast delivery, product cards), but with a unique identity.
- Implement a language switcher allowing users to select Uzbek or Russian, ensuring all content (UI, APIs, static text) is fully localized in the chosen language.
- Complete all unfinished or missing components to professional standards.
- Fix errors, optimize performance, and add features like affiliate marketing for sellers and bloggers.
- Deploy a fully operational site in any environment (local, cloud, or IDEs like VS Code).

## Project Status
- **Technology**: Start fresh or enhance an existing project using Next.js (frontend) and Node.js (backend).
- **If Existing**: Assume partial implementation of product cards, navbar, homepage, and authentication, with potential issues like mixed languages or unoptimized design/performance.
- **Goals**:
  - Complete all unfinished parts to 100%.
  - Implement a language switcher for Uzbek and Russian, ensuring no language mixing.
  - Optimize design, performance, and functionality.
  - Incorporate unique features inspired by but distinct from Uzum.uz, including affiliate marketing.

## Technology Stack
| Component       | Technology                        |
|-----------------|-----------------------------------|
| Frontend        | Next.js (React), TypeScript, Tailwind CSS |
| Backend         | Node.js (NestJS or Express), TypeScript, PostgreSQL |
| Authentication  | JWT or NextAuth                  |
| API             | REST or GraphQL                  |
| Localization    | next-intl                        |

## Project Setup
- **New Project**:
  - Frontend: `npx create-next-app@latest --ts`
  - Backend: NestJS (`nest new`) or Express
  - Database: PostgreSQL via Supabase, Neon, or Heroku
- **Existing Project**:
  - Analyze codebase for incomplete components/APIs.
  - Fix errors via logs/unit tests (Jest, Supertest).
  - Optimize bottlenecks (e.g., slow queries, large files).
- **Structure**:
  - `/marketplace`
    - `/frontend`: Next.js project
    - `/backend`: Node.js project
    - `/admin-panel`: Separate or within frontend

## Design Specifications
- **Color Scheme**:
  - Primary: #2A6BFF (blue)
  - Accent: #FF8C38 (orange)
  - Background: #F8F9FA (light gray)
  - Text: #1A1A1A
  - Shadow: rgba(0, 0, 0, 0.1)
- **Fonts**: Inter or Roboto, supporting Uzbek and Russian alphabets.
- **Style**: Modern, minimalistic, with soft shadows and subtle animations. Adhere to A11y standards.
- **Inspiration**: Mirror Uzum.uz’s clean layout and user flow, but use TexnoGrand’s unique color scheme and styling to differentiate.

## Language Management
- Support **Uzbek** and **Russian** with a language switcher in the top navbar.
- Use `next-intl` for full localization of all components, APIs, and static text.
- Ensure no language mixing: each page, component, and API response is displayed entirely in the user’s selected language (Uzbek or Russian).
- **Language Switcher Implementation**:
  - Add a toggle button in the navbar to switch between Uzbek (`uz`) and Russian (`ru`).
  - Example code:
    ```jsx
    import { useRouter } from 'next/router';
    import { useTranslations } from 'next-intl';

    const LanguageSwitcher = () => {
      const router = useRouter();
      const t = useTranslations('common');

      const changeLanguage = (locale) => {
        router.push(router.pathname, router.asPath, { locale });
      };

      return (
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md ${router.query.locale === 'uz' ? 'bg-[#2A6BFF] text-white' : 'bg-gray-200'}`}
            onClick={() => changeLanguage('uz')}
          >
            {t('uzbek')}
          </button>
          <button
            className={`px-3 py-1 rounded-md ${router.query.locale === 'ru' ? 'bg-[#2A6BFF] text-white' : 'bg-gray-200'}`}
            onClick={() => changeLanguage('ru')}
          >
            {t('russian')}
          </button>
        </div>
      );
    };

    export default LanguageSwitcher;
    ```
- **Translation Files**:
  - Uzbek (`messages/uz.json`):
    ```json
    {
      "product": {
        "addToCart": "Savatga qo‘shish",
        "addToFavorites": "Sevimlilarga qo‘shish",
        "discount": "Chegirma",
        "reviews": "Sharhlar",
        "delivery": {
          "fast": "Tez yetkazib berish",
          "standard": "Standart yetkazib berish"
        }
      },
      "home": {
        "popularProducts": "Ommabop mahsulotlar",
        "newProducts": "Yangi mahsulotlar"
      },
      "category": {
        "products": "Mahsulotlar",
        "filters": {
          "price": "Narx",
          "rating": "Reyting",
          "brand": "Brend"
        }
      },
      "common": {
        "uzbek": "O‘zbek",
        "russian": "Русский",
        "search": "Qidiruv",
        "becomeSeller": "Sotuvchi bo‘ling",
        "becomePartner": "Hamkor bo‘ling"
      }
    }
    ```
  - Russian (`messages/ru.json`):
    ```json
    {
      "product": {
        "addToCart": "Добавить в корзину",
        "addToFavorites": "Добавить в избранное",
        "discount": "Скидка",
        "reviews": "Отзывы",
        "delivery": {
          "fast": "Быстрая доставка",
          "standard": "Стандартная доставка"
        }
      },
      "home": {
        "popularProducts": "Популярные товары",
        "newProducts": "Новые товары"
      },
      "category": {
        "products": "Товары",
        "filters": {
          "price": "Цена",
          "rating": "Рейтинг",
          "brand": "Бренд"
        }
      },
      "common": {
        "uzbek": "Узбекский",
        "russian": "Русский",
        "search": "Поиск",
        "becomeSeller": "Стать продавцом",
        "becomePartner": "Стать партнером"
      }
    }
    ```
- **Layout Integration**:
  ```jsx
  import { NextIntlClientProvider } from 'next-intl';
  import { useRouter } from 'next/router';

  export default function RootLayout({ children }) {
    const router = useRouter();
    const messages = require(`../../messages/${router.query.locale}.json`);

    return (
      <NextIntlClientProvider locale={router.query.locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  }
  ```

## Frontend Requirements
### Navbar
- Components: Logo, search bar, categories dropdown, "Become a Seller", "Become a Partner", login/signup, cart, favorites, **language switcher (UZ/RU)**.
- Fully responsive, styled like Uzum.uz’s navbar but using TexnoGrand’s color scheme.

### Main Page
- **Sliders**: 3-5 banners (promotions/new products) with auto-rotation and navigation (use `swiper`).
  ```jsx
  import { Swiper, SwiperSlide } from 'swiper/react';
  import { Navigation, Pagination, Autoplay } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';

  const HomeSlider = () => {
    return (
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
      >
        <SwiperSlide>
          <img src="/banners/aksiya1.webp" alt="Aksiya 1" className="w-full h-[400px] object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/banners/aksiya2.webp" alt="Aksiya 2" className="w-full h-[400px] object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/banners/aksiya3.webp" alt="Aksiya 3" className="w-full h-[400px] object-cover" />
        </SwiperSlide>
      </Swiper>
    );
  };

  export default HomeSlider;
  ```
- **Product Grid**: 5 rows, 4-5 cards per row (CSS Grid), responsive across devices.
  ```jsx
  import ProductCard from './ProductCard';
  import { useTranslations } from 'next-intl';

  const ProductGrid = ({ products }) => {
    const t = useTranslations('home');

    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-4">{t('popularProducts')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  };

  export default ProductGrid;
  ```
- **Sections**: Categories list, best-selling products, new products (match Uzum.uz’s homepage structure).
- **Blog/News** (optional): For SEO enhancement.

### Product Cards
- **Design**: Inspired by Uzum.uz but with TexnoGrand’s unique styling.
- **Specs**:
  - Image: 1080x1440px, `webp`, lazy-loaded via `next/image`.
  - Content: Name, price, discount, delivery info, rating (stars), review count, "Add to Cart" and "Add to Favorites" buttons.
  - Hover: Card lifts slightly, buttons change color (e.g., blue to darker blue).
- **CSS**:
  ```css
  :root {
    --primary: #2A6BFF;
    --accent: #FF8C38;
    --background: #F8F9FA;
    --text: #1A1A1A;
    --shadow: rgba(0, 0, 0, 0.1);
  }

  .product-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px var(--shadow);
    padding: 16px;
    transition: transform 0.3s ease;
    width: 280px;
    margin: 16px;
  }

  .product-card:hover {
    transform: translateY(-6px);
  }

  .product-image {
    width: 100%;
    height: 360px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .product-title {
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text);
    margin: 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .add-to-cart {
    background-color: var(--primary);
    color: white;
  }

  .add-to-cart:hover {
    background-color: #1A5BFF;
  }
  ```
- **JSX**:
  ```jsx
  import Image from 'next/image';
  import Link from 'next/link';
  import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/solid';
  import { useTranslations } from 'next-intl';

  const ProductCard = ({ product }) => {
    const t = useTranslations('product');

    return (
      <div className="product-card">
        <Link href={`/mahsulot/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={1080}
            height={1440}
            className="product-image"
            loading="lazy"
          />
        </Link>
        <div className="product-title">{product.name}</div>
        <div className="product-price">{product.price} UZS</div>
        {product.discount && (
          <div className="product-discount">{product.discount}% {t('discount')}</div>
        )}
        <div className="product-delivery">
          {product.delivery ? t('delivery.fast') : t('delivery.standard')}
        </div>
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span>({product.reviews} {t('reviews')})</span>
        </div>
        <div className="flex gap-2">
          <button className="add-to-cart">
            <ShoppingCartIcon className="h-5 w-5" />
            {t('addToCart')}
          </button>
          <button className="add-to-favorites">
            <HeartIcon className="h-5 w-5" />
            {t('addToFavorites')}
          </button>
        </div>
      </div>
    );
  };

  export default ProductCard;
  ```

### Category Pages
- **Structure**: 4 rows, 3-4 cards per row (CSS Grid).
  ```jsx
  import ProductCard from './ProductCard';
  import { useTranslations } from 'next-intl';

  const CategoryGrid = ({ products }) => {
    const t = useTranslations('category');

    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-4">{t('products')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  };

  export default CategoryGrid;
  ```
- **Filters**: Price, rating, brand (similar to Uzum.uz’s filtering).
- **Routing**: Dynamic, SEO-friendly URLs (e.g., `/category/electronics`).

### Other Pages
- **Product Detail**: Image gallery, description, specs, reviews, seller info (match Uzum.uz’s detail page).
- **Seller/Blogger Pages**: Registration and dashboards for managing products/affiliate links.

## Backend Requirements
### API Endpoints
| Type           | Functionality                     |
|----------------|-----------------------------------|
| User           | Register, login, profile          |
| Products       | CRUD operations                  |
| Categories     | Manage and filter                |
| Orders         | Create, pay, track               |
| Seller Cabinet | Product management, stats        |
| Blogger Cabinet| Affiliate links, commissions     |
| Notifications  | User alerts                      |

### Database Models
| Model       | Fields                          |
|-------------|---------------------------------|
| User        | Role (buyer/seller/blogger/admin), details |
| Product     | Name, price, desc, category, slug |
| Category    | Name, subcategories            |
| Order       | Product, user, status          |
| Commission  | % per category/product         |
| Promotion   | Discounts, offers              |

### Business Logic
- Commissions calculated per category/product (e.g., 5% for electronics).
- Logistics cost management (e.g., fast delivery like Uzum.uz).
- Seller agreements, product boosting, and affiliate commissions (bloggers earn per referral sale).

## Additional Features
- **Admin Panel**: Manage categories, commissions, logistics, promotions.
- **Seller Cabinet**: Add/edit products, view stats, boost listings (like Uzum.uz’s seller tools).
- **Blogger Cabinet**: Generate referral links, track clicks/conversions, view commissions.
- **Affiliate Marketing**:
  - Sellers promote via boosted listings (e.g., pay for higher visibility).
  - Bloggers earn commissions (e.g., 5% per sale) via referral links.
  - Example:
    ```javascript
    const generateReferralLink = (bloggerId, productId) => {
      return `https://texnogrand.com/referral?blogger=${bloggerId}&product=${productId}`;
    };

    const calculateCommission = async (sale) => {
      const commissionRate = await db.getCommissionRate(sale.categoryId);
      return sale.price * (commissionRate / 100);
    };
    ```
- **Personalization**: Basic AI recommendations based on user history or popular items.
  ```javascript
  const getRecommendations = async (userId) => {
    const history = await db.getUserHistory(userId);
    const recommendations = await db.getProductsByCategory(history.mostViewedCategory);
    return recommendations.slice(0, 4);
  };
  ```
- **Notifications**: Via Firebase/OneSignal for order updates.
  ```javascript
  import { getMessaging, getToken } from 'firebase/messaging';

  const messaging = getMessaging();
  getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }).then((token) => {
    console.log('FCM Token:', token);
  });
  ```
- **Live Chat**: Integrate Tawk.to.
  ```html
  <script>
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function() {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/default';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  </script>
  ```
- **Installment Payments**: BNPL integration (e.g., PayPal Pay Later or local services).
- **Telegram Bot**: Order tracking (similar to @Uzum_Support_Bot).
  ```javascript
  const { Telegraf } = require('telegraf');
  const bot = new Telegraf('YOUR_BOT_TOKEN');

  bot.command('status', async (ctx) => {
    const order = await db.getOrderByUser(ctx.from.id);
    ctx.reply(`Buyurtma holati: ${order.status}`);
  });

  bot.launch();
  ```

## Performance Optimization
- **Images**: Use `next/image`, `webp`, lazy loading, CDN (Cloudflare/Vercel).
- **Caching**: Redis for API/database queries.
  ```javascript
  const redis = require('redis');
  const client = redis.createClient();

  const getCachedProducts = async () => {
    const cached = await client.get('products');
    if (cached) return JSON.parse(cached);
    const products = await db.getProducts();
    await client.setEx('products', 3600, JSON.stringify(products));
    return products;
  };
  ```
- **Minification**: CSS/JS compressed via `next build`.
- **Rendering**: Use SSR and SSG in Next.js.
- **Monitoring**: Vercel Analytics or New Relic.

## Security
- HTTPS with Let’s Encrypt.
- Input validation (`express-validator` or `zod`).
  ```javascript
  const { body, validationResult } = require('express-validator');

  const validateProduct = [
    body('name').notEmpty().withMessage('Mahsulot nomi kiritilishi kerak'),
    body('price').isFloat({ min: 0 }).withMessage('Narx musbat bo‘lishi kerak'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
  ```
- Secure JWT with refresh tokens.
  ```javascript
  const jwt = require('jsonwebtoken');

  const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
  };
  ```

## SEO Optimization
- Meta tags via `next-seo`:
  ```jsx
  import { NextSeo } from 'next-seo';
  import { useTranslations } from 'next-intl';

  const ProductPage = ({ product }) => {
    const t = useTranslations('product');

    return (
      <>
        <NextSeo
          title={`${product.name} - TexnoGrand`}
          description={product.description.slice(0, 160)}
          canonical={`https://texnogrand.com/mahsulot/${product.slug}`}
          openGraph={{
            title: product.name,
            description: product.description.slice(0, 160),
            images: [{ url: product.image, width: 1080, height: 1440 }],
            url: `https://texnogrand.com/mahsulot/${product.slug}`,
          }}
          twitter={{
            cardType: 'summary_large_image',
          }}
        />
        {/* Product page content */}
      </>
    );
  };

  export default ProductPage;
  ```
- Dynamic `sitemap.xml` with `next-sitemap`:
  ```javascript
  // next-sitemap.config.js
  module.exports = {
    siteUrl: 'https://texnogrand.com',
    generateRobotsTxt: true,
    additionalSitemaps: ['https://texnogrand.com/sitemap.xml'],
  };
  ```
- Schema.org microdata for products.

## Testing
- Frontend: Unit tests with Jest.
  ```javascript
  import { render, screen } from '@testing-library/react';
  import ProductCard from './ProductCard';

  test('renders product name', () => {
    render(<ProductCard product={{ name: 'Test Mahsulot' }} />);
    expect(screen.getByText('Test Mahsulot')).toBeInTheDocument();
  });
  ```
- Backend: API tests with Supertest.
  ```javascript
  const request = require('supertest');
  const app = require('./app');

  test('GET /api/products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('products');
  });
  ```
- Compatibility: Test on Chrome, Firefox, Safari, mobile/desktop.

## Deployment
- Frontend: Vercel or Netlify.
- Backend: Render or Heroku.
- Database: Managed PostgreSQL (Supabase/Neon).

## Final Notes
- Ensure the design mirrors Uzum.uz’s functionality and structure but uses TexnoGrand’s unique colors and style.
- Guarantee 100% functionality for every feature, page, and component.
- Implement a language switcher for seamless Uzbek/Russian toggling with full localization.
- Make the project portable across environments using environment variables.
- Store code in a Git repository (e.g., GitHub) for version control.