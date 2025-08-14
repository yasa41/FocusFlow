import { updateProfile, getCurrentUser } from "../controllers/userController";
import express from "express";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.put('/profile', verifyToken, updateProfile);

router.get('/me', verifyToken, getCurrentUser);

