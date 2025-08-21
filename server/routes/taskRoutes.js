import express from "express";
import { verifyToken } from "../middleware/auth";
import { createTask, deleteTask, getGroupTasks, updateTask, updateTaskStatus } from "../controllers/taskControllers";

const router = express.Router();

router.post('/', verifyToken, createTask);
router.delete('/:id/delete', verifyToken, deleteTask);
router.put('/:id/update',verifyToken,updateTask);
router.put('/:id/status',verifyToken,updateTaskStatus);
router.get('/:id',verifyToken,getGroupTasks);

export default router;