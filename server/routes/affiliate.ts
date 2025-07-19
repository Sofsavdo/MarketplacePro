import { Router } from 'express';
import { db } from '../db.js';
import { affiliateLinks, affiliateClicks, products, orderItems, orders, insertAffiliateLinkSchema } from '@shared/schema.js';
import { eq, and, desc, sum, count } from 'drizzle-orm';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth.js';
import crypto from 'crypto';

const router = Router();

// Generate affiliate link
router.post('/links', requireAuth, requireRole(['affiliate']), async (req: AuthRequest, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.isActive, true)
      ))
      .limit(1);

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if affiliate link already exists
    const existingLink = await db
      .select()
      .from(affiliateLinks)
      .where(and(
        eq(affiliateLinks.affiliateId, req.user!.id),
        eq(affiliateLinks.productId, productId)
      ))
      .limit(1);

    if (existingLink.length > 0) {
      return res.json({
        message: 'Affiliate link already exists',
        link: existingLink[0]
      });
    }

    // Generate unique link code
    const linkCode = crypto.randomBytes(8).toString('hex');

    const newLink = await db
      .insert(affiliateLinks)
      .values({
        affiliateId: req.user!.id,
        productId: productId,
        linkCode: linkCode
      })
      .returning();

    res.status(201).json({
      message: 'Affiliate link created successfully',
      link: newLink[0]
    });
  } catch (error) {
    console.error('Create affiliate link error:', error);
    res.status(500).json({ error: 'Failed to create affiliate link' });
  }
});

// Get affiliate's links with stats
router.get('/links', requireAuth, requireRole(['affiliate']), async (req: AuthRequest, res) => {
  try {
    const links = await db
      .select({
        id: affiliateLinks.id,
        productId: affiliateLinks.productId,
        linkCode: affiliateLinks.linkCode,
        clickCount: affiliateLinks.clickCount,
        conversionCount: affiliateLinks.conversionCount,
        totalEarnings: affiliateLinks.totalEarnings,
        isActive: affiliateLinks.isActive,
        createdAt: affiliateLinks.createdAt,
        productTitle: products.title,
        productTitleUz: products.titleUz,
        productPrice: products.price,
        productImages: products.images,
        commissionRate: products.affiliateCommissionRate
      })
      .from(affiliateLinks)
      .leftJoin(products, eq(affiliateLinks.productId, products.id))
      .where(eq(affiliateLinks.affiliateId, req.user!.id))
      .orderBy(desc(affiliateLinks.createdAt));

    res.json({ links });
  } catch (error) {
    console.error('Get affiliate links error:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate links' });
  }
});

// Track affiliate click
router.post('/click/:linkCode', async (req, res) => {
  try {
    const { linkCode } = req.params;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referer');

    // Find affiliate link
    const link = await db
      .select()
      .from(affiliateLinks)
      .where(and(
        eq(affiliateLinks.linkCode, linkCode),
        eq(affiliateLinks.isActive, true)
      ))
      .limit(1);

    if (link.length === 0) {
      return res.status(404).json({ error: 'Affiliate link not found' });
    }

    // Record click
    await db.insert(affiliateClicks).values({
      linkId: link[0].id,
      ipAddress,
      userAgent,
      referrer
    });

    // Update click count
    await db
      .update(affiliateLinks)
      .set({
        clickCount: link[0].clickCount + 1
      })
      .where(eq(affiliateLinks.id, link[0].id));

    res.json({
      message: 'Click tracked successfully',
      productId: link[0].productId,
      redirectUrl: `/products/${link[0].productId}`
    });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Get affiliate dashboard stats
router.get('/stats', requireAuth, requireRole(['affiliate']), async (req: AuthRequest, res) => {
  try {
    // Get total earnings and conversions
    const earnings = await db
      .select({
        totalEarnings: sum(affiliateLinks.totalEarnings),
        totalConversions: sum(affiliateLinks.conversionCount),
        totalClicks: sum(affiliateLinks.clickCount),
        activeLinks: count(affiliateLinks.id)
      })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.affiliateId, req.user!.id));

    // Get recent clicks
    const recentClicks = await db
      .select({
        clickedAt: affiliateClicks.clickedAt,
        productTitle: products.title,
        linkCode: affiliateLinks.linkCode
      })
      .from(affiliateClicks)
      .leftJoin(affiliateLinks, eq(affiliateClicks.linkId, affiliateLinks.id))
      .leftJoin(products, eq(affiliateLinks.productId, products.id))
      .where(eq(affiliateLinks.affiliateId, req.user!.id))
      .orderBy(desc(affiliateClicks.clickedAt))
      .limit(10);

    // Get top performing links
    const topLinks = await db
      .select({
        linkCode: affiliateLinks.linkCode,
        productTitle: products.title,
        clickCount: affiliateLinks.clickCount,
        conversionCount: affiliateLinks.conversionCount,
        totalEarnings: affiliateLinks.totalEarnings,
        conversionRate: affiliateLinks.conversionCount
      })
      .from(affiliateLinks)
      .leftJoin(products, eq(affiliateLinks.productId, products.id))
      .where(eq(affiliateLinks.affiliateId, req.user!.id))
      .orderBy(desc(affiliateLinks.totalEarnings))
      .limit(5);

    res.json({
      stats: earnings[0],
      recentClicks,
      topLinks
    });
  } catch (error) {
    console.error('Get affiliate stats error:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate stats' });
  }
});

// Toggle affiliate link status
router.put('/links/:id/toggle', requireAuth, requireRole(['affiliate']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const linkId = parseInt(id);

    const link = await db
      .select()
      .from(affiliateLinks)
      .where(and(
        eq(affiliateLinks.id, linkId),
        eq(affiliateLinks.affiliateId, req.user!.id)
      ))
      .limit(1);

    if (link.length === 0) {
      return res.status(404).json({ error: 'Affiliate link not found' });
    }

    const updatedLink = await db
      .update(affiliateLinks)
      .set({
        isActive: !link[0].isActive
      })
      .where(eq(affiliateLinks.id, linkId))
      .returning();

    res.json({
      message: 'Link status updated successfully',
      link: updatedLink[0]
    });
  } catch (error) {
    console.error('Toggle link status error:', error);
    res.status(500).json({ error: 'Failed to update link status' });
  }
});

export { router as affiliateRoutes };