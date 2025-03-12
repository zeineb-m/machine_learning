import express from "express";
import {
  getAllFiles,
  getFile,
  uploadCSV,
  uploadMiddleware,
  readCSV,
  editFile,
  deleteFile,
} from "../controllers/Files.js";

const router = express.Router();

router.post("/addfile", uploadMiddleware, uploadCSV);
router.get("/:id", getFile);
router.get("/", getAllFiles);
router.get("/:id/csv", readCSV);
router.put("/editfile/:id", uploadMiddleware, editFile);
router.delete("/deletefile/:id", deleteFile);

export default router;
