import express from 'express';
import {
  createReclamation,
  getAllReclamations,
  getReclamationById,
  updateReclamation,
  deleteReclamation,
} from '../controllers/Reclamation.js';

const router = express.Router();

router.post('/', createReclamation);
router.get('/', getAllReclamations);
router.get('/:id', getReclamationById);
router.put('/:id', updateReclamation);
router.delete('/:id', deleteReclamation);

export default router;
