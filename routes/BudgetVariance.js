import express from "express";
import {
  generateBudgetVariance,
  getBudgetVarianceByProject,
  exportBudgetVarianceToExcel
} from "../controllers/BudgetVariance.js";

const router = express.Router();

// POST - Generate budget variance analysis
router.post("/generate", generateBudgetVariance);

// GET - Get budget variance by project ID
router.get("/project/:projectId", getBudgetVarianceByProject);

// GET - Export budget variance to Excel
router.get("/export/:budgetVarianceId", exportBudgetVarianceToExcel);

export default router; 