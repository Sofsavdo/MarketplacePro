const db = require('../config/database');

class Cart {
  static async getCart(userId) {
    const cartItems = await db('cart_items')
      .select(
        'cart_items.*',
        'products.name as product_name',
        'products.price as product_price',
        'products.image as product_image',
        'products.stock_quantity',
        'products.discount_percentage',
        'merchants.business_name as merchant_name'
      )
      .leftJoin('products', 'cart_items.product_id', 'products.id')
      .leftJoin('merchants', 'products.merchant_id', 'merchants.id')
      .where('cart_items.user_id', userId);

    return cartItems;
  }

  static async addToCart(userId, productId, quantity = 1) {
    // Check if product exists and is available
    const product = await db('products')
      .where('id', productId)
      .where('status', 'active')
      .where('approval_status', 'approved')
      .where('stock_quantity', '>', 0)
      .first();

    if (!product) {
      throw new Error('Mahsulot topilmadi yoki sotuvda yo\'q');
    }

    if (product.stock_quantity < quantity) {
      throw new Error('Yetarli stock yo\'q');
    }

    // Check if item already exists in cart
    const existingItem = await db('cart_items')
      .where('user_id', userId)
      .where('product_id', productId)
      .first();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        throw new Error('Yetarli stock yo\'q');
      }

      await db('cart_items')
        .where('id', existingItem.id)
        .update({ quantity: newQuantity });

      return await this.getCart(userId);
    } else {
      // Add new item
      await db('cart_items').insert({
        user_id: userId,
        product_id: productId,
        quantity: quantity
      });

      return await this.getCart(userId);
    }
  }

  static async updateCartItem(userId, itemId, quantity) {
    const cartItem = await db('cart_items')
      .where('id', itemId)
      .where('user_id', userId)
      .first();

    if (!cartItem) {
      throw new Error('Cart item topilmadi');
    }

    // Check product stock
    const product = await db('products')
      .where('id', cartItem.product_id)
      .first();

    if (quantity > product.stock_quantity) {
      throw new Error('Yetarli stock yo\'q');
    }

    if (quantity <= 0) {
      await db('cart_items').where('id', itemId).del();
    } else {
      await db('cart_items')
        .where('id', itemId)
        .update({ quantity });
    }

    return await this.getCart(userId);
  }

  static async removeFromCart(userId, itemId) {
    await db('cart_items')
      .where('id', itemId)
      .where('user_id', userId)
      .del();

    return await this.getCart(userId);
  }

  static async clearCart(userId) {
    await db('cart_items')
      .where('user_id', userId)
      .del();

    return [];
  }

  static async getCartTotal(userId) {
    const cartItems = await this.getCart(userId);
    
    let subtotal = 0;
    let totalDiscount = 0;
    let total = 0;

    cartItems.forEach(item => {
      const itemPrice = item.product_price;
      const itemTotal = itemPrice * item.quantity;
      const discount = item.discount_percentage ? (itemTotal * item.discount_percentage / 100) : 0;
      
      subtotal += itemTotal;
      totalDiscount += discount;
      total += (itemTotal - discount);
    });

    return {
      subtotal,
      totalDiscount,
      total,
      itemCount: cartItems.length
    };
  }

  static async validateCart(userId) {
    const cartItems = await this.getCart(userId);
    const errors = [];

    for (const item of cartItems) {
      // Check if product still exists and is active
      if (!item.product_name) {
        errors.push(`${item.product_id} - Mahsulot topilmadi`);
        continue;
      }

      // Check stock
      if (item.quantity > item.stock_quantity) {
        errors.push(`${item.product_name} - Yetarli stock yo'q (${item.stock_quantity} qoldi)`);
      }

      // Check if product is still approved
      if (item.stock_quantity === 0) {
        errors.push(`${item.product_name} - Mahsulot sotuvda yo'q`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Cart; 