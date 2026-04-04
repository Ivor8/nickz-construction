import express from 'express';
import { body, validationResult } from 'express-validator';
import SiteSetting from '../models/SiteSetting.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await SiteSetting.find();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get setting by key (public)
router.get('/:key', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update setting (admin)
router.put('/:key', [
  authMiddleware,
  body('value').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { value } = req.body;

    const setting = await SiteSetting.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true }
    );

    res.json({
      message: 'Setting saved successfully',
      setting
    });
  } catch (error) {
    console.error('Save setting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete setting (admin)
router.delete('/:key', authMiddleware, async (req, res) => {
  try {
    const setting = await SiteSetting.findOneAndDelete({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
