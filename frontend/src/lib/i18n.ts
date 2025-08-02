export type Locale = 'uz' | 'ru' | 'en';

export interface Translations {
  [key: string]: string;
}

const translations: Record<Locale, Translations> = {
  uz: {
    // Navigation
    'nav.home': 'Bosh sahifa',
    'nav.marketplace': 'Do\'kon',
    'nav.cart': 'Savat',
    'nav.profile': 'Profil',
    'nav.login': 'Kirish',
    'nav.register': 'Ro\'yxatdan o\'tish',
    
    // Common
    'common.search': 'Qidirish',
    'common.loading': 'Yuklanmoqda...',
    'common.error': 'Xatolik',
    'common.success': 'Muvaffaqiyatli',
    'common.cancel': 'Bekor qilish',
    'common.save': 'Saqlash',
    'common.edit': 'Tahrirlash',
    'common.delete': 'O\'chirish',
    'common.view': 'Ko\'rish',
    'common.add': 'Qo\'shish',
    
    // Products
    'product.addToCart': 'Savatga qo\'shish',
    'product.viewDetails': 'Batafsil',
    'product.price': 'Narxi',
    'product.originalPrice': 'Asl narxi',
    'product.discount': 'Chegirma',
    'product.inStock': 'Sotuvda',
    'product.outOfStock': 'Tugagan',
    'product.rating': 'Reyting',
    'product.reviews': 'Sharhlar',
    
    // Cart
    'cart.title': 'Savat',
    'cart.empty': 'Savat bo\'sh',
    'cart.subtotal': 'Jami',
    'cart.total': 'Umumiy',
    'cart.checkout': 'Buyurtma berish',
    'cart.remove': 'O\'chirish',
    'cart.update': 'Yangilash',
    'cart.clear': 'Tozalash',
    
    // Checkout
    'checkout.title': 'Buyurtma berish',
    'checkout.shipping': 'Yetkazib berish',
    'checkout.payment': 'To\'lov',
    'checkout.confirmation': 'Tasdiqlash',
    'checkout.orderSummary': 'Buyurtma xulosasi',
    'checkout.placeOrder': 'Buyurtmani joylashtirish',
    
    // Profile
    'profile.title': 'Shaxsiy kabinet',
    'profile.personalInfo': 'Shaxsiy ma\'lumotlar',
    'profile.orders': 'Buyurtmalar',
    'profile.wishlist': 'Sevimlilar',
    'profile.settings': 'Sozlamalar',
    'profile.logout': 'Chiqish',
    
    // Auth
    'auth.login': 'Tizimga kirish',
    'auth.register': 'Ro\'yxatdan o\'tish',
    'auth.email': 'Email',
    'auth.password': 'Parol',
    'auth.confirmPassword': 'Parolni tasdiqlang',
    'auth.forgotPassword': 'Parolni unutdingizmi?',
    'auth.resetPassword': 'Parolni tiklash',
    
    // Payment
    'payment.title': 'To\'lov',
    'payment.methods': 'To\'lov usullari',
    'payment.click': 'Click',
    'payment.uzcard': 'UzCard',
    'payment.humo': 'Humo',
    'payment.cardNumber': 'Karta raqami',
    'payment.expiry': 'Amal qilish muddati',
    'payment.cvc': 'CVC',
    'payment.pay': 'To\'lov qilish',
    
    // Messages
    'message.productAdded': 'Mahsulot savatga qo\'shildi',
    'message.orderPlaced': 'Buyurtma muvaffaqiyatli joylashtirildi',
    'message.paymentSuccess': 'To\'lov muvaffaqiyatli amalga oshirildi',
    'message.profileUpdated': 'Profil yangilandi',
    'message.loginSuccess': 'Tizimga muvaffaqiyatli kirdingiz',
    'message.logoutSuccess': 'Tizimdan chiqdingiz',
    
    // Errors
    'error.invalidEmail': 'Noto\'g\'ri email',
    'error.invalidPassword': 'Noto\'g\'ri parol',
    'error.passwordsNotMatch': 'Parollar mos kelmaydi',
    'error.productNotFound': 'Mahsulot topilmadi',
    'error.cartEmpty': 'Savat bo\'sh',
    'error.paymentFailed': 'To\'lov amalga oshirilmadi',
    'error.networkError': 'Tarmoq xatosi',
    'error.serverError': 'Server xatosi'
  },
  
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.marketplace': 'Магазин',
    'nav.cart': 'Корзина',
    'nav.profile': 'Профиль',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    
    // Common
    'common.search': 'Поиск',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.edit': 'Редактировать',
    'common.delete': 'Удалить',
    'common.view': 'Просмотр',
    'common.add': 'Добавить',
    
    // Products
    'product.addToCart': 'Добавить в корзину',
    'product.viewDetails': 'Подробнее',
    'product.price': 'Цена',
    'product.originalPrice': 'Исходная цена',
    'product.discount': 'Скидка',
    'product.inStock': 'В наличии',
    'product.outOfStock': 'Нет в наличии',
    'product.rating': 'Рейтинг',
    'product.reviews': 'Отзывы',
    
    // Cart
    'cart.title': 'Корзина',
    'cart.empty': 'Корзина пуста',
    'cart.subtotal': 'Подытог',
    'cart.total': 'Итого',
    'cart.checkout': 'Оформить заказ',
    'cart.remove': 'Удалить',
    'cart.update': 'Обновить',
    'cart.clear': 'Очистить',
    
    // Checkout
    'checkout.title': 'Оформление заказа',
    'checkout.shipping': 'Доставка',
    'checkout.payment': 'Оплата',
    'checkout.confirmation': 'Подтверждение',
    'checkout.orderSummary': 'Сводка заказа',
    'checkout.placeOrder': 'Разместить заказ',
    
    // Profile
    'profile.title': 'Личный кабинет',
    'profile.personalInfo': 'Личная информация',
    'profile.orders': 'Заказы',
    'profile.wishlist': 'Избранное',
    'profile.settings': 'Настройки',
    'profile.logout': 'Выйти',
    
    // Auth
    'auth.login': 'Вход в систему',
    'auth.register': 'Регистрация',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Подтвердите пароль',
    'auth.forgotPassword': 'Забыли пароль?',
    'auth.resetPassword': 'Сброс пароля',
    
    // Payment
    'payment.title': 'Оплата',
    'payment.methods': 'Способы оплаты',
    'payment.click': 'Click',
    'payment.uzcard': 'UzCard',
    'payment.humo': 'Humo',
    'payment.cardNumber': 'Номер карты',
    'payment.expiry': 'Срок действия',
    'payment.cvc': 'CVC',
    'payment.pay': 'Оплатить',
    
    // Messages
    'message.productAdded': 'Товар добавлен в корзину',
    'message.orderPlaced': 'Заказ успешно размещен',
    'message.paymentSuccess': 'Оплата прошла успешно',
    'message.profileUpdated': 'Профиль обновлен',
    'message.loginSuccess': 'Успешный вход в систему',
    'message.logoutSuccess': 'Вы вышли из системы',
    
    // Errors
    'error.invalidEmail': 'Неверный email',
    'error.invalidPassword': 'Неверный пароль',
    'error.passwordsNotMatch': 'Пароли не совпадают',
    'error.productNotFound': 'Товар не найден',
    'error.cartEmpty': 'Корзина пуста',
    'error.paymentFailed': 'Оплата не прошла',
    'error.networkError': 'Ошибка сети',
    'error.serverError': 'Ошибка сервера'
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.marketplace': 'Marketplace',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Common
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.add': 'Add',
    
    // Products
    'product.addToCart': 'Add to Cart',
    'product.viewDetails': 'View Details',
    'product.price': 'Price',
    'product.originalPrice': 'Original Price',
    'product.discount': 'Discount',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.rating': 'Rating',
    'product.reviews': 'Reviews',
    
    // Cart
    'cart.title': 'Cart',
    'cart.empty': 'Cart is empty',
    'cart.subtotal': 'Subtotal',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.update': 'Update',
    'cart.clear': 'Clear',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shipping': 'Shipping',
    'checkout.payment': 'Payment',
    'checkout.confirmation': 'Confirmation',
    'checkout.orderSummary': 'Order Summary',
    'checkout.placeOrder': 'Place Order',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.orders': 'Orders',
    'profile.wishlist': 'Wishlist',
    'profile.settings': 'Settings',
    'profile.logout': 'Logout',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    
    // Payment
    'payment.title': 'Payment',
    'payment.methods': 'Payment Methods',
    'payment.click': 'Click',
    'payment.uzcard': 'UzCard',
    'payment.humo': 'Humo',
    'payment.cardNumber': 'Card Number',
    'payment.expiry': 'Expiry Date',
    'payment.cvc': 'CVC',
    'payment.pay': 'Pay',
    
    // Messages
    'message.productAdded': 'Product added to cart',
    'message.orderPlaced': 'Order placed successfully',
    'message.paymentSuccess': 'Payment successful',
    'message.profileUpdated': 'Profile updated',
    'message.loginSuccess': 'Login successful',
    'message.logoutSuccess': 'Logout successful',
    
    // Errors
    'error.invalidEmail': 'Invalid email',
    'error.invalidPassword': 'Invalid password',
    'error.passwordsNotMatch': 'Passwords do not match',
    'error.productNotFound': 'Product not found',
    'error.cartEmpty': 'Cart is empty',
    'error.paymentFailed': 'Payment failed',
    'error.networkError': 'Network error',
    'error.serverError': 'Server error'
  }
};

class I18nService {
  private locale: Locale = 'uz';
  private fallbackLocale: Locale = 'uz';

  constructor() {
    // Get locale from localStorage or browser
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && translations[savedLocale]) {
      this.locale = savedLocale;
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ru') {
        this.locale = 'ru';
      } else if (browserLang === 'en') {
        this.locale = 'en';
      } else {
        this.locale = 'uz';
      }
    }
  }

  // Get translation
  t(key: string, params?: Record<string, string>): string {
    const translation = translations[this.locale]?.[key] || 
                       translations[this.fallbackLocale]?.[key] || 
                       key;

    if (params) {
      return Object.entries(params).reduce((str, [param, value]) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), value);
      }, translation);
    }

    return translation;
  }

  // Set locale
  setLocale(locale: Locale): void {
    if (translations[locale]) {
      this.locale = locale;
      localStorage.setItem('locale', locale);
      
      // Update document language
      document.documentElement.lang = locale;
      
      // Dispatch custom event for components to react
      window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }));
    }
  }

  // Get current locale
  getLocale(): Locale {
    return this.locale;
  }

  // Get available locales
  getAvailableLocales(): Locale[] {
    return Object.keys(translations) as Locale[];
  }

  // Get locale name
  getLocaleName(locale: Locale): string {
    const names = {
      uz: 'O\'zbekcha',
      ru: 'Русский',
      en: 'English'
    };
    return names[locale] || locale;
  }

  // Get locale flag
  getLocaleFlag(locale: Locale): string {
    const flags = {
      uz: '🇺🇿',
      ru: '🇷🇺',
      en: '🇺🇸'
    };
    return flags[locale] || '🌐';
  }
}

// Create singleton instance
const i18n = new I18nService();

export default i18n;
export { I18nService }; 