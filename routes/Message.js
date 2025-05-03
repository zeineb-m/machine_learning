import express from 'express';
import { sendMessage, getMessagesForProject, markMessageAsRead } from '../controllers/Message.js';

const router = express.Router();

// Send a new message
router.post('/', sendMessage);

// Get all messages for a project
router.get('/project/:projectId', getMessagesForProject);

// Mark a message as read
router.patch('/:messageId/read', markMessageAsRead);

export default router;
