import {
  users, categories, products, cartItems, favorites, orders, orderItems, reviews, banners,
  affiliateLinks, affiliateCampaigns, affiliateTransactions, payments, withdrawals,
  marketingCampaigns, analytics, productRecommendations,
  type User, type InsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type CartItem, type InsertCartItem,
  type Order, type InsertOrder, type Review, type InsertReview, type Banner,
  type AffiliateLink, type InsertAffiliateLink, type AffiliateCampaign, type InsertAffiliateCampaign,
  type AffiliateTransaction, type Payment, type Withdrawal, type MarketingCampaign, type Analytics
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  verifyUser(id: number): Promise<User | undefined>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: { 
    categoryId?: number; 
    search?: string; 
    limit?: number; 
    offset?: number;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewProducts(): Promise<Product[]>;
  getPopularProducts(): Promise<Product[]>;
  getRecommendedProducts(userId: number): Promise<Product[]>;
  getMerchantProducts(merchantId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Cart
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Favorites
  getFavorites(userId: number): Promise<(typeof favorites.$inferSelect & { product: Product })[]>;
  addToFavorites(userId: number, productId: number): Promise<boolean>;
  removeFromFavorites(userId: number, productId: number): Promise<boolean>;

  // Orders
  getOrders(userId: number): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getMerchantOrders(merchantId: number): Promise<Order[]>;
  createOrder(order: InsertOrder, items: { productId: number; quantity: number; price: string }[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Reviews
  getProductReviews(productId: number): Promise<(Review & { user: Pick<User, 'firstName' | 'lastName'> })[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Affiliate Marketing
  getAffiliateLinks(bloggerId: number): Promise<AffiliateLink[]>;
  createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink>;
  getAffiliateAnalytics(bloggerId: number): Promise<any>;
  getAffiliateEarnings(bloggerId: number): Promise<any>;
  createAffiliateTransaction(transaction: Partial<AffiliateTransaction>): Promise<AffiliateTransaction>;

  // Merchant Dashboard
  getMerchantAnalytics(merchantId: number): Promise<any>;

  // Admin
  getAdminAnalytics(): Promise<any>;

  // Payments & Withdrawals
  createPayment(payment: Partial<Payment>): Promise<Payment>;
  createWithdrawal(withdrawal: Partial<Withdrawal>): Promise<Withdrawal>;
  getUserWithdrawals(userId: number): Promise<Withdrawal[]>;

  // Analytics
  trackAnalytics(data: Partial<Analytics>): Promise<Analytics>;

  // Banners
  getActiveBanners(): Promise<Banner[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private favorites: Map<number, typeof favorites.$inferSelect>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, typeof orderItems.$inferSelect>;
  private reviews: Map<number, Review>;
  private banners: Map<number, Banner>;
  private affiliateLinks: Map<number, AffiliateLink>;
  private affiliateCampaigns: Map<number, AffiliateCampaign>;
  private affiliateTransactions: Map<number, AffiliateTransaction>;
  private payments: Map<number, Payment>;
  private withdrawals: Map<number, Withdrawal>;
  private marketingCampaigns: Map<number, MarketingCampaign>;
  private analytics: Map<number, Analytics>;
  private productRecommendations: Map<number, typeof productRecommendations.$inferSelect>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.favorites = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    this.banners = new Map();
    this.affiliateLinks = new Map();
    this.affiliateCampaigns = new Map();
    this.affiliateTransactions = new Map();
    this.payments = new Map();
    this.withdrawals = new Map();
    this.marketingCampaigns = new Map();
    this.analytics = new Map();
    this.productRecommendations = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const electronics = { 
      id: 1, 
      nameUz: "Elektronika", 
      nameRu: "Электроника", 
      nameEn: "Electronics",
      slug: "electronics", 
      parentId: null, 
      icon: "device", 
      image: null,
      descriptionUz: null,
      descriptionRu: null,
      descriptionEn: null,
      isActive: true,
      order: 1
    };
    const clothing = { 
      id: 2, 
      nameUz: "Kiyim", 
      nameRu: "Одежда", 
      nameEn: "Clothing",
      slug: "clothing", 
      parentId: null, 
      icon: "shirt", 
      image: null,
      descriptionUz: null,
      descriptionRu: null,
      descriptionEn: null,
      isActive: true,
      order: 2
    };
    const home = { 
      id: 3, 
      nameUz: "Uy-joy", 
      nameRu: "Дом", 
      nameEn: "Home",
      slug: "home", 
      parentId: null, 
      icon: "home", 
      image: null,
      descriptionUz: null,
      descriptionRu: null,
      descriptionEn: null,
      isActive: true,
      order: 3
    };
    this.categories.set(1, electronics);
    this.categories.set(2, clothing);
    this.categories.set(3, home);

    // Seed users
    const adminUser: User = {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      password: "$2b$10$hashedpassword",
      firstName: "Admin",
      lastName: "User",
      phone: "+998901234567",
      role: "admin",
      isActive: true,
      isVerified: true,
      avatar: null,
      balance: "0.00",
      totalEarnings: "0.00",
      referralCode: "ADMIN123",
      referredBy: null,
      createdAt: new Date(),
    };
    this.users.set(1, adminUser);

    // Seed products
    const products = [
      {
        id: 1,
        nameUz: "iPhone 14 Pro Max 128GB Deep Purple",
        nameRu: "iPhone 14 Pro Max 128GB Deep Purple",
        nameEn: "iPhone 14 Pro Max 128GB Deep Purple",
        descriptionUz: "Eng so'ngi iPhone modeli",
        descriptionRu: "Новейшая модель iPhone",
        descriptionEn: "Latest iPhone model",
        slug: "iphone-14-pro-max-128gb",
        price: "8999000",
        originalPrice: "11999000",
        discount: 25,
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        videos: [],
        categoryId: 1,
        merchantId: 1,
        stock: 10,
        rating: "4.8",
        reviewCount: 42,
        isActive: true,
        isFeatured: true,
        isBoosted: false,
        fastDelivery: true,
        weight: "200.00",
        dimensions: { length: 160, width: 78, height: 7.9 },
        tags: ["smartphone", "apple", "premium"],
        seoTitle: "iPhone 14 Pro Max - Premium Smartphone",
        seoDescription: "Eng so'ngi iPhone modeli - yuqori sifat va innovatsion funksiyalar",
        createdAt: new Date(),
      },
      {
        id: 2,
        nameUz: "MacBook Pro 16\" M2 Max 512GB Space Gray",
        nameRu: "MacBook Pro 16\" M2 Max 512GB Space Gray",
        nameEn: "MacBook Pro 16\" M2 Max 512GB Space Gray",
        descriptionUz: "Professional laptop",
        descriptionRu: "Профессиональный ноутбук",
        descriptionEn: "Professional laptop",
        slug: "macbook-pro-16-m2-max-512gb",
        price: "24999000",
        originalPrice: null,
        discount: 0,
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        videos: [],
        categoryId: 1,
        merchantId: 1,
        stock: 5,
        rating: "4.9",
        reviewCount: 28,
        isActive: true,
        isFeatured: true,
        isBoosted: false,
        fastDelivery: false,
        weight: "2200.00",
        dimensions: { length: 355, width: 248, height: 16.8 },
        tags: ["laptop", "macbook", "professional"],
        seoTitle: "MacBook Pro 16\" M2 Max - Professional Laptop",
        seoDescription: "Professional laptop for creative professionals and developers",
        createdAt: new Date(),
      },
    ];

    products.forEach(product => this.products.set(product.id, product));

    // Seed banners
    const banners = [
      {
        id: 1,
        titleUz: "Premium Elektronika",
        titleRu: "Премиум Электроника",
        titleEn: "Premium Electronics",
        descriptionUz: "50% gacha chegirma - cheklangan vaqt!",
        descriptionRu: "Скидки до 50% - ограниченное время!",
        descriptionEn: "Up to 50% discount - limited time!",
        image: "/api/placeholder/800/400",
        link: "/category/electronics",
        isActive: true,
        order: 1,
        startDate: null,
        endDate: null,
      },
      {
        id: 2,
        titleUz: "Yangi Smartfonlar",
        titleRu: "Новые Смартфоны",
        titleEn: "New Smartphones",
        descriptionUz: "Eng so'ngi modellar - tez yetkazib berish",
        descriptionRu: "Новейшие модели - быстрая доставка",
        descriptionEn: "Latest models - fast delivery",
        image: "/api/placeholder/800/400",
        link: "/category/smartphones",
        isActive: true,
        order: 2,
        startDate: null,
        endDate: null,
      },
    ];

    banners.forEach(banner => this.banners.set(banner.id, banner));
    this.currentId = 100;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "customer",
      phone: insertUser.phone || null,
      isActive: true,
      isVerified: false,
      avatar: null,
      balance: "0.00",
      totalEarnings: "0.00",
      referralCode: insertUser.referralCode || null,
      referredBy: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async verifyUser(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.isVerified = true;
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentId++;
    const newCategory: Category = { 
      ...category, 
      id, 
      parentId: category.parentId || null,
      icon: category.icon || null,
      image: category.image || null,
      descriptionUz: category.descriptionUz || null,
      descriptionRu: category.descriptionRu || null,
      descriptionEn: category.descriptionEn || null,
      isActive: true,
      order: category.order || 0
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Products
  async getProducts(filters: { 
    categoryId?: number; 
    search?: string; 
    limit?: number; 
    offset?: number;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  } = {}): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);
    
    if (filters.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.nameUz.toLowerCase().includes(search) || 
        p.nameRu.toLowerCase().includes(search) ||
        p.nameEn.toLowerCase().includes(search)
      );
    }

    if (filters.minPrice) {
      products = products.filter(p => parseFloat(p.price) >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      products = products.filter(p => parseFloat(p.price) <= filters.maxPrice!);
    }

    if (filters.tags && filters.tags.length > 0) {
      products = products.filter(p => 
        p.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc':
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price_desc':
          products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'rating':
          products.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
          break;
        case 'newest':
          products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
      }
    }
    
    if (filters.offset) {
      products = products.slice(filters.offset);
    }
    
    if (filters.limit) {
      products = products.slice(0, filters.limit);
    }
    
    return products;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isFeatured && p.isActive);
  }

  async getNewProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => p.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }

  async getPopularProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => p.isActive)
      .sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"))
      .slice(0, 10);
  }

  async getRecommendedProducts(userId: number): Promise<Product[]> {
    // Simple recommendation algorithm based on user preferences
    const userFavorites = Array.from(this.favorites.values()).filter(f => f.userId === userId);
    const favoriteCategories = userFavorites.map(f => {
      const product = this.products.get(f.productId);
      return product?.categoryId;
    }).filter(Boolean);

    if (favoriteCategories.length === 0) {
      return this.getPopularProducts();
    }

    const categoryCounts = favoriteCategories.reduce((acc, catId) => {
      acc[catId!] = (acc[catId!] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const preferredCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0][0];

    return Array.from(this.products.values())
      .filter(p => p.isActive && p.categoryId === parseInt(preferredCategory))
      .slice(0, 10);
  }

  async getMerchantProducts(merchantId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.merchantId === merchantId);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const newProduct: Product = {
      ...product,
      id,
      descriptionUz: product.descriptionUz || null,
      descriptionRu: product.descriptionRu || null,
      descriptionEn: product.descriptionEn || null,
      originalPrice: product.originalPrice || null,
      discount: product.discount || 0,
      images: Array.isArray(product.images) ? product.images as string[] : [],
      videos: Array.isArray(product.videos) ? product.videos as string[] : [],
      stock: product.stock || 0,
      rating: "0.0",
      reviewCount: 0,
      isActive: true,
      isFeatured: false,
      isBoosted: false,
      fastDelivery: product.fastDelivery || false,
      weight: product.weight || null,
      dimensions: product.dimensions || null,
      tags: Array.isArray(product.tags) ? product.tags as string[] : [],
      seoTitle: product.seoTitle || null,
      seoDescription: product.seoDescription || null,
      createdAt: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updated = { ...product, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Cart
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    })).filter(item => item.product);
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const existing = Array.from(this.cartItems.values()).find(
      item => item.userId === cartItem.userId && item.productId === cartItem.productId
    );
    
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (cartItem.quantity || 1);
      this.cartItems.set(existing.id, existing);
      return existing;
    }
    
    const id = this.currentId++;
    const newItem: CartItem = {
      ...cartItem,
      id,
      quantity: cartItem.quantity || 1,
      createdAt: new Date(),
    };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const items = Array.from(this.cartItems.entries()).filter(([_, item]) => item.userId === userId);
    items.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  // Favorites
  async getFavorites(userId: number): Promise<(typeof favorites.$inferSelect & { product: Product })[]> {
    const favs = Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
    return favs.map(fav => ({
      ...fav,
      product: this.products.get(fav.productId)!
    })).filter(fav => fav.product);
  }

  async addToFavorites(userId: number, productId: number): Promise<boolean> {
    const existing = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.productId === productId
    );
    if (existing) return true;
    
    const id = this.currentId++;
    this.favorites.set(id, {
      id,
      userId,
      productId,
      createdAt: new Date(),
    });
    return true;
  }

  async removeFromFavorites(userId: number, productId: number): Promise<boolean> {
    const fav = Array.from(this.favorites.entries()).find(
      ([_, item]) => item.userId === userId && item.productId === productId
    );
    if (fav) {
      this.favorites.delete(fav[0]);
      return true;
    }
    return false;
  }

  // Orders
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getMerchantOrders(merchantId: number): Promise<Order[]> {
    // This would need to be implemented with proper joins in a real database
    return Array.from(this.orders.values()).filter(order => {
      const orderItems = Array.from(this.orderItems.values()).filter(item => item.orderId === order.id);
      return orderItems.some(item => {
        const product = this.products.get(item.productId);
        return product?.merchantId === merchantId;
      });
    });
  }

  async createOrder(order: InsertOrder, items: { productId: number; quantity: number; price: string }[] = []): Promise<Order> {
    const id = this.currentId++;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newOrder: Order = {
      ...order,
      id,
      orderNumber,
      status: "pending",
      paymentMethod: order.paymentMethod || null,
      paymentStatus: "pending",
      subtotal: order.subtotal || order.totalAmount,
      tax: order.tax || "0.00",
      shipping: order.shipping || "0.00",
      discount: order.discount || "0.00",
      trackingNumber: null,
      estimatedDelivery: null,
      affiliateCode: order.affiliateCode || null,
      notes: order.notes || null,
      createdAt: new Date(),
    };
    this.orders.set(id, newOrder);
    
    // Add order items
    items.forEach(item => {
      const itemId = this.currentId++;
      this.orderItems.set(itemId, {
        id: itemId,
        orderId: id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        commission: "0.00",
      });
    });
    
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    order.status = status as any;
    this.orders.set(id, order);
    return order;
  }

  // Reviews
  async getProductReviews(productId: number): Promise<(Review & { user: Pick<User, 'firstName' | 'lastName'> })[]> {
    const reviews = Array.from(this.reviews.values()).filter(review => review.productId === productId);
    return reviews.map(review => ({
      ...review,
      user: {
        firstName: this.users.get(review.userId)?.firstName || "User",
        lastName: this.users.get(review.userId)?.lastName || "",
      }
    }));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const newReview: Review = {
      ...review,
      id,
      comment: review.comment || null,
      images: review.images || [],
      isVerified: false,
      createdAt: new Date(),
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  // Affiliate Marketing
  async getAffiliateLinks(bloggerId: number): Promise<AffiliateLink[]> {
    return Array.from(this.affiliateLinks.values()).filter(link => link.bloggerId === bloggerId);
  }

  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const id = this.currentId++;
    const newLink: AffiliateLink = {
      ...link,
      id,
      clicks: 0,
      conversions: 0,
      earnings: "0.00",
      isActive: true,
      createdAt: new Date(),
    };
    this.affiliateLinks.set(id, newLink);
    return newLink;
  }

  async getAffiliateAnalytics(bloggerId: number): Promise<any> {
    const links = Array.from(this.affiliateLinks.values()).filter(link => link.bloggerId === bloggerId);
    const transactions = Array.from(this.affiliateTransactions.values()).filter(t => t.bloggerId === bloggerId);
    
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const totalConversions = links.reduce((sum, link) => sum + link.conversions, 0);
    const totalEarnings = links.reduce((sum, link) => sum + parseFloat(link.earnings), 0);
    
    return {
      totalLinks: links.length,
      totalClicks,
      totalConversions,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : "0.00",
      totalEarnings: totalEarnings.toFixed(2),
      recentTransactions: transactions.slice(-10),
    };
  }

  async getAffiliateEarnings(bloggerId: number): Promise<any> {
    const transactions = Array.from(this.affiliateTransactions.values()).filter(t => t.bloggerId === bloggerId);
    
    const monthlyEarnings = transactions.reduce((acc, t) => {
      const month = t.createdAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + parseFloat(t.commission);
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalEarnings: transactions.reduce((sum, t) => sum + parseFloat(t.commission), 0).toFixed(2),
      monthlyEarnings,
      pendingAmount: transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + parseFloat(t.commission), 0)
        .toFixed(2),
    };
  }

  async createAffiliateTransaction(transaction: Partial<AffiliateTransaction>): Promise<AffiliateTransaction> {
    const id = this.currentId++;
    const newTransaction: AffiliateTransaction = {
      ...transaction,
      id,
      commission: transaction.commission || "0.00",
      status: "pending",
      createdAt: new Date(),
    } as AffiliateTransaction;
    this.affiliateTransactions.set(id, newTransaction);
    return newTransaction;
  }

  // Merchant Dashboard
  async getMerchantAnalytics(merchantId: number): Promise<any> {
    const merchantProducts = Array.from(this.products.values()).filter(p => p.merchantId === merchantId);
    const merchantOrders = await this.getMerchantOrders(merchantId);
    
    const totalRevenue = merchantOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    const totalProducts = merchantProducts.length;
    const activeProducts = merchantProducts.filter(p => p.isActive).length;
    
    return {
      totalRevenue: totalRevenue.toFixed(2),
      totalProducts,
      activeProducts,
      totalOrders: merchantOrders.length,
      averageOrderValue: merchantOrders.length > 0 ? (totalRevenue / merchantOrders.length).toFixed(2) : "0.00",
    };
  }

  // Admin
  async getAdminAnalytics(): Promise<any> {
    const totalUsers = this.users.size;
    const totalProducts = this.products.size;
    const totalOrders = this.orders.size;
    const totalRevenue = Array.from(this.orders.values()).reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    
    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      activeUsers: Array.from(this.users.values()).filter(u => u.isActive).length,
      verifiedUsers: Array.from(this.users.values()).filter(u => u.isVerified).length,
    };
  }

  // Payments & Withdrawals
  async createPayment(payment: Partial<Payment>): Promise<Payment> {
    const id = this.currentId++;
    const newPayment: Payment = {
      ...payment,
      id,
      status: "pending",
      transactionId: payment.transactionId || null,
      gatewayResponse: payment.gatewayResponse || null,
      createdAt: new Date(),
    } as Payment;
    this.payments.set(id, newPayment);
    return newPayment;
  }

  async createWithdrawal(withdrawal: Partial<Withdrawal>): Promise<Withdrawal> {
    const id = this.currentId++;
    const newWithdrawal: Withdrawal = {
      ...withdrawal,
      id,
      status: "pending",
      accountDetails: withdrawal.accountDetails || null,
      createdAt: new Date(),
    } as Withdrawal;
    this.withdrawals.set(id, newWithdrawal);
    return newWithdrawal;
  }

  async getUserWithdrawals(userId: number): Promise<Withdrawal[]> {
    return Array.from(this.withdrawals.values()).filter(w => w.userId === userId);
  }

  // Analytics
  async trackAnalytics(data: Partial<Analytics>): Promise<Analytics> {
    const id = this.currentId++;
    const newAnalytics: Analytics = {
      ...data,
      id,
      createdAt: new Date(),
    } as Analytics;
    this.analytics.set(id, newAnalytics);
    return newAnalytics;
  }

  // Banners
  async getActiveBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values())
      .filter(banner => banner.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }
}

export const storage = new MemStorage();
