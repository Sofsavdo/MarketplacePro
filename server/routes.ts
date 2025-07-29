import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertCartItemSchema, 
  insertOrderSchema, 
  insertReviewSchema,
  insertAffiliateLinkSchema,
  insertAffiliateCampaignSchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const JWT_SECRET = process.env.JWT_SECRET || "texnogrand_secret_key_2024";

// Extend Express Request interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Middleware to verify JWT token
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const authorizeRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Generate referral code
      const referralCode = nanoid(8);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        referralCode,
      });
      
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  // User profile management
  app.get("/api/profile", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUserById(req.user!.id);
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { firstName, lastName, phone, avatar } = req.body;
      const user = await storage.updateUser(req.user!.id, { firstName, lastName, phone, avatar });
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, search, limit, offset, sort, minPrice, maxPrice, tags } = req.query;
      const filters = {
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        sort: sort as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        tags: tags ? (tags as string).split(',') : undefined,
      };
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/popular", async (req, res) => {
    try {
      const products = await storage.getPopularProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular products" });
    }
  });

  app.get("/api/products/new", async (req, res) => {
    try {
      const products = await storage.getNewProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new products" });
    }
  });

  app.get("/api/products/recommended", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const products = await storage.getRecommendedProducts(req.user!.id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommended products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", authenticateToken, authorizeRole(['merchant', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct({
        ...productData,
        merchantId: req.user!.id,
      });
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", authenticateToken, authorizeRole(['merchant', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const product = await storage.updateProduct(parseInt(req.params.id), req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", authenticateToken, authorizeRole(['merchant', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const success = await storage.deleteProduct(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete product" });
    }
  });

  // Cart
  app.get("/api/cart", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const cartItems = await storage.getCartItems(req.user!.id);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const cartData = insertCartItemSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const cartItem = await storage.addToCart(cartData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(parseInt(req.params.id), quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const success = await storage.removeFromCart(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(400).json({ message: "Failed to remove cart item" });
    }
  });

  // Favorites
  app.get("/api/favorites", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const favorites = await storage.getFavorites(req.user!.id);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { productId } = req.body;
      const success = await storage.addToFavorites(req.user!.id, productId);
      res.json({ success });
    } catch (error) {
      res.status(400).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete("/api/favorites/:productId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const success = await storage.removeFromFavorites(req.user!.id, parseInt(req.params.productId));
      res.json({ success });
    } catch (error) {
      res.status(400).json({ message: "Failed to remove from favorites" });
    }
  });

  // Orders
  app.get("/api/orders", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await storage.getOrders(req.user!.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const order = await storage.getOrderById(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { items, ...orderData } = req.body;
      const order = await storage.createOrder({
        ...orderData,
        userId: req.user!.id,
      }, items);
      
      // Clear cart after order creation
      await storage.clearCart(req.user!.id);
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  // Reviews
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(parseInt(req.params.productId));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  // Affiliate Marketing Routes
  app.get("/api/affiliate/links", authenticateToken, authorizeRole(['blogger']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const links = await storage.getAffiliateLinks(req.user!.id);
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate links" });
    }
  });

  app.post("/api/affiliate/links", authenticateToken, authorizeRole(['blogger']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const linkData = insertAffiliateLinkSchema.parse({
        ...req.body,
        bloggerId: req.user!.id,
        uniqueCode: nanoid(10),
      });
      const link = await storage.createAffiliateLink(linkData);
      res.json(link);
    } catch (error) {
      res.status(400).json({ message: "Failed to create affiliate link" });
    }
  });

  app.get("/api/affiliate/analytics", authenticateToken, authorizeRole(['blogger']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const analytics = await storage.getAffiliateAnalytics(req.user!.id);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate analytics" });
    }
  });

  app.get("/api/affiliate/earnings", authenticateToken, authorizeRole(['blogger']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const earnings = await storage.getAffiliateEarnings(req.user!.id);
      res.json(earnings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch earnings" });
    }
  });

  // Merchant Dashboard Routes
  app.get("/api/merchant/products", authenticateToken, authorizeRole(['merchant', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const products = await storage.getMerchantProducts(req.user!.id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchant products" });
    }
  });

  app.get("/api/merchant/analytics", authenticateToken, authorizeRole(['merchant', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const analytics = await storage.getMerchantAnalytics(req.user!.id);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchant analytics" });
    }
  });

  app.get("/api/merchant/orders", authenticateToken, authorizeRole(['merchant', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await storage.getMerchantOrders(req.user!.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchant orders" });
    }
  });

  // Admin Routes
  app.get("/api/admin/users", authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put("/api/admin/users/:id/verify", authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.verifyUser(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to verify user" });
    }
  });

  app.get("/api/admin/analytics", authenticateToken, authorizeRole(['admin']), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const analytics = await storage.getAdminAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin analytics" });
    }
  });

  // Banners
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getActiveBanners();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  // Payment endpoints
  app.post("/api/payment/click/prepare", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { amount, orderId } = req.body;
      // Click payment preparation logic would go here
      res.json({
        click_trans_id: Math.random().toString(36).substring(7),
        merchant_trans_id: orderId,
        amount: amount,
        action: 0, // prepare
        error: 0,
        error_note: "Success"
      });
    } catch (error) {
      res.status(400).json({ error: -1, error_note: "Payment preparation failed" });
    }
  });

  app.post("/api/payment/payme/create", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { amount, orderId } = req.body;
      // Payme payment creation logic would go here
      res.json({
        result: {
          create_time: Date.now(),
          transaction: Math.random().toString(36).substring(7),
          state: 1 // created
        }
      });
    } catch (error) {
      res.status(400).json({ error: { code: -32400, message: "Payment creation failed" } });
    }
  });

  // Withdrawal requests
  app.post("/api/withdrawals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { amount, method, accountDetails } = req.body;
      const withdrawal = await storage.createWithdrawal({
        userId: req.user!.id,
        amount,
        method,
        accountDetails,
      });
      res.json(withdrawal);
    } catch (error) {
      res.status(400).json({ message: "Failed to create withdrawal request" });
    }
  });

  app.get("/api/withdrawals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const withdrawals = await storage.getUserWithdrawals(req.user!.id);
      res.json(withdrawals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  // Analytics tracking
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const { event, category, action, label, value, metadata } = req.body;
      const userId = req.headers['user-id'] ? parseInt(req.headers['user-id'] as string) : null;
      
      await storage.trackAnalytics({
        userId,
        event,
        category,
        action,
        label,
        value,
        metadata,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: "Failed to track analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
