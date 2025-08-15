import express from "express";
import { createGroup, deleteGroup, removeMember, transferOwnership, updateGroup } from "../controllers/groupController.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//Routes specific to owner of the group
router.post('/', verifyToken, createGroup);
router.delete('/:id/delete', verifyToken, deleteGroup);
router.put('/:id/update', verifyToken, updateGroup);
router.delete('/:id/remove/:userId', verifyToken, removeMember);
routes.put('/:id/transfer-ownership', verifyToken, transferOwnership);

//Routes accessible to all members

export default router;