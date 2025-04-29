import multer from "multer";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { v4 as uuidv4 } from "uuid";
import { File } from "../models/File.js";
import { User } from "../models/User.js";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files/"); 
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); 
  },
});


export const uploadMiddleware = multer({ storage }).single("file");

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    
    const fileUrl = `/files/${req.file.filename}`;

    const newFile = new File({
      title: req.body.title,
      description: req.body.description,
      url: fileUrl,
      project: req.body.project,
      user: req.body.user, 
    });

    await newFile.save();
    res.status(201).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error });
  }
};


export const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving file", error });
  }
};

export const getUserWithFiles = async (req, res) => {
  const userId = req.params.id;
  try {
    // Trouver l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer tous les fichiers de cet utilisateur
    const files = await File.find({ user: userId });

    res.status(200).json({ ...user.toObject(), files });
  } catch (error) {
    console.error("Error fetching user with files:", error);
    res.status(500).json({ message: "Error fetching user with files", error });
  }
};


export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving files", error });
  }
};


export const readCSV = async (req, res) => {
  try {
    
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    
    const filePath = `.${file.url}`;

    
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        
        res.status(200).json(results);
      })
      .on("error", (error) => {
        res.status(500).json({ message: "Error parsing CSV file", error });
      });
  } catch (error) {
    res.status(500).json({ message: "Error reading CSV file", error });
  }
};
export const editFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const existingFile = await File.findById(fileId);
    if (!existingFile) {
      return res.status(404).json({ message: "File not found" });
    }

  
    if (req.file) {
      const oldFilePath = `.${existingFile.url}`;
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error("Error deleting old file:", err);
        }
      });
      const newFileUrl = `/files/${req.file.filename}`;
      existingFile.url = newFileUrl;
    }
    if (req.body.title) existingFile.title = req.body.title;
    if (req.body.description) existingFile.description = req.body.description;
    if (req.body.project) existingFile.project = req.body.project;

    await existingFile.save();
    res.status(200).json({ message: "File updated successfully", file: existingFile });
  } catch (error) {
    res.status(500).json({ message: "Error updating file", error });
  }
};
export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileToDelete = await File.findById(fileId);
    if (!fileToDelete) {
      return res.status(404).json({ message: "File not found" });
    }
    const filePath = `.${fileToDelete.url}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file from disk:", err);
      }
    });

    await File.findByIdAndDelete(fileId);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error });
  }
};
