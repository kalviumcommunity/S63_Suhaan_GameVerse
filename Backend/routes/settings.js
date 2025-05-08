const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

// Get user settings
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    res.json(user.settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update user settings
router.put('/', auth, async (req, res) => {
  try {
    const { notifications, emailUpdates, language, privacy } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update settings
    user.settings = {
      ...user.settings,
      notifications: notifications !== undefined ? notifications : user.settings.notifications,
      emailUpdates: emailUpdates !== undefined ? emailUpdates : user.settings.emailUpdates,
      language: language || user.settings.language,
      privacy: privacy || user.settings.privacy,
    };

    await user.save();
    res.json(user.settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

module.exports = router; 