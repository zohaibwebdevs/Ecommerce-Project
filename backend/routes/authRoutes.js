// This file code defines authentication endpoints

const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes (require login)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;