import fs from "fs";
import csv from "csv-parser";
import { File } from "../models/File.js";

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