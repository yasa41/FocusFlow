import { updateProfile, getCurrentUser, getUserDashboard, searchUser } from "../controllers/userController.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.put('/profile', verifyToken, updateProfile);
router.get('/me', verifyToken, getCurrentUser);
router.get('/dashboard',verifyToken,getUserDashboard);
router.get('/search',verifyToken,searchUser);

export default router;