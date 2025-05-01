import express from "express";
import {
  createOrUpdateBudget,
  getBudgetByProject,
  uploadBudgetCSV,
  deleteBudget,
  uploadMiddleware
} from "../controllers/Budget.js";

const router = express.Router();

// POST - Create/update budget
router.post("/", createOrUpdateBudget);

// POST - Upload budget CSV
router.post("/upload", uploadMiddleware, uploadBudgetCSV);

// GET - Get budget by project ID
router.get("/project/:projectId", getBudgetByProject);

// DELETE - Delete budget
router.delete("/:budgetId", deleteBudget);

export default router; 