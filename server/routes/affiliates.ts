import express from 'express';
import { eq, desc, and } from 'drizzle-orm';
import { db } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { affiliateLinks, affiliateClicks, products, users } from '../../shared/schema.js';

const router = express.Router();

// Generate unique affiliate link code
function generateLinkCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Get affiliate's links
router.get('/my-links', requireRole(['affiliate']), async (req, res) => {
  try {
    const affiliateId = req.session.userId;
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const links = await db.select({
      id: affiliateLinks.id,
      linkCode: affiliateLinks.linkCode,
      clickCount: affiliateLinks.clickCount,
      conversionCount: affiliateLinks.conversionCount,
      totalEarnings: affiliateLinks.totalEarnings,
      isActive: affiliateLinks.isActive,
      createdAt: affiliateLinks.createdAt,
      product: {
        id: products.id,
        title: products.title,
        titleUz: products.titleUz,
        price: products.price,
        discountPrice: products.discountPrice,
        images: products.images,
        affiliateCommissionRate: products.affiliateCommissionRate,
      }
    })
    .from(affiliateLinks)
    .leftJoin(products, eq(affiliateLinks.productId, products.id))
    .where(eq(affiliateLinks.affiliateId, affiliateId))
    .orderBy(desc(affiliateLinks.createdAt))
    .limit(Number(limit))
    .offset(offset);

    res.json(links);

  } catch (error) {
    console.error('Get affiliate links error:', error);
    res.status(500).json({ error: 'Failed to get affiliate links' });
  }
});

// Create affiliate link
router.post('/create-link', requireRole(['affiliate']), async (req, res) => {
  try {
    const { productId } = req.body;
    const affiliateId = req.session.userId;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const [product] = await db.select()
      .from(products)
      .where(and(
        eq(products.id, Number(productId)),
        eq(products.isActive, true)
      ))
      .limit(1);

    if (!product) {
      return res.status(404).json({ error: 'Product not found or inactive' });
    }

    // Check if affiliate link already exists for this product
    const [existingLink] = await db.select()
      .from(affiliateLinks)
      .where(and(
        eq(affiliateLinks.affiliateId, affiliateId),
        eq(affiliateLinks.productId, Number(productId))
      ))
      .limit(1);

    if (existingLink) {
      return res.status(400).json({ error: 'Affiliate link already exists for this product' });
    }

    // Generate unique link code
    let linkCode;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      linkCode = generateLinkCode();
      const [existing] = await db.select()
        .from(affiliateLinks)
        .where(eq(affiliateLinks.linkCode, linkCode))
        .limit(1);
      
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Failed to generate unique link code' });
    }

    // Create affiliate link
    const [newLink] = await db.insert(affiliateLinks).values({
      affiliateId,
      productId: Number(productId),
      linkCode,
      clickCount: 0,
      conversionCount: 0,
      totalEarnings: '0.00',
      isActive: true,
      createdAt: new Date()
    }).returning();

    res.status(201).json({
      message: 'Affiliate link created successfully',
      link: newLink,
      fullUrl: `${req.protocol}://${req.get('host')}/affiliate/${linkCode}`
    });

  } catch (error) {
    console.error('Create affiliate link error:', error);
    res.status(500).json({ error: 'Failed to create affiliate link' });
  }
});

// Track affiliate click (public)
router.get('/click/:linkCode', async (req, res) => {
  try {
    const { linkCode } = req.params;

    // Find affiliate link
    const [link] = await db.select()
      .from(affiliateLinks)
      .where(and(
        eq(affiliateLinks.linkCode, linkCode),
        eq(affiliateLinks.isActive, true)
      ))
      .limit(1);

    if (!link) {
      return res.status(404).json({ error: 'Affiliate link not found' });
    }

    // Record click
    await db.insert(affiliateClicks).values({
      linkId: link.id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      clickedAt: new Date()
    });

    // Update click count
    await db.update(affiliateLinks)
      .set({ clickCount: affiliateLinks.clickCount + 1 })
      .where(eq(affiliateLinks.id, link.id));

    // Redirect to product page
    res.redirect(`/products/${link.productId}?ref=${linkCode}`);

  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Get affiliate analytics
router.get('/analytics', requireRole(['affiliate']), async (req, res) => {
  try {
    const affiliateId = req.session.userId;

    // Get total statistics
    const totalStats = await db.select({
      totalLinks: affiliateLinks.id,
      totalClicks: affiliateLinks.clickCount,
      totalConversions: affiliateLinks.conversionCount,
      totalEarnings: affiliateLinks.totalEarnings,
    })
    .from(affiliateLinks)
    .where(eq(affiliateLinks.affiliateId, affiliateId));

    const analytics = {
      totalLinks: totalStats.length,
      totalClicks: totalStats.reduce((sum, stat) => sum + stat.totalClicks, 0),
      totalConversions: totalStats.reduce((sum, stat) => sum + stat.totalConversions, 0),
      totalEarnings: totalStats.reduce((sum, stat) => sum + parseFloat(stat.totalEarnings), 0).toFixed(2),
      conversionRate: 0,
      averageCommission: 0
    };

    if (analytics.totalClicks > 0) {
      analytics.conversionRate = ((analytics.totalConversions / analytics.totalClicks) * 100).toFixed(2);
    }

    if (analytics.totalConversions > 0) {
      analytics.averageCommission = (parseFloat(analytics.totalEarnings) / analytics.totalConversions).toFixed(2);
    }

    res.json(analytics);

  } catch (error) {
    console.error('Get affiliate analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Toggle affiliate link status
router.put('/links/:id/toggle', requireRole(['affiliate']), async (req, res) => {
  try {
    const linkId = Number(req.params.id);
    const affiliateId = req.session.userId;

    // Check if link belongs to affiliate
    const [link] = await db.select()
      .from(affiliateLinks)
      .where(and(
        eq(affiliateLinks.id, linkId),
        eq(affiliateLinks.affiliateId, affiliateId)
      ))
      .limit(1);

    if (!link) {
      return res.status(404).json({ error: 'Affiliate link not found' });
    }

    // Toggle status
    const [updatedLink] = await db.update(affiliateLinks)
      .set({ isActive: !link.isActive })
      .where(eq(affiliateLinks.id, linkId))
      .returning();

    res.json({
      message: 'Link status updated successfully',
      link: updatedLink
    });

  } catch (error) {
    console.error('Toggle link status error:', error);
    res.status(500).json({ error: 'Failed to toggle link status' });
  }
});

// Get link performance
router.get('/links/:id/performance', requireRole(['affiliate']), async (req, res) => {
  try {
    const linkId = Number(req.params.id);
    const affiliateId = req.session.userId;

    // Check if link belongs to affiliate
    const [link] = await db.select()
      .from(affiliateLinks)
      .where(and(
        eq(affiliateLinks.id, linkId),
        eq(affiliateLinks.affiliateId, affiliateId)
      ))
      .limit(1);

    if (!link) {
      return res.status(404).json({ error: 'Affiliate link not found' });
    }

    // Get recent clicks (last 30 days)
    const recentClicks = await db.select()
      .from(affiliateClicks)
      .where(eq(affiliateClicks.linkId, linkId))
      .orderBy(desc(affiliateClicks.clickedAt))
      .limit(100);

    res.json({
      link,
      recentClicks,
      performance: {
        clickCount: link.clickCount,
        conversionCount: link.conversionCount,
        totalEarnings: link.totalEarnings,
        conversionRate: link.clickCount > 0 ? ((link.conversionCount / link.clickCount) * 100).toFixed(2) : '0.00'
      }
    });

  } catch (error) {
    console.error('Get link performance error:', error);
    res.status(500).json({ error: 'Failed to get link performance' });
  }
});

export default router;