import { pgTable, serial, varchar, text, decimal, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['buyer', 'seller', 'affiliate', 'admin']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed', 'refunded']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: userRoleEnum('role').notNull().default('buyer'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  nameUz: varchar('name_uz', { length: 100 }).notNull(),
  description: text('description'),
  parentId: integer('parent_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sellerId: integer('seller_id').notNull(),
  categoryId: integer('category_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  titleUz: varchar('title_uz', { length: 255 }).notNull(),
  description: text('description').notNull(),
  descriptionUz: text('description_uz').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal('discount_price', { precision: 10, scale: 2 }),
  stock: integer('stock').notNull().default(0),
  images: text('images').array(),
  specifications: text('specifications'),
  affiliateCommissionRate: decimal('affiliate_commission_rate', { precision: 5, scale: 2 }).default('5.00'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  buyerId: integer('buyer_id').notNull(),
  affiliateId: integer('affiliate_id'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text('shipping_address').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  status: orderStatusEnum('status').default('pending'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Order items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  affiliateCommission: decimal('affiliate_commission', { precision: 10, scale: 2 }),
});

// Affiliate links table
export const affiliateLinks = pgTable('affiliate_links', {
  id: serial('id').primaryKey(),
  affiliateId: integer('affiliate_id').notNull(),
  productId: integer('product_id').notNull(),
  linkCode: varchar('link_code', { length: 50 }).notNull().unique(),
  clickCount: integer('click_count').default(0),
  conversionCount: integer('conversion_count').default(0),
  totalEarnings: decimal('total_earnings', { precision: 10, scale: 2 }).default('0.00'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Affiliate clicks tracking
export const affiliateClicks = pgTable('affiliate_clicks', {
  id: serial('id').primaryKey(),
  linkId: integer('link_id').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  clickedAt: timestamp('clicked_at').defaultNow(),
});

// Cart table
export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
  addedAt: timestamp('added_at').defaultNow(),
});

// Wishlist table
export const wishlist = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  addedAt: timestamp('added_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  orders: many(orders),
  affiliateLinks: many(affiliateLinks),
  cart: many(cart),
  wishlist: many(wishlist),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id]
  }),
  children: many(categories),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id]
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  orderItems: many(orderItems),
  affiliateLinks: many(affiliateLinks),
  cartItems: many(cart),
  wishlistItems: many(wishlist),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id]
  }),
  affiliate: one(users, {
    fields: [orders.affiliateId],
    references: [users.id]
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  }),
}));

export const affiliateLinksRelations = relations(affiliateLinks, ({ one, many }) => ({
  affiliate: one(users, {
    fields: [affiliateLinks.affiliateId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [affiliateLinks.productId],
    references: [products.id]
  }),
  clicks: many(affiliateClicks),
}));

export const affiliateClicksRelations = relations(affiliateClicks, ({ one }) => ({
  link: one(affiliateLinks, {
    fields: [affiliateClicks.linkId],
    references: [affiliateLinks.id]
  }),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [cart.productId],
    references: [products.id]
  }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, {
    fields: [wishlist.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [wishlist.productId],
    references: [products.id]
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type NewAffiliateLink = typeof affiliateLinks.$inferInsert;

export type AffiliateClick = typeof affiliateClicks.$inferSelect;
export type NewAffiliateClick = typeof affiliateClicks.$inferInsert;

export type CartItem = typeof cart.$inferSelect;
export type NewCartItem = typeof cart.$inferInsert;

export type WishlistItem = typeof wishlist.$inferSelect;
export type NewWishlistItem = typeof wishlist.$inferInsert;