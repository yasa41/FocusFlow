import express from 'express';
import { register, login, logout, updateProfile } from '../controllers/authControllers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.post('/logout', verifyToken, logout);

export default router;
