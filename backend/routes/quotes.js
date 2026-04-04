import express from 'express';
import { body, validationResult } from 'express-validator';
import QuoteRequest from '../models/QuoteRequest.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create quote request (public)
router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('project_details').optional().trim(),
  body('budget_range').optional().trim(),
  body('timeline').optional().trim(),
  body('service_id').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, project_details, budget_range, timeline, service_id } = req.body;

    const quoteRequest = new QuoteRequest({
      name,
      email,
      phone,
      project_details,
      budget_range,
      timeline,
      service_id
    });

    await quoteRequest.save();
    res.status(201).json({
      message: 'Quote request submitted successfully',
      quoteRequest
    });
  } catch (error) {
    console.error('Create quote request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all quote requests (admin)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const quoteRequests = await QuoteRequest.find()
      .populate('service_id', 'title')
      .sort({ created_at: -1 });
    // Transform _id to id for frontend compatibility
    const transformedQuotes = quoteRequests.map(quote => ({
      ...quote.toObject(),
      id: quote._id.toString()
    }));
    res.json(transformedQuotes);
  } catch (error) {
    console.error('Get quote requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quote request (admin)
router.put('/:id', [
  authMiddleware,
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('project_details').optional().trim(),
  body('budget_range').optional().trim(),
  body('timeline').optional().trim(),
  body('service_id').optional().isMongoId(),
  body('is_read').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quoteRequest = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('service_id', 'title');

    if (!quoteRequest) {
      return res.status(404).json({ message: 'Quote request not found' });
    }

    res.json(quoteRequest);
  } catch (error) {
    console.error('Update quote request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quote request (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const quoteRequest = await QuoteRequest.findByIdAndDelete(req.params.id);
    if (!quoteRequest) {
      return res.status(404).json({ message: 'Quote request not found' });
    }
    res.json({ message: 'Quote request deleted successfully' });
  } catch (error) {
    console.error('Delete quote request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark quote request as read (admin)
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const quoteRequest = await QuoteRequest.findById(req.params.id);
    if (!quoteRequest) {
      return res.status(404).json({ message: 'Quote request not found' });
    }

    quoteRequest.is_read = true;
    await quoteRequest.save();

    res.json({
      message: 'Quote request marked as read',
      quoteRequest
    });
  } catch (error) {
    console.error('Mark quote request read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
