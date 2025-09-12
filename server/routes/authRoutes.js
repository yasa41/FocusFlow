import express from 'express';
import { register, login, logout } from '../controllers/authControllers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/logout', verifyToken, logout);

export default router;
