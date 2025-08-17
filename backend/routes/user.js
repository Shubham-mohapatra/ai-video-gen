const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validateRequest } = require('../middleware/validation');

// Simple user routes for demo purposes
// In production, you'd want proper authentication, database, etc.

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register user
router.post('/register', 
  validateRequest(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;
    
    // In production, hash password and save to database
    // For demo, just return success
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: 'demo-user-id',
        email,
        name
      }
    });
  })
);

// Login user
router.post('/login', 
  validateRequest(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // In production, verify credentials against database
    // For demo, just return success
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: 'demo-user-id',
        email,
        name: 'Demo User'
      },
      token: 'demo-jwt-token'
    });
  })
);

// Get user profile
router.get('/profile', 
  asyncHandler(async (req, res) => {
    // In production, verify JWT token and get user from database
    
    res.json({
      success: true,
      user: {
        id: 'demo-user-id',
        email: 'demo@example.com',
        name: 'Demo User',
        createdAt: new Date(),
        videosGenerated: 0,
        plan: 'free'
      }
    });
  })
);

module.exports = router;
