import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import AdminProfile from '../models/AdminProfile.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find admin by email
    const admin = await AdminProfile.findOne({ email });
    if (!admin || !admin.is_active) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return admin data without password
    const adminData = {
      id: admin._id,
      full_name: admin.full_name,
      email: admin.email,
      role: admin.role,
      is_active: admin.is_active
    };

    res.json({
      message: 'Login successful',
      token,
      admin: adminData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current admin profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const adminData = {
      id: req.admin._id,
      full_name: req.admin.full_name,
      email: req.admin.email,
      role: req.admin.role,
      is_active: req.admin.is_active
    };

    res.json({ admin: adminData });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create admin (super admin only)
router.post('/create', [
  authMiddleware,
  body('full_name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'super_admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { full_name, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await AdminProfile.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Create new admin
    const admin = new AdminProfile({
      full_name,
      email,
      password,
      role
    });

    await admin.save();

    const adminData = {
      id: admin._id,
      full_name: admin.full_name,
      email: admin.email,
      role: admin.role,
      is_active: admin.is_active
    };

    res.status(201).json({
      message: 'Admin created successfully',
      admin: adminData
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
