import express from 'express';
import { eq, desc, count, sql } from 'drizzle-orm';
import { db } from '../index.js';
import { requireRole } from '../middleware/auth.js';
import { users, products, orders, categories, affiliateLinks } from '../../shared/schema.js';

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', requireRole(['admin']), async (req, res) => {
  try {
    // Get various statistics
    const [userStats] = await db.select({
      totalUsers: count(),
      buyers: sql<number>`count(*) filter (where role = 'buyer')::int`,
      sellers: sql<number>`count(*) filter (where role = 'seller')::int`,
      affiliates: sql<number>`count(*) filter (where role = 'affiliate')::int`,
    }).from(users);

    const [productStats] = await db.select({
      total: count(),
      active: sql<number>`count(*) filter (where is_active = true)::int`,
    }).from(products);

    const [orderStats] = await db.select({
      total: count(),
      pending: sql<number>`count(*) filter (where status = 'pending')::int`,
      completed: sql<number>`count(*) filter (where status = 'delivered')::int`,
      totalRevenue: sql<number>`coalesce(sum(total_amount), 0)`,
    }).from(orders);

    const [categoryStats] = await db.select({
      total: count(),
    }).from(categories);

    const [affiliateStats] = await db.select({
      totalLinks: count(),
      totalClicks: sql<number>`coalesce(sum(click_count), 0)`,
      totalConversions: sql<number>`coalesce(sum(conversion_count), 0)`,
    }).from(affiliateLinks);

    res.json({
      users: userStats,
      products: productStats,
      orders: orderStats,
      categories: categoryStats,
      affiliates: affiliateStats,
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard statistics' });
  }
});

// Get all users
router.get('/users', requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 50, role, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users);

    // Apply filters
    if (role) {
      query = query.where(eq(users.role, role as any));
    }

    const allUsers = await query
      .orderBy(desc(users.createdAt))
      .limit(Number(limit))
      .offset(offset);

    res.json(allUsers);

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Toggle user status
router.put('/users/:id/toggle-status', requireRole(['admin']), async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow disabling admin users
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot disable admin users' });
    }

    const [updatedUser] = await db.update(users)
      .set({ 
        isActive: !user.isActive,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    res.json({
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      }
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

// Get all products with pagination
router.get('/products', requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 50, category, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = db.select({
      id: products.id,
      title: products.title,
      titleUz: products.titleUz,
      price: products.price,
      discountPrice: products.discountPrice,
      stock: products.stock,
      images: products.images,
      isActive: products.isActive,
      createdAt: products.createdAt,
      seller: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      },
      category: {
        id: categories.id,
        name: categories.name,
        nameUz: categories.nameUz,
      }
    })
    .from(products)
    .leftJoin(users, eq(products.sellerId, users.id))
    .leftJoin(categories, eq(products.categoryId, categories.id));

    // Apply filters
    if (category) {
      query = query.where(eq(products.categoryId, Number(category)));
    }
    
    if (status !== undefined) {
      query = query.where(eq(products.isActive, status === 'active'));
    }

    const allProducts = await query
      .orderBy(desc(products.createdAt))
      .limit(Number(limit))
      .offset(offset);

    res.json(allProducts);

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Toggle product status
router.put('/products/:id/toggle-status', requireRole(['admin']), async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const [product] = await db.select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const [updatedProduct] = await db.update(products)
      .set({ 
        isActive: !product.isActive,
        updatedAt: new Date()
      })
      .where(eq(products.id, productId))
      .returning();

    res.json({
      message: `Product ${updatedProduct.isActive ? 'activated' : 'deactivated'} successfully`,
      product: {
        id: updatedProduct.id,
        title: updatedProduct.title,
        isActive: updatedProduct.isActive,
      }
    });

  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({ error: 'Failed to toggle product status' });
  }
});

// Get all orders
router.get('/orders', requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = db.select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      shippingAddress: orders.shippingAddress,
      phone: orders.phone,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      trackingNumber: orders.trackingNumber,
      createdAt: orders.createdAt,
      buyer: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      }
    })
    .from(orders)
    .leftJoin(users, eq(orders.buyerId, users.id));

    // Apply status filter
    if (status) {
      query = query.where(eq(orders.status, status as any));
    }

    const allOrders = await query
      .orderBy(desc(orders.createdAt))
      .limit(Number(limit))
      .offset(offset);

    res.json(allOrders);

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Update order status
router.put('/orders/:id/status', requireRole(['admin']), async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status, paymentStatus, trackingNumber } = req.body;

    const [order] = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const [updatedOrder] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();

    res.json({
      message: 'Order updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Get system logs (placeholder - would need proper logging system)
router.get('/logs', requireRole(['admin']), async (req, res) => {
  try {
    // This is a placeholder - in a real system you'd have proper logging
    const logs = [
      {
        id: 1,
        level: 'info',
        message: 'System started successfully',
        timestamp: new Date(),
        source: 'server'
      }
    ];

    res.json(logs);

  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

export default router;