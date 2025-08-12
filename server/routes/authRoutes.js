import express from 'express';
import { register, login, logout, updateProfile } from '../controllers/authControllers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.post('/logout', verifyToken, logout);
router.put('/profile', verifyToken, updateProfile);

// Optional: Add a route to get current user info
router.get('/me', verifyToken, getCurrentUser);

export default router;
