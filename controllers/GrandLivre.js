import fs from "fs";
import csv from "csv-parser";
import { File } from "../models/File.js";
import { GrandLivre } from "../models/GrandLivre.js";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export const readCSV = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const files = await File.find({ project: projectId });
        if (!files.length) {
            return res.status(404).json({ message: "No files found for this project" });
        }

        let generalLedger = [];

        for (const file of files) {
            const filePath = `.${file.url}`;
            
            const results = await new Promise((resolve, reject) => {
                let fileData = [];
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on("data", (data) => fileData.push(data))
                    .on("end", () => resolve(fileData))
                    .on("error", (error) => reject(error));
            });

            generalLedger = [...generalLedger, ...results];
        }

        res.status(200).json(generalLedger);
    } catch (error) {
        console.error("Error processing Grand Livre:", error);
        res.status(500).json({ message: "Error reading CSV files", error });
    }
};

// PDF generation helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// controllers/GrandLivre.js

export const saveGrandLivreToDB = async (req, res) => {
    try {
      const { projectId, entries } = req.body;
  
      // Validate inputs
      if (!projectId || !entries || entries.length === 0) {
        return res.status(400).json({ message: "Project ID and entries are required." });
      }
  
      // Check if GrandLivre already exists for this project
      const existingGrandLivre = await GrandLivre.findOne({ project: projectId });
  
      if (existingGrandLivre) {
        return res.status(200).json({
          message: "Grand livre already exists for this project",
          grandLivre: existingGrandLivre,
        });
      }
  
      // Create new GrandLivre document
      const newGrandLivre = new GrandLivre({
        project: projectId,
        entries: entries,
      });
  
      // Save to DB
      await newGrandLivre.save();
  
      // Return success response
      res.status(201).json({
        message: "Grand livre saved successfully",
        grandLivre: newGrandLivre,
      });
    } catch (error) {
      console.error("Error saving Grand Livre:", error.message);
      res.status(500).json({
        message: "Failed to save Grand Livre",
        error: error.message,
      });
    }
  };
  