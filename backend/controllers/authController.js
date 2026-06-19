// Handles authentication logic

const user = require('../models/user');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d' // Token expires in 7 days
  });
};


// @desc  Register new user
// @rout  POST /api/auth/register
// @acess Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await user.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user.id);

    // Set cookie (HTTP-only for security)
    res.cookie('token', token, {
      httpOnly: true, // cannot be accessed by javascript (prevent XSS)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // Prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Login user
// @desc    POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  
}