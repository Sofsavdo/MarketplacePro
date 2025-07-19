import express from 'express';
import { eq, desc, and, gte, lte, count, sum, sql } from 'drizzle-orm';
import { db } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { orders, orderItems, products, users, affiliateLinks, affiliateClicks } from '../../shared/schema.js';

const router = express.Router();

// Sotuvchi uchun statistika
router.get('/seller/dashboard', requireRole(['seller']), async (req, res) => {
  try {
    const sellerId = req.session.userId;
    const { period = '30' } = req.query; // kunlar
    
    const periodDate = new Date();
    periodDate.setDate(periodDate.getDate() - Number(period));

    // Umumiy statistika
    const totalProductsResult = await db.select({ count: count() })
      .from(products)
      .where(and(
        eq(products.sellerId, sellerId),
        eq(products.isActive, true)
      ));

    const totalOrdersResult = await db.select({ count: count() })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(and(
        eq(products.sellerId, sellerId),
        gte(orders.createdAt, periodDate)
      ));

    const totalRevenueResult = await db.select({ 
      total: sum(sql`${orderItems.price} * ${orderItems.quantity}`) 
    })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(and(
        eq(products.sellerId, sellerId),
        eq(orders.paymentStatus, 'paid'),
        gte(orders.createdAt, periodDate)
      ));

    // Oxirgi buyurtmalar
    const recentOrders = await db.select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
      buyer: {
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email
      }
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(users, eq(orders.buyerId, users.id))
    .where(eq(products.sellerId, sellerId))
    .orderBy(desc(orders.createdAt))
    .limit(10);

    // Eng ko'p sotilgan mahsulotlar
    const topProducts = await db.select({
      productId: products.id,
      title: products.title,
      titleUz: products.titleUz,
      price: products.price,
      totalSold: sum(orderItems.quantity),
      totalRevenue: sum(sql`${orderItems.price} * ${orderItems.quantity}`)
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(
      eq(products.sellerId, sellerId),
      eq(orders.paymentStatus, 'paid'),
      gte(orders.createdAt, periodDate)
    ))
    .groupBy(products.id, products.title, products.titleUz, products.price)
    .orderBy(desc(sum(orderItems.quantity)))
    .limit(5);

    res.json({
      stats: {
        totalProducts: totalProductsResult[0]?.count || 0,
        totalOrders: totalOrdersResult[0]?.count || 0,
        totalRevenue: totalRevenueResult[0]?.total || '0',
        period: Number(period)
      },
      recentOrders,
      topProducts
    });

  } catch (error) {
    console.error('Seller analytics error:', error);
    res.status(500).json({ error: 'Failed to get seller analytics' });
  }
});

// Affiliate uchun statistika
router.get('/affiliate/dashboard', requireRole(['affiliate']), async (req, res) => {
  try {
    const affiliateId = req.session.userId;
    const { period = '30' } = req.query;
    
    const periodDate = new Date();
    periodDate.setDate(periodDate.getDate() - Number(period));

    // Umumiy statistika
    const totalLinksResult = await db.select({ count: count() })
      .from(affiliateLinks)
      .where(and(
        eq(affiliateLinks.affiliateId, affiliateId),
        eq(affiliateLinks.isActive, true)
      ));

    const totalClicksResult = await db.select({ total: sum(affiliateLinks.clickCount) })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.affiliateId, affiliateId));

    const totalEarningsResult = await db.select({ total: sum(affiliateLinks.totalEarnings) })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.affiliateId, affiliateId));

    const totalConversionsResult = await db.select({ total: sum(affiliateLinks.conversionCount) })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.affiliateId, affiliateId));

    // Eng samarali linklar
    const topLinks = await db.select({
      id: affiliateLinks.id,
      linkCode: affiliateLinks.linkCode,
      clickCount: affiliateLinks.clickCount,
      conversionCount: affiliateLinks.conversionCount,
      totalEarnings: affiliateLinks.totalEarnings,
      conversionRate: sql`CASE WHEN ${affiliateLinks.clickCount} > 0 THEN ${affiliateLinks.conversionCount}::float / ${affiliateLinks.clickCount}::float * 100 ELSE 0 END`,
      product: {
        id: products.id,
        title: products.title,
        titleUz: products.titleUz,
        price: products.price,
        affiliateCommissionRate: products.affiliateCommissionRate
      }
    })
    .from(affiliateLinks)
    .leftJoin(products, eq(affiliateLinks.productId, products.id))
    .where(eq(affiliateLinks.affiliateId, affiliateId))
    .orderBy(desc(affiliateLinks.totalEarnings))
    .limit(10);

    // Oxirgi kliklar
    const recentClicks = await db.select({
      id: affiliateClicks.id,
      ipAddress: affiliateClicks.ipAddress,
      clickedAt: affiliateClicks.clickedAt,
      link: {
        linkCode: affiliateLinks.linkCode,
        product: {
          title: products.title,
          titleUz: products.titleUz
        }
      }
    })
    .from(affiliateClicks)
    .leftJoin(affiliateLinks, eq(affiliateClicks.linkId, affiliateLinks.id))
    .leftJoin(products, eq(affiliateLinks.productId, products.id))
    .where(eq(affiliateLinks.affiliateId, affiliateId))
    .orderBy(desc(affiliateClicks.clickedAt))
    .limit(20);

    const totalClicks = totalClicksResult[0]?.total || 0;
    const totalConversions = totalConversionsResult[0]?.total || 0;
    const conversionRate = totalClicks > 0 ? (Number(totalConversions) / Number(totalClicks) * 100) : 0;

    res.json({
      stats: {
        totalLinks: totalLinksResult[0]?.count || 0,
        totalClicks: totalClicks,
        totalEarnings: totalEarningsResult[0]?.total || '0',
        totalConversions: totalConversions,
        conversionRate: conversionRate.toFixed(2),
        period: Number(period)
      },
      topLinks,
      recentClicks
    });

  } catch (error) {
    console.error('Affiliate analytics error:', error);
    res.status(500).json({ error: 'Failed to get affiliate analytics' });
  }
});

// Admin uchun umumiy statistika
router.get('/admin/dashboard', requireRole(['admin']), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const periodDate = new Date();
    periodDate.setDate(periodDate.getDate() - Number(period));

    // Platform statistikasi
    const totalUsersResult = await db.select({ 
      total: count(),
      buyers: count(sql`CASE WHEN ${users.role} = 'buyer' THEN 1 END`),
      sellers: count(sql`CASE WHEN ${users.role} = 'seller' THEN 1 END`),
      affiliates: count(sql`CASE WHEN ${users.role} = 'affiliate' THEN 1 END`)
    })
    .from(users)
    .where(eq(users.isActive, true));

    const totalProductsResult = await db.select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true));

    const totalRevenueResult = await db.select({ 
      total: sum(orders.totalAmount)
    })
    .from(orders)
    .where(and(
      eq(orders.paymentStatus, 'paid'),
      gte(orders.createdAt, periodDate)
    ));

    const totalOrdersResult = await db.select({ count: count() })
      .from(orders)
      .where(gte(orders.createdAt, periodDate));

    // Eng faol sotuvchilar
    const topSellers = await db.select({
      sellerId: products.sellerId,
      seller: {
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email
      },
      totalProducts: count(products.id),
      totalRevenue: sum(sql`${orderItems.price} * ${orderItems.quantity}`)
    })
    .from(products)
    .leftJoin(users, eq(products.sellerId, users.id))
    .leftJoin(orderItems, eq(products.id, orderItems.productId))
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(
      eq(products.isActive, true),
      eq(orders.paymentStatus, 'paid'),
      gte(orders.createdAt, periodDate)
    ))
    .groupBy(products.sellerId, users.firstName, users.lastName, users.email)
    .orderBy(desc(sum(sql`${orderItems.price} * ${orderItems.quantity}`)))
    .limit(10);

    res.json({
      stats: {
        totalUsers: totalUsersResult[0]?.total || 0,
        buyers: totalUsersResult[0]?.buyers || 0,
        sellers: totalUsersResult[0]?.sellers || 0,
        affiliates: totalUsersResult[0]?.affiliates || 0,
        totalProducts: totalProductsResult[0]?.count || 0,
        totalRevenue: totalRevenueResult[0]?.total || '0',
        totalOrders: totalOrdersResult[0]?.count || 0,
        period: Number(period)
      },
      topSellers
    });

  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ error: 'Failed to get admin analytics' });
  }
});

export default router;