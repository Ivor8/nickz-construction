import express from 'express';
import { body, validationResult } from 'express-validator';
import Service from '../models/Service.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadServiceImage } from '../middleware/upload.js';

const router = express.Router();

// Get all active services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ is_active: true }).sort({ sort_order: 1 });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, is_active: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all services (admin)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const services = await Service.find().sort({ sort_order: 1 });
    res.json(services);
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service (admin)
router.post('/', [
  authMiddleware,
  uploadServiceImage,
  body('title').trim().notEmpty(),
  body('short_description').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('icon').optional().trim(),
  body('sort_order').optional().isInt(),
  body('benefits').optional().custom((value) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  }),
  body('process_steps').optional().custom((value) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
], async (req, res) => {
  try {
    console.log('Create service request body:', req.body);
    console.log('Create service file:', req.file);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      slug,
      short_description,
      description,
      icon = 'building',
      sort_order = 0,
      benefits = [],
      process_steps = []
    } = req.body;

    // Parse JSON strings if needed
    let parsedBenefits = benefits;
    let parsedProcessSteps = process_steps;
    
    try {
      if (typeof benefits === 'string') {
        parsedBenefits = JSON.parse(benefits);
      }
      if (typeof process_steps === 'string') {
        parsedProcessSteps = JSON.parse(process_steps);
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return res.status(400).json({ message: 'Invalid JSON in benefits or process_steps' });
    }

    const image_url = req.file ? `/uploads/services/${req.file.filename}` : '';

    const service = new Service({
      title,
      slug,
      short_description,
      description,
      image_url,
      icon,
      sort_order,
      benefits: parsedBenefits,
      process_steps: parsedProcessSteps
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    console.error('Error stack:', error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Service with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update service (admin)
router.put('/:id', [
  authMiddleware,
  uploadServiceImage,
  body('title').optional().trim().notEmpty(),
  body('short_description').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('icon').optional().trim(),
  body('sort_order').optional().isInt(),
  body('benefits').optional().isArray(),
  body('process_steps').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = req.body;
    
    // Update image if new file uploaded
    if (req.file) {
      updateData.image_url = `/uploads/services/${req.file.filename}`;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Service with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
