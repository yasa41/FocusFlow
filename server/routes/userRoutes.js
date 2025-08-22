import { updateProfile, getCurrentUser, getUserDashboard } from "../controllers/userController.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.put('/profile', verifyToken, updateProfile);
router.get('/me', verifyToken, getCurrentUser);
router.get('/dashboard',verifyToken,getUserDashboard);

export default router;