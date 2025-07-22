import {
  users, categories, products, cartItems, favorites, orders, orderItems, reviews, banners,
  type User, type InsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type CartItem, type InsertCartItem,
  type Order, type InsertOrder, type Review, type InsertReview, type Banner
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: { categoryId?: number; search?: string; limit?: number; offset?: number }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewProducts(): Promise<Product[]>;
  getPopularProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;

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
  createOrder(order: InsertOrder, items: { productId: number; quantity: number; price: string }[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Reviews
  getProductReviews(productId: number): Promise<(Review & { user: Pick<User, 'firstName' | 'lastName'> })[]>;
  createReview(review: InsertReview): Promise<Review>;

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
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const electronics = { id: 1, nameUz: "Elektronika", nameRu: "Электроника", slug: "electronics", parentId: null, icon: "device", isActive: true };
    const clothing = { id: 2, nameUz: "Kiyim", nameRu: "Одежда", slug: "clothing", parentId: null, icon: "shirt", isActive: true };
    const home = { id: 3, nameUz: "Uy-joy", nameRu: "Дом", slug: "home", parentId: null, icon: "home", isActive: true };
    this.categories.set(1, electronics);
    this.categories.set(2, clothing);
    this.categories.set(3, home);

    // Seed products
    const products = [
      {
        id: 1,
        nameUz: "iPhone 14 Pro Max 128GB Deep Purple",
        nameRu: "iPhone 14 Pro Max 128GB Deep Purple",
        descriptionUz: "Eng so'ngi iPhone modeli",
        descriptionRu: "Новейшая модель iPhone",
        slug: "iphone-14-pro-max-128gb",
        price: "8999000",
        originalPrice: "11999000",
        discount: 25,
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        categoryId: 1,
        sellerId: 1,
        stock: 10,
        rating: "4.8",
        reviewCount: 42,
        isActive: true,
        isFeatured: true,
        fastDelivery: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        nameUz: "MacBook Pro 16\" M2 Max 512GB Space Gray",
        nameRu: "MacBook Pro 16\" M2 Max 512GB Space Gray",
        descriptionUz: "Professional laptop",
        descriptionRu: "Профессиональный ноутбук",
        slug: "macbook-pro-16-m2-max-512gb",
        price: "24999000",
        originalPrice: null,
        discount: 0,
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        categoryId: 1,
        sellerId: 1,
        stock: 5,
        rating: "4.9",
        reviewCount: 28,
        isActive: true,
        isFeatured: true,
        fastDelivery: false,
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
        descriptionUz: "50% gacha chegirma - cheklangan vaqt!",
        descriptionRu: "Скидки до 50% - ограниченное время!",
        image: "/api/placeholder/800/400",
        link: "/category/electronics",
        isActive: true,
        order: 1,
      },
      {
        id: 2,
        titleUz: "Yangi Smartfonlar",
        titleRu: "Новые Смартфоны",
        descriptionUz: "Eng so'ngi modellar - tez yetkazib berish",
        descriptionRu: "Новейшие модели - быстрая доставка",
        image: "/api/placeholder/800/400",
        link: "/category/smartphones",
        isActive: true,
        order: 2,
      },
    ];

    banners.forEach(banner => this.banners.set(banner.id, banner));
    this.currentId = 100;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "buyer",
      phone: insertUser.phone || null,
      isActive: true,
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
      isActive: true 
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Products
  async getProducts(filters: { categoryId?: number; search?: string; limit?: number; offset?: number } = {}): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);
    
    if (filters.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.nameUz.toLowerCase().includes(search) || 
        p.nameRu.toLowerCase().includes(search)
      );
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

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const newProduct: Product = {
      ...product,
      id,
      descriptionUz: product.descriptionUz || null,
      descriptionRu: product.descriptionRu || null,
      originalPrice: product.originalPrice || null,
      discount: product.discount || 0,
      images: Array.isArray(product.images) ? product.images as string[] : [],
      stock: product.stock || 0,
      rating: "0.0",
      reviewCount: 0,
      isActive: true,
      isFeatured: false,
      fastDelivery: product.fastDelivery || false,
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

  async createOrder(order: InsertOrder, items: { productId: number; quantity: number; price: string }[] = []): Promise<Order> {
    const id = this.currentId++;
    const newOrder: Order = {
      ...order,
      id,
      status: "pending",
      paymentMethod: order.paymentMethod || null,
      paymentStatus: "pending",
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
      createdAt: new Date(),
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  // Banners
  async getActiveBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values())
      .filter(banner => banner.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }
}

export const storage = new MemStorage();
