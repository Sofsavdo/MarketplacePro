import express from 'express';
import { eq, desc, and } from 'drizzle-orm';
import { db } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { orders, orderItems, products, users } from '../../shared/schema.js';

const router = express.Router();

// Get user's orders
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const userOrders = await db.select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      shippingAddress: orders.shippingAddress,
      phone: orders.phone,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      trackingNumber: orders.trackingNumber,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .where(eq(orders.buyerId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(Number(limit))
    .offset(offset);

    res.json(userOrders);

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get order details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const userId = req.session.userId;
    const userRole = req.session.userRole;

    // Get order with items
    const [order] = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check permissions
    if (userRole !== 'admin' && order.buyerId !== userId) {
      // For sellers, check if they have products in this order
      if (userRole === 'seller') {
        const sellerItems = await db.select()
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(and(
            eq(orderItems.orderId, orderId),
            eq(products.sellerId, userId)
          ));

        if (sellerItems.length === 0) {
          return res.status(403).json({ error: 'Access denied' });
        }
      } else {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get order items
    const items = await db.select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      price: orderItems.price,
      affiliateCommission: orderItems.affiliateCommission,
      product: {
        id: products.id,
        title: products.title,
        titleUz: products.titleUz,
        images: products.images,
      }
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

    res.json({
      ...order,
      items
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Failed to get order details' });
  }
});

// Create order
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, shippingAddress, phone, paymentMethod } = req.body;
    const userId = req.session.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    if (!shippingAddress || !phone) {
      return res.status(400).json({ error: 'Shipping address and phone are required' });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    // Validate and calculate total
    for (const item of items) {
      const [product] = await db.select()
        .from(products)
        .where(and(
          eq(products.id, item.productId),
          eq(products.isActive, true)
        ))
        .limit(1);

      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found or inactive` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${product.title}` });
      }

      const itemPrice = product.discountPrice || product.price;
      const itemTotal = parseFloat(itemPrice) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice,
        affiliateCommission: null // Will be calculated if affiliate link is used
      });
    }

    // Create order
    const [newOrder] = await db.insert(orders).values({
      buyerId: userId,
      affiliateId: null, // Will be set if order came through affiliate link
      totalAmount: totalAmount.toFixed(2),
      shippingAddress,
      phone,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: paymentMethod || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Create order items
    const orderItemsWithOrderId = orderItemsData.map(item => ({
      ...item,
      orderId: newOrder.id
    }));

    await db.insert(orderItems).values(orderItemsWithOrderId);

    // Update product stock
    for (const item of items) {
      await db.update(products)
        .set({ stock: products.stock - item.quantity })
        .where(eq(products.id, item.productId));
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (admin and sellers)
router.put('/:id/status', requireRole(['admin', 'seller']), async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status, trackingNumber } = req.body;
    const userId = req.session.userId;
    const userRole = req.session.userRole;

    const [order] = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // For sellers, check if they have products in this order
    if (userRole === 'seller') {
      const sellerItems = await db.select()
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(and(
          eq(orderItems.orderId, orderId),
          eq(products.sellerId, userId)
        ));

      if (sellerItems.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const [updatedOrder] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;