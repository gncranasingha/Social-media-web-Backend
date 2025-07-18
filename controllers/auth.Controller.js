const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
require('dotenv').config();

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Handle profile picture
    let profilePicturePath = null;
    if (req.file) {
      profilePicturePath = req.file.path.replace(/\\/g, '/'); // Convert to forward slashes for consistency
    }
    
    // Create user
    const userId = await User.create({
      username,
      email,
      password: hashedPassword,
      profile_picture: profilePicturePath
    });

    // Generate JWT
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      token,
      user: {
        id: userId,
        username,
        email,
        profile_picture: profilePicturePath
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   POST /api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login };
