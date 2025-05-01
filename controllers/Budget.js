import { Budget } from "../models/Budget.js";
import { Project } from "../models/Project.js";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files/");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

export const uploadMiddleware = multer({ storage }).single("file");

// Create a new budget or update existing one
export const createOrUpdateBudget = async (req, res) => {
  try {
    const { project, description, items } = req.body;

    // Validate project existence
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if budget already exists for this project
    let budget = await Budget.findOne({ project });

    if (budget) {
      // Update existing budget
      budget.description = description || budget.description;
      budget.items = items || budget.items;
      budget.updatedAt = new Date();
      
      await budget.save();
      return res.status(200).json({ message: "Budget updated successfully", budget });
    } else {
      // Create new budget
      const newBudget = new Budget({
        project,
        description,
        items,
      });
      
      await newBudget.save();
      return res.status(201).json({ message: "Budget created successfully", budget: newBudget });
    }
  } catch (error) {
    console.error("Error in createOrUpdateBudget:", error);
    return res.status(500).json({ message: "Error creating/updating budget", error: error.message });
  }
};

// Get budget by project ID
export const getBudgetByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // First check if the project exists
    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    const budget = await Budget.findOne({ project: projectId });
    
    if (!budget) {
      // Instead of 404, return an empty budget object
      return res.status(200).json({ 
        project: projectId,
        items: [],
        description: "",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return res.status(200).json(budget);
  } catch (error) {
    console.error("Error in getBudgetByProject:", error);
    return res.status(500).json({ message: "Error retrieving budget", error: error.message });
  }
};

// Upload budget CSV file
export const uploadBudgetCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const projectId = req.body.project;
    
    // Validate project existence
    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
      // Delete uploaded file if project doesn't exist
      fs.unlinkSync(filePath);
      return res.status(404).json({ message: "Project not found" });
    }

    // Parse CSV file
    const budgetItems = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Validate required fields
        if (data["Numero de compte"] && data["Categorie"] && data["Designation"] && data["Montant prevu"] && data["Trimestre"] && data["Annee"]) {
          budgetItems.push({
            compte: data["Numero de compte"],
            categorie: data["Categorie"],
            designation: data["Designation"],
            montantPrevu: parseFloat(data["Montant prevu"]),
            trimestre: parseInt(data["Trimestre"]),
            annee: parseInt(data["Annee"])
          });
        }
      })
      .on("end", async () => {
        try {
          // Find or create budget
          let budget = await Budget.findOne({ project: projectId });
          
          if (budget) {
            // Update existing budget
            budget.items = budgetItems;
            budget.updatedAt = new Date();
            await budget.save();
          } else {
            // Create new budget
            budget = new Budget({
              project: projectId,
              description: `Budget imported from ${req.file.originalname}`,
              items: budgetItems
            });
            await budget.save();
          }
          
          // Delete the temporary file
          fs.unlinkSync(filePath);
          
          return res.status(200).json({ 
            message: "Budget CSV processed successfully", 
            budget,
            itemCount: budgetItems.length
          });
        } catch (err) {
          console.error("Error saving budget after CSV parsing:", err);
          return res.status(500).json({ message: "Error processing budget CSV", error: err.message });
        }
      })
      .on("error", (err) => {
        console.error("Error parsing CSV:", err);
        return res.status(500).json({ message: "Error parsing CSV file", error: err.message });
      });
  } catch (error) {
    console.error("Error in uploadBudgetCSV:", error);
    return res.status(500).json({ message: "Error uploading budget CSV", error: error.message });
  }
};

// Delete budget
export const deleteBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    
    const deletedBudget = await Budget.findByIdAndDelete(budgetId);
    
    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    
    return res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBudget:", error);
    return res.status(500).json({ message: "Error deleting budget", error: error.message });
  }
}; 