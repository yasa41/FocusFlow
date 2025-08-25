import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createTask, deleteTask, getGroupTasks, updateTask, updateTaskStatus,getMyTasks,getCreatedTasks } from "../controllers/taskControllers.js";

const router = express.Router();

router.post('/:id', verifyToken, createTask);
router.delete('/:id/delete', verifyToken, deleteTask);
router.put('/:id/update',verifyToken,updateTask);
router.put('/:id/status',verifyToken,updateTaskStatus);
router.get('/:id/group-tasks',verifyToken,getGroupTasks);
router.get('/my-tasks', verifyToken, getMyTasks);
router.get('/created-tasks', verifyToken, getCreatedTasks);


export default router;