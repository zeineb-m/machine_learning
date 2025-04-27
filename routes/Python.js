import express from 'express';

import { exportBilanExcel, generateBilan, getBilan ,saveBilan} from '../controllers/bilan.js';

const router = express.Router();
router.get('/bilan/:projectId', getBilan);
router.get('/generate-bilan', generateBilan);
router.post('/save-bilan', saveBilan);
router.get('/export-bilan-excel/:projectId', exportBilanExcel);


export default router;