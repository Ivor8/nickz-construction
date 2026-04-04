import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadProjectImages } from '../middleware/upload.js';

const router = express.Router();

// Get all active projects (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { is_active: true };
    
    if (category && category !== 'All') {
      filter.category = category;
    }

    const projects = await Project.find(filter).sort({ created_at: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, is_active: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all projects (admin)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort({ created_at: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project (admin)
router.post('/', [
  authMiddleware,
  uploadProjectImages,
  body('title').trim().notEmpty(),
  body('category').isIn(['Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Institutional']),
  body('short_description').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('location').trim().notEmpty(),
  body('is_featured').optional().isBoolean(),
  body('completed_date').optional().isISO8601().toDate(),
  body('highlights').optional().custom((value) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
], async (req, res) => {
  try {
    console.log('Create project request body:', req.body);
    console.log('Create project files:', req.files);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      slug,
      category,
      short_description,
      description,
      location,
      is_featured = false,
      completed_date,
      highlights = []
    } = req.body;

    // Parse JSON strings if needed
    let parsedHighlights = highlights;
    
    try {
      if (typeof highlights === 'string') {
        parsedHighlights = JSON.parse(highlights);
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return res.status(400).json({ message: 'Invalid JSON in highlights' });
    }

    const images = req.files ? req.files.map(file => `/uploads/projects/${file.filename}`) : [];

    const project = new Project({
      title,
      slug,
      category,
      short_description,
      description,
      location,
      images,
      is_featured,
      completed_date,
      highlights: parsedHighlights
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    console.error('Error stack:', error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Project with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project (admin)
router.put('/:id', [
  authMiddleware,
  uploadProjectImages,
  body('title').optional().trim().notEmpty(),
  body('category').optional().isIn(['Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Institutional']),
  body('short_description').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('location').optional().trim().notEmpty(),
  body('is_featured').optional().isBoolean(),
  body('completed_date').optional().isISO8601().toDate(),
  body('highlights').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = req.body;
    
    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/projects/${file.filename}`);
      updateData.images = newImages;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Project with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
