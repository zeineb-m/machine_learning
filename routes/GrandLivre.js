import express from "express";
import { readCSV, saveGrandLivreToDB  } from "../controllers/GrandLivre.js";

const router = express.Router();


router.get("/read-csv/:projectId", readCSV);
router.post("/save", saveGrandLivreToDB);

export default router;