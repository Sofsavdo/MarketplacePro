import express from 'express';
import { eq, desc, and } from 'drizzle-orm';
import { db } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import { orders, orderItems, products, users } from '../../shared/schema.js';

const router = express.Router();

// Click.uz to'lov tizimi integratsiyasi
router.post('/click/prepare', requireAuth, async (req, res) => {
  try {
    const { 
      click_trans_id, 
      service_id, 
      click_paydoc_id, 
      merchant_trans_id, 
      amount, 
      action, 
      sign_time, 
      sign_string 
    } = req.body;

    // Bu yerda Click.uz ning secret key bilan sign_string ni tekshirish kerak
    // Hozircha oddiy validation
    if (action !== 0) {
      return res.json({
        click_trans_id,
        merchant_trans_id,
        error: -9,
        error_note: "Transaction not found"
      });
    }

    // Order mavjudligini tekshirish
    const [order] = await db.select()
      .from(orders)
      .where(eq(orders.id, Number(merchant_trans_id)))
      .limit(1);

    if (!order) {
      return res.json({
        click_trans_id,
        merchant_trans_id,
        error: -5,
        error_note: "Order not found"
      });
    }

    // Miqdor to'g'riligini tekshirish
    if (Number(amount) !== Number(order.totalAmount)) {
      return res.json({
        click_trans_id,
        merchant_trans_id,
        error: -2,
        error_note: "Incorrect amount"
      });
    }

    res.json({
      click_trans_id,
      merchant_trans_id,
      error: 0,
      error_note: "Success"
    });

  } catch (error) {
    console.error('Click prepare error:', error);
    res.json({
      click_trans_id: req.body.click_trans_id,
      merchant_trans_id: req.body.merchant_trans_id,
      error: -1,
      error_note: "Internal server error"
    });
  }
});

// Click.uz to'lov tasdiqlash
router.post('/click/complete', requireAuth, async (req, res) => {
  try {
    const { 
      click_trans_id, 
      service_id, 
      click_paydoc_id, 
      merchant_trans_id, 
      amount, 
      action, 
      sign_time, 
      sign_string 
    } = req.body;

    if (action !== 1) {
      return res.json({
        click_trans_id,
        merchant_trans_id,
        error: -9,
        error_note: "Transaction not found"
      });
    }

    // Order ni yangilash
    const [updatedOrder] = await db.update(orders)
      .set({ 
        paymentStatus: 'paid',
        status: 'confirmed',
        updatedAt: new Date()
      })
      .where(eq(orders.id, Number(merchant_trans_id)))
      .returning();

    if (!updatedOrder) {
      return res.json({
        click_trans_id,
        merchant_trans_id,
        error: -5,
        error_note: "Order not found"
      });
    }

    res.json({
      click_trans_id,
      merchant_trans_id,
      error: 0,
      error_note: "Success"
    });

  } catch (error) {
    console.error('Click complete error:', error);
    res.json({
      click_trans_id: req.body.click_trans_id,
      merchant_trans_id: req.body.merchant_trans_id,
      error: -1,
      error_note: "Internal server error"
    });
  }
});

// Payme to'lov tizimi integratsiyasi
router.post('/payme', requireAuth, async (req, res) => {
  try {
    const { method, params } = req.body;

    switch (method) {
      case 'CheckPerformTransaction':
        const { account } = params;
        const orderId = account.order_id;
        
        const [order] = await db.select()
          .from(orders)
          .where(eq(orders.id, Number(orderId)))
          .limit(1);

        if (!order) {
          return res.json({
            error: {
              code: -31050,
              message: "Order not found"
            }
          });
        }

        if (Number(params.amount) !== Number(order.totalAmount) * 100) {
          return res.json({
            error: {
              code: -31001,
              message: "Incorrect amount"
            }
          });
        }

        res.json({ result: { allow: true } });
        break;

      case 'CreateTransaction':
        // Transaction yaratish logikasi
        const transactionId = `payme_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        res.json({
          result: {
            create_time: Date.now(),
            transaction: transactionId,
            state: 1
          }
        });
        break;

      case 'PerformTransaction':
        // To'lovni amalga oshirish
        const { id } = params;
        
        // Bu yerda actual payment processing bo'lishi kerak
        res.json({
          result: {
            perform_time: Date.now(),
            transaction: id,
            state: 2
          }
        });
        break;

      default:
        res.json({
          error: {
            code: -32601,
            message: "Method not found"
          }
        });
    }

  } catch (error) {
    console.error('Payme error:', error);
    res.json({
      error: {
        code: -32400,
        message: "Internal server error"
      }
    });
  }
});

// To'lov holatini tekshirish
router.get('/status/:orderId', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.session.userId;

    const [order] = await db.select()
      .from(orders)
      .where(and(
        eq(orders.id, Number(orderId)),
        eq(orders.buyerId, userId)
      ))
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      orderId: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod
    });

  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

export default router;