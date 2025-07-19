// O'zbek tili uchun UI tekstlari va formatlar
export const uzbekLocale = {
  // Umumiy
  loading: "Yuklanmoqda...",
  error: "Xatolik yuz berdi",
  success: "Muvaffaqiyatli",
  cancel: "Bekor qilish",
  save: "Saqlash",
  delete: "O'chirish",
  edit: "Tahrirlash",
  add: "Qo'shish",
  search: "Qidirish",
  filter: "Filtr",
  sort: "Saralash",
  
  // Navigation
  home: "Bosh sahifa",
  marketplace: "Bozor",
  cart: "Savat",
  orders: "Buyurtmalar",
  profile: "Profil",
  login: "Kirish",
  register: "Ro'yxatdan o'tish",
  logout: "Chiqish",
  
  // Seller
  sellerDashboard: "Sotuvchi Kabineti",
  addProduct: "Mahsulot Qo'shish",
  myProducts: "Mening Mahsulotlarim",
  sales: "Sotuvlar",
  analytics: "Tahlillar",
  inventory: "Ombor",
  
  // Affiliate
  affiliateDashboard: "Bloger Kabineti",
  myLinks: "Mening Linklarim",
  earnings: "Daromad",
  clicks: "Kliklar",
  conversions: "Sotuvlar",
  commission: "Komissiya",
  
  // Admin
  adminDashboard: "Admin Panel",
  users: "Foydalanuvchilar",
  products: "Mahsulotlar",
  reports: "Hisobotlar",
  settings: "Sozlamalar",
  
  // Product
  price: "Narx",
  discount: "Chegirma",
  stock: "Qoldiq",
  category: "Kategoriya",
  description: "Tavsif",
  specifications: "Xususiyatlari",
  images: "Rasmlar",
  
  // Order
  orderNumber: "Buyurtma raqami",
  orderDate: "Buyurtma sanasi",
  orderStatus: "Holati",
  orderTotal: "Jami summa",
  shipping: "Yetkazish",
  payment: "To'lov",
  
  // Payment
  paymentMethod: "To'lov usuli",
  paymentStatus: "To'lov holati",
  clickPay: "Click orqali to'lash",
  paymePay: "Payme orqali to'lash",
  cashOnDelivery: "Yetkazishda to'lash",
  
  // Status
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlangan",
  shipped: "Yuborilgan",
  delivered: "Yetkazilgan",
  cancelled: "Bekor qilingan",
  paid: "To'langan",
  unpaid: "To'lanmagan",
  
  // Time
  today: "Bugun",
  yesterday: "Kecha",
  thisWeek: "Shu hafta",
  thisMonth: "Shu oy",
  lastMonth: "O'tgan oy",
  
  // Currency
  currency: "so'm",
  
  // Messages
  welcomeMessage: "Xush kelibsiz!",
  noData: "Ma'lumot mavjud emas",
  dataLoaded: "Ma'lumotlar yuklandi",
  actionCompleted: "Amal bajarildi",
  
  // Errors
  networkError: "Internet aloqasi xatosi",
  serverError: "Server xatosi",
  validationError: "Ma'lumotlar noto'g'ri",
  notFound: "Topilmadi",
  unauthorized: "Ruxsat berilmagan",
  
  // Form validation
  required: "Majburiy maydon",
  emailInvalid: "Email noto'g'ri",
  passwordTooShort: "Parol juda qisqa",
  phoneInvalid: "Telefon raqami noto'g'ri",
  
  // Seller onboarding
  sellerOnboarding: {
    title: "Sotuvchi Bo'ling",
    subtitle: "O'zbekiston eng yirik bozorida sotish boshlang",
    benefits: [
      "Millionlab xaridorlarga yetkazish",
      "Professional sotuvchi kabineti", 
      "Real vaqtda hisobotlar",
      "24/7 yordam xizmati",
      "Tez to'lovlar"
    ],
    steps: [
      "Ro'yxatdan o'ting",
      "Ma'lumotlaringizni to'ldiring", 
      "Mahsulotlar qo'shing",
      "Sotishni boshlang"
    ]
  },
  
  // Affiliate onboarding
  affiliateOnboarding: {
    title: "Bloger Bo'ling",
    subtitle: "20% gacha komissiya bilan daromad qiling",
    benefits: [
      "20% gacha yuqori komissiya",
      "Har mahsulot uchun unique link",
      "Real vaqtda tracking",
      "Marketing materiallari",
      "Tezkor to'lovlar"
    ],
    features: [
      "Click va sotuvlar tahlili",
      "Professional bannerlar",
      "SMS va email xabarnomalar",
      "Mobil ilova"
    ]
  }
};

// Raqamlarni formatlash
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(num);
};

// Pul formatini formatlash  
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${formatNumber(num)} ${uzbekLocale.currency}`;
};

// Sana formatini formatlash
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('uz-UZ');
};

// Foizni formatlash
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};