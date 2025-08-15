import { updateProfile, getCurrentUser } from "../controllers/userController.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.put('/profile', verifyToken, updateProfile);

router.get('/me', verifyToken, getCurrentUser);

export default router;