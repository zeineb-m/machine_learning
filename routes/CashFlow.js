import express from "express";
import { predictCashFlow } from "../controllers/CashFlow.js";

const router = express.Router();

// Route: GET /api/cashflow/predict/:projectId
router.get("/predict/:projectId", predictCashFlow);

export default router;
