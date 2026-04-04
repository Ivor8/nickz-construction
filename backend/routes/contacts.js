import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create contact message (public)
router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().notEmpty(),
  body('phone').optional().trim(),
  body('subject').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await contact.save();
    res.status(201).json({
      message: 'Contact message sent successfully',
      contact
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contacts (admin)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ created_at: -1 });
    // Transform _id to id for frontend compatibility
    const transformedContacts = contacts.map(contact => ({
      ...contact.toObject(),
      id: contact._id.toString()
    }));
    res.json(transformedContacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact (admin)
router.put('/:id', [
  authMiddleware,
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('message').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('subject').optional().trim(),
  body('is_read').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark contact as read (admin)
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    contact.is_read = true;
    await contact.save();

    res.json({
      message: 'Contact marked as read',
      contact
    });
  } catch (error) {
    console.error('Mark contact read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
