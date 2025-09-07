import express from 'express';
import { getMyConversations, getMyGroups, getPrivateMessages, getGroupMessages } from '../controllers/messageControllers.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();


router.get('/my-conversations', verifyToken, getMyConversations);
router.get('/my-groups', verifyToken, getMyGroups);
router.get('/private/:userId', verifyToken, getPrivateMessages);
router.get('/group/:groupId', verifyToken, getGroupMessages);

export default router;
