const User = require('../models/User.model');

// @route   GET /api/v1/users/profile
// @desc    Get the currently authenticated user's profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // Check if email exists
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updateData = {
      username: username || req.user.username,
      email: email || req.user.email
    };

    // Only store filename if file exists
    if (req.file) {
      updateData.profile_picture = req.file.filename; // Just the filename
    }

    await User.update(userId, updateData);
    const updatedUser = await User.findById(userId);
    
    res.json({
      ...updatedUser,
      // Return full URL for frontend
      profile_picture: req.file 
        ? `/uploads/profile-pictures/${req.file.filename}`
        : updatedUser.profile_picture
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserProfile, updateProfile };
