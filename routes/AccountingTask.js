import express from 'express';
import {
  createAccountingTask,
  getAccountingTask,
  updateAccountingTask,
  deleteAccountingTask,
  getUpcomingTasks
} from '../controllers/AccountingTask.js';


const router = express.Router();



router.post('/', createAccountingTask);
router.get('/', getAccountingTask);
router.put('/:taskId', updateAccountingTask);
router.delete('/:taskId', deleteAccountingTask);
router.get('/upcoming', getUpcomingTasks);

export default router;
