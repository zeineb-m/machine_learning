import express from 'express';
import {
  createAccountingTask,
  getAccountingTask,
  updateAccountingTask,
  deleteAccountingTask
} from '../controllers/AccountingTask.js';


const router = express.Router();



router.post('/', createAccountingTask);
router.get('/', getAccountingTask);
router.put('/:taskId', updateAccountingTask);
router.delete('/:taskId', deleteAccountingTask);

export default router;
