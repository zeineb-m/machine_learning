import express from 'express';
import { askChatbot } from '../controllers/ChatbotController.js';

const router = express.Router();

router.post('/chatbot', askChatbot);

export default router;
