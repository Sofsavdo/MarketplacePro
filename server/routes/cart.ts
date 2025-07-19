import { Router } from 'express';
import { db } from '../db.js';
import { cart, products, wishlist } from '@shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

// Get user's cart
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const cartItems = await db
      .select({
        id: cart.id,
        productId: cart.productId,
        quantity: cart.quantity,
        addedAt: cart.addedAt,
        productTitle: products.title,
        productTitleUz: products.titleUz,
        productPrice: products.price,
        productDiscountPrice: products.discountPrice,
        productImages: products.images,
        productStock: products.stock,
        productIsActive: products.isActive
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, req.user!.id));

    res.json({ cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists and is active
    const product = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.isActive, true)
      ))
      .limit(1);

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found or inactive' });
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cart)
      .where(and(
        eq(cart.userId, req.user!.id),
        eq(cart.productId, productId)
      ))
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      const updatedItem = await db
        .update(cart)
        .set({
          quantity: existingItem[0].quantity + quantity
        })
        .where(eq(cart.id, existingItem[0].id))
        .returning();

      res.json({
        message: 'Cart item updated',
        cartItem: updatedItem[0]
      });
    } else {
      // Add new item
      const newItem = await db
        .insert(cart)
        .values({
          userId: req.user!.id,
          productId,
          quantity
        })
        .returning();

      res.json({
        message: 'Item added to cart',
        cartItem: newItem[0]
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cartId = parseInt(id);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const updatedItem = await db
      .update(cart)
      .set({ quantity })
      .where(and(
        eq(cart.id, cartId),
        eq(cart.userId, req.user!.id)
      ))
      .returning();

    if (updatedItem.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({
      message: 'Cart item updated',
      cartItem: updatedItem[0]
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const cartId = parseInt(id);

    const deletedItem = await db
      .delete(cart)
      .where(and(
        eq(cart.id, cartId),
        eq(cart.userId, req.user!.id)
      ))
      .returning();

    if (deletedItem.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

// Clear cart
router.delete('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    await db
      .delete(cart)
      .where(eq(cart.userId, req.user!.id));

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Wishlist routes

// Get user's wishlist
router.get('/wishlist', requireAuth, async (req: AuthRequest, res) => {
  try {
    const wishlistItems = await db
      .select({
        id: wishlist.id,
        productId: wishlist.productId,
        addedAt: wishlist.addedAt,
        productTitle: products.title,
        productTitleUz: products.titleUz,
        productPrice: products.price,
        productDiscountPrice: products.discountPrice,
        productImages: products.images,
        productIsActive: products.isActive
      })
      .from(wishlist)
      .leftJoin(products, eq(wishlist.productId, products.id))
      .where(eq(wishlist.userId, req.user!.id));

    res.json({ wishlistItems });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add item to wishlist
router.post('/wishlist', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists and is active
    const product = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.isActive, true)
      ))
      .limit(1);

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found or inactive' });
    }

    // Check if item already exists in wishlist
    const existingItem = await db
      .select()
      .from(wishlist)
      .where(and(
        eq(wishlist.userId, req.user!.id),
        eq(wishlist.productId, productId)
      ))
      .limit(1);

    if (existingItem.length > 0) {
      return res.status(400).json({ error: 'Item already in wishlist' });
    }

    const newItem = await db
      .insert(wishlist)
      .values({
        userId: req.user!.id,
        productId
      })
      .returning();

    res.json({
      message: 'Item added to wishlist',
      wishlistItem: newItem[0]
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/wishlist/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const wishlistId = parseInt(id);

    const deletedItem = await db
      .delete(wishlist)
      .where(and(
        eq(wishlist.id, wishlistId),
        eq(wishlist.userId, req.user!.id)
      ))
      .returning();

    if (deletedItem.length === 0) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Remove wishlist item error:', error);
    res.status(500).json({ error: 'Failed to remove wishlist item' });
  }
});

export default router;