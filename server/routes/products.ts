import express from 'express';
import { eq, desc, and, ilike, gte, lte } from 'drizzle-orm';
import { db } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { products, categories, users } from '@shared/schema.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sort = 'newest',
      page = 1,
      limit = 20 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    let query = db.select({
      id: products.id,
      title: products.title,
      titleUz: products.titleUz,
      description: products.description,
      descriptionUz: products.descriptionUz,
      price: products.price,
      discountPrice: products.discountPrice,
      stock: products.stock,
      images: products.images,
      affiliateCommissionRate: products.affiliateCommissionRate,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      seller: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      },
      category: {
        id: categories.id,
        name: categories.name,
        nameUz: categories.nameUz,
      }
    })
    .from(products)
    .leftJoin(users, eq(products.sellerId, users.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, true));

    // Apply filters
    const conditions = [eq(products.isActive, true)];
    
    if (category) {
      conditions.push(eq(products.categoryId, Number(category)));
    }
    
    if (search) {
      conditions.push(
        ilike(products.title, `%${search}%`)
      );
    }
    
    if (minPrice) {
      conditions.push(gte(products.price, String(minPrice)));
    }
    
    if (maxPrice) {
      conditions.push(lte(products.price, String(maxPrice)));
    }

    if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query = query.orderBy(products.price);
        break;
      case 'price_desc':
        query = query.orderBy(desc(products.price));
        break;
      case 'newest':
        query = query.orderBy(desc(products.createdAt));
        break;
      case 'oldest':
        query = query.orderBy(products.createdAt);
        break;
      default:
        query = query.orderBy(desc(products.createdAt));
    }

    const allProducts = await query
      .limit(Number(limit))
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db.select({ count: products.id })
      .from(products)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0]);

    res.json({
      products: allProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const productId = Number(req.params.id);
    
    const [product] = await db.select({
      id: products.id,
      title: products.title,
      titleUz: products.titleUz,
      description: products.description,
      descriptionUz: products.descriptionUz,
      price: products.price,
      discountPrice: products.discountPrice,
      stock: products.stock,
      images: products.images,
      specifications: products.specifications,
      affiliateCommissionRate: products.affiliateCommissionRate,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      seller: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
      },
      category: {
        id: categories.id,
        name: categories.name,
        nameUz: categories.nameUz,
        description: categories.description,
      }
    })
    .from(products)
    .leftJoin(users, eq(products.sellerId, users.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(
      eq(products.id, productId),
      eq(products.isActive, true)
    ))
    .limit(1);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Create product (sellers only)
router.post('/', requireRole(['seller']), async (req, res) => {
  try {
    const {
      categoryId,
      title,
      titleUz,
      description,
      descriptionUz,
      price,
      discountPrice,
      stock,
      images,
      specifications,
      affiliateCommissionRate
    } = req.body;

    if (!categoryId || !title || !titleUz || !description || !descriptionUz || !price || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [newProduct] = await db.insert(products).values({
      sellerId: req.session.userId,
      categoryId: Number(categoryId),
      title,
      titleUz,
      description,
      descriptionUz,
      price: String(price),
      discountPrice: discountPrice ? String(discountPrice) : null,
      stock: Number(stock),
      images: images || [],
      specifications: specifications || null,
      affiliateCommissionRate: affiliateCommissionRate ? String(affiliateCommissionRate) : '5.00',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (sellers only - own products)
router.put('/:id', requireRole(['seller']), async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const sellerId = req.session.userId;

    // Check if product exists and belongs to seller
    const [existingProduct] = await db.select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.sellerId, sellerId)
      ))
      .limit(1);

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found or you do not have permission to update it' });
    }

    const {
      categoryId,
      title,
      titleUz,
      description,
      descriptionUz,
      price,
      discountPrice,
      stock,
      images,
      specifications,
      affiliateCommissionRate,
      isActive
    } = req.body;

    const updateData: any = { updatedAt: new Date() };

    if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
    if (title !== undefined) updateData.title = title;
    if (titleUz !== undefined) updateData.titleUz = titleUz;
    if (description !== undefined) updateData.description = description;
    if (descriptionUz !== undefined) updateData.descriptionUz = descriptionUz;
    if (price !== undefined) updateData.price = String(price);
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice ? String(discountPrice) : null;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (images !== undefined) updateData.images = images;
    if (specifications !== undefined) updateData.specifications = specifications;
    if (affiliateCommissionRate !== undefined) updateData.affiliateCommissionRate = String(affiliateCommissionRate);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const [updatedProduct] = await db.update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (sellers only - own products)
router.delete('/:id', requireRole(['seller']), async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const sellerId = req.session.userId;

    // Check if product exists and belongs to seller
    const [existingProduct] = await db.select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.sellerId, sellerId)
      ))
      .limit(1);

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found or you do not have permission to delete it' });
    }

    // Soft delete by setting isActive to false
    await db.update(products)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(products.id, productId));

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get seller's products
router.get('/seller/my-products', requireRole(['seller']), async (req, res) => {
  try {
    const sellerId = req.session.userId;
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const sellerProducts = await db.select({
      id: products.id,
      title: products.title,
      titleUz: products.titleUz,
      price: products.price,
      discountPrice: products.discountPrice,
      stock: products.stock,
      images: products.images,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        nameUz: categories.nameUz,
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.sellerId, sellerId))
    .orderBy(desc(products.createdAt))
    .limit(Number(limit))
    .offset(offset);

    // Get total count
    const totalCount = await db.select({ count: products.id })
      .from(products)
      .where(eq(products.sellerId, sellerId));

    res.json({
      products: sellerProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ error: 'Failed to get seller products' });
  }
});

export default router;