import jwt from 'jsonwebtoken';
import AdminProfile from '../models/AdminProfile.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminProfile.findById(decoded.id).select('-password');
    
    if (!admin || !admin.is_active) {
      return res.status(401).json({ message: 'Invalid token or user not active.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Super admin only.' });
  }
  next();
};
