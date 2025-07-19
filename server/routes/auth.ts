import express from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import { users } from '../../shared/schema.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'buyer' } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role: role as 'buyer' | 'seller' | 'affiliate' | 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Set session
    req.session.userId = newUser.id;
    req.session.userRole = newUser.role;

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await db.update(users)
      .set({ updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // Set session
    req.session.userId = user.id;
    req.session.userRole = user.role;

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.session.userId)).limit(1);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userResponse } = user;
    res.json({ user: userResponse });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Update profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const userId = req.session.userId;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const [updatedUser] = await db.update(users)
      .set({
        firstName,
        lastName,
        phone: phone || null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    const { password: _, ...userResponse } = updatedUser;
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get current user
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;