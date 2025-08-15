import express from "express";
import { createGroup, deleteGroup } from "../controllers/groupController.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.post('/', verifyToken, createGroup);
router.delete('/delete/:id',verifyToken,deleteGroup);
export default router;