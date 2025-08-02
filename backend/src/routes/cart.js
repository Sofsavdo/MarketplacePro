const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cartItems = await Cart.getCart(req.user.id);
    const cartTotal = await Cart.getCartTotal(req.user.id);

    res.json({
      success: true,
      data: {
        items: cartItems,
        total: cartTotal
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID kerak'
      });
    }

    const cartItems = await Cart.addToCart(req.user.id, productId, quantity);
    const cartTotal = await Cart.getCartTotal(req.user.id);

    res.json({
      success: true,
      message: 'Mahsulot savatga qo\'shildi',
      data: {
        items: cartItems,
        total: cartTotal
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update cart item quantity
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity kerak'
      });
    }

    const cartItems = await Cart.updateCartItem(req.user.id, itemId, quantity);
    const cartTotal = await Cart.getCartTotal(req.user.id);

    res.json({
      success: true,
      message: 'Savat yangilandi',
      data: {
        items: cartItems,
        total: cartTotal
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cartItems = await Cart.removeFromCart(req.user.id, itemId);
    const cartTotal = await Cart.getCartTotal(req.user.id);

    res.json({
      success: true,
      message: 'Mahsulot savatdan olindi',
      data: {
        items: cartItems,
        total: cartTotal
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    await Cart.clearCart(req.user.id);

    res.json({
      success: true,
      message: 'Savat tozalandi',
      data: {
        items: [],
        total: {
          subtotal: 0,
          totalDiscount: 0,
          total: 0,
          itemCount: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Validate cart
router.get('/validate', auth, async (req, res) => {
  try {
    const validation = await Cart.validateCart(req.user.id);

    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

module.exports = router; 