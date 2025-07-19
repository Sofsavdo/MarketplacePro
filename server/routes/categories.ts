import express from 'express';
import { eq, isNull, sql } from 'drizzle-orm';
import { db } from '../db.js';
import { requireRole } from '../middleware/auth.js';
import { categories, products } from '@shared/schema.js';

const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const { includeProductCount = false } = req.query;
    
    if (includeProductCount === 'true') {
      // Get categories with product counts
      const categoriesWithCounts = await db.select({
        id: categories.id,
        name: categories.name,
        nameUz: categories.nameUz,
        description: categories.description,
        parentId: categories.parentId,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        productCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${products} 
          WHERE ${products.categoryId} = ${categories.id} 
          AND ${products.isActive} = true
        )`.as('product_count')
      })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.name);

      res.json(categoriesWithCounts);
    } else {
      // Get categories without product counts
      const allCategories = await db.select()
        .from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(categories.name);

      res.json(allCategories);
    }

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get category tree (hierarchical structure)
router.get('/tree', async (req, res) => {
  try {
    const allCategories = await db.select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.name);

    // Build hierarchical structure
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // First pass: create all category objects
    allCategories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        children: []
      });
    });

    // Second pass: build hierarchy
    allCategories.forEach(category => {
      const categoryObj = categoryMap.get(category.id);
      
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryObj);
        }
      } else {
        rootCategories.push(categoryObj);
      }
    });

    res.json(rootCategories);

  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({ error: 'Failed to get category tree' });
  }
});

// Get single category (public)
router.get('/:id', async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    
    const [category] = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get children categories
    const children = await db.select()
      .from(categories)
      .where(eq(categories.parentId, categoryId))
      .orderBy(categories.name);

    // Get product count
    const productCount = await db.select({ 
      count: sql<number>`count(*)::int` 
    })
    .from(products)
    .where(eq(products.categoryId, categoryId));

    res.json({
      ...category,
      children,
      productCount: productCount[0]?.count || 0
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to get category' });
  }
});

// Create category (admin only)
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    const { name, nameUz, description, parentId } = req.body;

    if (!name || !nameUz) {
      return res.status(400).json({ error: 'Name and Uzbek name are required' });
    }

    // If parentId is provided, check if parent exists
    if (parentId) {
      const [parent] = await db.select()
        .from(categories)
        .where(eq(categories.id, Number(parentId)))
        .limit(1);

      if (!parent) {
        return res.status(400).json({ error: 'Parent category not found' });
      }
    }

    const [newCategory] = await db.insert(categories).values({
      name,
      nameUz,
      description: description || null,
      parentId: parentId ? Number(parentId) : null,
      isActive: true,
      createdAt: new Date()
    }).returning();

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const { name, nameUz, description, parentId, isActive } = req.body;

    // Check if category exists
    const [existingCategory] = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // If parentId is provided, check if parent exists and prevent circular reference
    if (parentId && parentId !== categoryId) {
      const [parent] = await db.select()
        .from(categories)
        .where(eq(categories.id, Number(parentId)))
        .limit(1);

      if (!parent) {
        return res.status(400).json({ error: 'Parent category not found' });
      }

      // Simple circular reference check (could be more thorough)
      if (parent.parentId === categoryId) {
        return res.status(400).json({ error: 'Cannot create circular reference' });
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (nameUz !== undefined) updateData.nameUz = nameUz;
    if (description !== undefined) updateData.description = description;
    if (parentId !== undefined) updateData.parentId = parentId ? Number(parentId) : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const [updatedCategory] = await db.update(categories)
      .set(updateData)
      .where(eq(categories.id, categoryId))
      .returning();

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    // Check if category exists
    const [existingCategory] = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has products
    const productCount = await db.select({ 
      count: sql<number>`count(*)::int` 
    })
    .from(products)
    .where(eq(products.categoryId, categoryId));

    if (productCount[0]?.count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing products. Move or delete products first.' 
      });
    }

    // Check if category has subcategories
    const childCount = await db.select({ 
      count: sql<number>`count(*)::int` 
    })
    .from(categories)
    .where(eq(categories.parentId, categoryId));

    if (childCount[0]?.count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with subcategories. Delete or move subcategories first.' 
      });
    }

    // Soft delete
    await db.update(categories)
      .set({ isActive: false })
      .where(eq(categories.id, categoryId));

    res.json({ message: 'Category deleted successfully' });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Get popular categories (based on product count)
router.get('/popular/top', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const popularCategories = await db.select({
      id: categories.id,
      name: categories.name,
      nameUz: categories.nameUz,
      description: categories.description,
      productCount: sql<number>`(
        SELECT COUNT(*)::int 
        FROM ${products} 
        WHERE ${products.categoryId} = ${categories.id} 
        AND ${products.isActive} = true
      )`.as('product_count')
    })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(sql`product_count DESC`)
    .limit(Number(limit));

    res.json(popularCategories);

  } catch (error) {
    console.error('Get popular categories error:', error);
    res.status(500).json({ error: 'Failed to get popular categories' });
  }
});

export default router;