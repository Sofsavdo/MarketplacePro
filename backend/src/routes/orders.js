const express = require('express');
const router = express.Router();

// Mock orders data
const orders = [
  {
    id: 1,
    customer: 'Aziz Karimov',
    customerEmail: 'aziz@example.com',
    products: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        price: 15000000,
        quantity: 1
      }
    ],
    total: 15000000,
    status: 'completed',
    paymentMethod: 'card',
    affiliate: 'blogger@affilimart.com',
    commission: 750000,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    customer: 'Malika Yusupova',
    customerEmail: 'malika@example.com',
    products: [
      {
        id: 2,
        name: 'MacBook Pro M3 Max',
        price: 25000000,
        quantity: 1
      }
    ],
    total: 25000000,
    status: 'processing',
    paymentMethod: 'card',
    affiliate: 'blogger@affilimart.com',
    commission: 1250000,
    createdAt: '2024-01-14'
  }
];

// Get all orders
router.get('/', (req, res) => {
  const { status, affiliate, customer } = req.query;
  
  let filteredOrders = [...orders];

  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }

  if (affiliate) {
    filteredOrders = filteredOrders.filter(order => order.affiliate === affiliate);
  }

  if (customer) {
    filteredOrders = filteredOrders.filter(order => 
      order.customer.toLowerCase().includes(customer.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(customer.toLowerCase())
    );
  }

  res.json({
    orders: filteredOrders,
    total: filteredOrders.length
  });
});

// Get order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

// Create new order
router.post('/', (req, res) => {
  const { customer, customerEmail, products, paymentMethod, affiliate } = req.body;

  if (!customer || !customerEmail || !products || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const commission = affiliate ? total * 0.05 : 0; // 5% commission

  const newOrder = {
    id: orders.length + 1,
    customer,
    customerEmail,
    products,
    total,
    status: 'pending',
    paymentMethod,
    affiliate: affiliate || null,
    commission,
    createdAt: new Date().toISOString().split('T')[0]
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

// Update order status
router.put('/:id/status', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  orders[orderIndex].status = status;

  res.json(orders[orderIndex]);
});

// Get order statistics
router.get('/stats/summary', (req, res) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalCommission = orders.reduce((sum, order) => sum + order.commission, 0);
  
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalOrders,
    totalRevenue,
    totalCommission,
    statusCounts
  });
});

module.exports = router; 