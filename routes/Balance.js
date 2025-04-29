import express from "express";
import {
  getBalanceGenerale,
  generateAndSaveBalanceGenerale
} from "../controllers/Balance.js";

const router = express.Router();

router.post("/:projectId", generateAndSaveBalanceGenerale);
router.get("/:projectId", getBalanceGenerale);

export default router;
