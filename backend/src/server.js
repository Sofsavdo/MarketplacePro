const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Database connection
const knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('../knexfile');

// Initialize database connection
const db = knex(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(db);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'AFFILIMART Backend API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/affiliate', require('./routes/affiliate'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/loyalty', require('./routes/loyalty'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/fraud', require('./routes/fraud'));
app.use('/api/smart-rewards', require('./routes/smartRewards'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/search', require('./routes/search'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AFFILIMART Backend Server running on port ${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app; 