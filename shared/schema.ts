import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  role: text("role", { enum: ["customer", "merchant", "blogger", "admin"] }).notNull().default("customer"),
  isActive: boolean("is_active").notNull().default(true),
  isVerified: boolean("is_verified").notNull().default(false),
  avatar: text("avatar"),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).notNull().default("0.00"),
  referralCode: text("referral_code").unique(),
  referredBy: integer("referred_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Affiliate Marketing jadvallari
export const affiliateLinks = pgTable("affiliate_links", {
  id: serial("id").primaryKey(),
  bloggerId: integer("blogger_id").notNull().references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  campaignId: integer("campaign_id").references(() => affiliateCampaigns.id),
  uniqueCode: text("unique_code").notNull().unique(),
  clicks: integer("clicks").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  earnings: decimal("earnings", { precision: 10, scale: 2 }).notNull().default("0.00"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const affiliateCampaigns = pgTable("affiliate_campaigns", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(), // foizda
  budget: decimal("budget", { precision: 10, scale: 2 }),
  spent: decimal("spent", { precision: 10, scale: 2 }).notNull().default("0.00"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const affiliateTransactions = pgTable("affiliate_transactions", {
  id: serial("id").primaryKey(),
  bloggerId: integer("blogger_id").notNull().references(() => users.id),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected", "paid"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Monetizatsiya va to'lovlar
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method", { enum: ["click", "payme", "cash", "card", "crypto"] }).notNull(),
  status: text("status", { enum: ["pending", "completed", "failed", "refunded"] }).notNull().default("pending"),
  transactionId: text("transaction_id").unique(),
  gatewayResponse: jsonb("gateway_response"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method", { enum: ["bank", "card", "crypto"] }).notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected", "completed"] }).notNull().default("pending"),
  accountDetails: jsonb("account_details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Kengaytirilgan mahsulot funksionalligi
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameUz: text("name_uz").notNull(),
  nameRu: text("name_ru").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: integer("parent_id"),
  icon: text("icon"),
  image: text("image"),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  descriptionEn: text("description_en"),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  nameUz: text("name_uz").notNull(),
  nameRu: text("name_ru").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  descriptionEn: text("description_en"),
  slug: text("slug").notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: integer("discount").default(0),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  videos: jsonb("videos").$type<string[]>().notNull().default([]),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  merchantId: integer("merchant_id").notNull().references(() => users.id),
  stock: integer("stock").notNull().default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isBoosted: boolean("is_boosted").notNull().default(false),
  fastDelivery: boolean("fast_delivery").notNull().default(false),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: jsonb("dimensions").$type<{length: number, width: number, height: number}>(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// AI tavsiyalar uchun
export const productRecommendations = pgTable("product_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  score: decimal("score", { precision: 5, scale: 4 }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0.00"),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).notNull().default("0.00"),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  status: text("status", { enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"] }).notNull().default("pending"),
  paymentMethod: text("payment_method", { enum: ["click", "payme", "cash", "card", "crypto", "bnpl"] }),
  paymentStatus: text("payment_status", { enum: ["pending", "paid", "failed", "refunded"] }).notNull().default("pending"),
  deliveryAddress: text("delivery_address").notNull(),
  phone: text("phone").notNull(),
  trackingNumber: text("tracking_number"),
  estimatedDelivery: timestamp("estimated_delivery"),
  affiliateCode: text("affiliate_code"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull().default("0.00"),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  titleUz: text("title_uz").notNull(),
  titleRu: text("title_ru").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  descriptionEn: text("description_en"),
  image: text("image").notNull(),
  link: text("link"),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

// Marketing va reklama
export const marketingCampaigns = pgTable("marketing_campaigns", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type", { enum: ["email", "sms", "push", "banner"] }).notNull(),
  status: text("status", { enum: ["draft", "active", "paused", "completed"] }).notNull().default("draft"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  spent: decimal("spent", { precision: 10, scale: 2 }).notNull().default("0.00"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  targetAudience: jsonb("target_audience"),
  content: jsonb("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Analytics va hisobotlar
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  event: text("event").notNull(),
  category: text("category").notNull(),
  action: text("action").notNull(),
  label: text("label"),
  value: decimal("value", { precision: 10, scale: 2 }),
  metadata: jsonb("metadata"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  referralCode: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  nameUz: true,
  nameRu: true,
  nameEn: true,
  slug: true,
  parentId: true,
  icon: true,
  image: true,
  descriptionUz: true,
  descriptionRu: true,
  descriptionEn: true,
  order: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  nameUz: true,
  nameRu: true,
  nameEn: true,
  descriptionUz: true,
  descriptionRu: true,
  descriptionEn: true,
  slug: true,
  price: true,
  originalPrice: true,
  discount: true,
  images: true,
  videos: true,
  categoryId: true,
  merchantId: true,
  stock: true,
  fastDelivery: true,
  weight: true,
  dimensions: true,
  tags: true,
  seoTitle: true,
  seoDescription: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  productId: true,
  quantity: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  totalAmount: true,
  subtotal: true,
  tax: true,
  shipping: true,
  discount: true,
  paymentMethod: true,
  deliveryAddress: true,
  phone: true,
  affiliateCode: true,
  notes: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  productId: true,
  orderId: true,
  rating: true,
  comment: true,
  images: true,
});

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).pick({
  bloggerId: true,
  productId: true,
  campaignId: true,
  uniqueCode: true,
});

export const insertAffiliateCampaignSchema = createInsertSchema(affiliateCampaigns).pick({
  merchantId: true,
  name: true,
  description: true,
  commissionRate: true,
  budget: true,
  startDate: true,
  endDate: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type Banner = typeof banners.$inferSelect;
export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertAffiliateCampaign = z.infer<typeof insertAffiliateCampaignSchema>;
export type AffiliateCampaign = typeof affiliateCampaigns.$inferSelect;
export type AffiliateTransaction = typeof affiliateTransactions.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type MarketingCampaign = typeof marketingCampaigns.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
