import express from "express";
import { readCSV } from "../controllers/GrandLivre.js";

const router = express.Router();


router.get("/read-csv/:projectId", readCSV);

export default router;