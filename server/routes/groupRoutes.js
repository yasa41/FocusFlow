import express from "express";
import { createGroup, deleteGroup, getGroupDetails, joinGroup, leaveGroup, removeMember, transferOwnership, updateGroup } from "../controllers/groupController.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//Routes specific to owner of the group
router.post('/', verifyToken, createGroup);
router.delete('/:id/delete', verifyToken, deleteGroup);
router.put('/:id/update', verifyToken, updateGroup);
router.delete('/:id/remove/:userId', verifyToken, removeMember);
router.put('/:id/transfer-ownership', verifyToken, transferOwnership);

//Routes accessible to all members

router.post('/join', verifyToken, joinGroup);
router.get('/:id/details', verifyToken, getGroupDetails);
router.post('/:id/leave', verifyToken, leaveGroup);

export default router;