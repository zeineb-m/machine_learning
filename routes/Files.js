import express from "express";
import {
  getAllFiles,
  getFile,
  uploadCSV,
  uploadMiddleware,
  readCSV,
  editFile,
  deleteFile,
  getUserWithFiles,
} from "../controllers/Files.js";
import Bilan from "../models/Bilans.js";
import { evaluerSolvabilite } from "../controllers/bilan.js";
const router = express.Router();

router.post("/addfile", uploadMiddleware, uploadCSV);
router.get("/:id", getFile);
router.get("/", getAllFiles);
router.get("/get/:id", getUserWithFiles);
router.get("/:id/csv", readCSV);
router.put("/editfile/:id", uploadMiddleware, editFile);
router.delete("/deletefile/:id", deleteFile);
// Route pour obtenir les ratios de solvabilité
router.get('/solv/:projectId', async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ error: 'Le projectId est manquant' });
  }

  try {
    const bilan = await Bilan.findOne({ projectId });

    if (!bilan || !bilan.bilanData) {
      return res.status(404).json({ error: 'Aucun bilan trouvé pour ce projectId' });
    }

    const resultats = evaluerSolvabilite(bilan.bilanData);

    if (resultats.error) {
      return res.status(400).json({ error: resultats.error });
    }

    return res.json({
      projectId,
      solvabilite: resultats
    });

  } catch (err) {
    console.error('Erreur serveur:', err);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});
export default router;
