import express from 'express';
import cors from 'cors';
import session from 'express-session';
import ConnectPgSimple from 'connect-pg-simple';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import path from 'path';

// Import database schema
import * as schema from '../shared/schema.js';

const app = express();
const port = process.env.PORT || 80;

// Database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Session store
const PgSession = ConnectPgSimple(session);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'uzbek-marketplace-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));



// Import routes after middleware definitions
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import affiliateRoutes from './routes/affiliates.js';
import adminRoutes from './routes/admin.js';
import cartRoutes from './routes/cart.js';
import paymentRoutes from './routes/payments.js';
import analyticsRoutes from './routes/analytics.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files
if (process.env.NODE_ENV === 'production') {
  // Production mode
  app.use(express.static('dist/public'));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(process.cwd(), 'dist/public/index.html'));
  });
} else {
  // Development mode - serve built files
  app.use(express.static('dist/client'));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(process.cwd(), 'dist/client/index.html'));
  });
}

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 Frontend: http://localhost:5173`);
    console.log(`🔧 API: http://localhost:${port}/api`);
  }
});

export default app;