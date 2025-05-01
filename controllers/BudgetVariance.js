import { Budget } from "../models/Budget.js";
import { GrandLivre } from "../models/GrandLivre.js";
import { BudgetVariance } from "../models/BudgetVariance.js";
import { Project } from "../models/Project.js";
import ExcelJS from "exceljs";

// Generate budget variance analysis
export const generateBudgetVariance = async (req, res) => {
  try {
    const { projectId, dateDebut, dateFin, trimestre, annee } = req.body;

    if (!projectId || !trimestre || !annee) {
      return res.status(400).json({ 
        message: "Project ID, trimestre, and année are required" 
      });
    }

    // Validate project existence
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get budget for the project
    const budget = await Budget.findOne({ project: projectId });
    if (!budget) {
      return res.status(404).json({ 
        message: "Budget not found for this project. Please create a budget first." 
      });
    }

    // Filter budget items by trimestre and année
    const budgetItems = budget.items.filter(
      item => item.trimestre === parseInt(trimestre) && item.annee === parseInt(annee)
    );

    if (budgetItems.length === 0) {
      return res.status(404).json({ 
        message: `No budget items found for trimestre ${trimestre} and année ${annee}` 
      });
    }

    // Get Grand Livre entries for the project
    const grandLivre = await GrandLivre.findOne({ project: projectId });
    if (!grandLivre) {
      return res.status(404).json({ 
        message: "Grand Livre not found for this project" 
      });
    }

    // Filter Grand Livre entries by date range if provided
    let filteredGrandLivreEntries = grandLivre.entries;
    if (dateDebut && dateFin) {
      const startDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
      
      filteredGrandLivreEntries = grandLivre.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });
    }

    // Calculate variances
    const varianceItems = [];
    let totalPrevu = 0;
    let totalReel = 0;
    let ecartTotal = 0;

    // Group Grand Livre entries by compte
    const groupedGrandLivreEntries = {};
    filteredGrandLivreEntries.forEach(entry => {
      if (!groupedGrandLivreEntries[entry.compte]) {
        groupedGrandLivreEntries[entry.compte] = {
          debit: 0,
          credit: 0
        };
      }
      groupedGrandLivreEntries[entry.compte].debit += entry.debit || 0;
      groupedGrandLivreEntries[entry.compte].credit += entry.credit || 0;
    });

    // Calculate variances for each budget item
    budgetItems.forEach(budgetItem => {
      const { compte, categorie, designation, montantPrevu } = budgetItem;
      
      // Find corresponding entries in Grand Livre
      const grandLivreData = groupedGrandLivreEntries[compte] || { debit: 0, credit: 0 };
      
      // Calculate actual amount (usually debit - credit for expenses, but can be adjusted as needed)
      const montantReel = grandLivreData.debit - grandLivreData.credit;
      
      // Calculate variance
      const ecart = montantReel - montantPrevu;
      const ecartPourcentage = montantPrevu !== 0 ? (ecart / montantPrevu) * 100 : 0;
      
      // Add to totals
      totalPrevu += montantPrevu;
      totalReel += montantReel;
      ecartTotal += ecart;

      // Add item to variance items
      varianceItems.push({
        compte,
        categorie,
        designation,
        montantPrevu,
        montantReel,
        ecart,
        ecartPourcentage,
        trimestre: parseInt(trimestre),
        annee: parseInt(annee)
      });
    });

    // Calculate total variance percentage
    const ecartPourcentageTotal = totalPrevu !== 0 ? (ecartTotal / totalPrevu) * 100 : 0;

    // Create or update Budget Variance document
    const budgetVarianceData = {
      project: projectId,
      dateDebut: dateDebut ? new Date(dateDebut) : new Date(),
      dateFin: dateFin ? new Date(dateFin) : new Date(),
      items: varianceItems,
      totalPrevu,
      totalReel,
      ecartTotal,
      ecartPourcentageTotal
    };

    // Check if a budget variance analysis already exists for this project, trimestre, and année
    let budgetVariance = await BudgetVariance.findOne({ 
      project: projectId,
      "items.trimestre": parseInt(trimestre),
      "items.annee": parseInt(annee)
    });

    if (budgetVariance) {
      // Update existing budget variance
      budgetVariance.dateDebut = budgetVarianceData.dateDebut;
      budgetVariance.dateFin = budgetVarianceData.dateFin;
      budgetVariance.items = budgetVarianceData.items;
      budgetVariance.totalPrevu = budgetVarianceData.totalPrevu;
      budgetVariance.totalReel = budgetVarianceData.totalReel;
      budgetVariance.ecartTotal = budgetVarianceData.ecartTotal;
      budgetVariance.ecartPourcentageTotal = budgetVarianceData.ecartPourcentageTotal;
      
      await budgetVariance.save();
    } else {
      // Create new budget variance
      budgetVariance = new BudgetVariance(budgetVarianceData);
      await budgetVariance.save();
    }

    return res.status(200).json({ 
      message: "Budget variance analysis generated successfully", 
      budgetVariance 
    });
  } catch (error) {
    console.error("Error in generateBudgetVariance:", error);
    return res.status(500).json({ 
      message: "Error generating budget variance analysis", 
      error: error.message 
    });
  }
};

// Get budget variance by project ID
export const getBudgetVarianceByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { trimestre, annee } = req.query;
    
    let query = { project: projectId };
    
    // Add trimestre and année to query if provided
    if (trimestre && annee) {
      query["items.trimestre"] = parseInt(trimestre);
      query["items.annee"] = parseInt(annee);
    }
    
    const budgetVariance = await BudgetVariance.findOne(query);
    
    if (!budgetVariance) {
      return res.status(404).json({ 
        message: "Budget variance analysis not found for this project" 
      });
    }
    
    return res.status(200).json(budgetVariance);
  } catch (error) {
    console.error("Error in getBudgetVarianceByProject:", error);
    return res.status(500).json({ 
      message: "Error retrieving budget variance analysis", 
      error: error.message 
    });
  }
};

// Export budget variance to Excel
export const exportBudgetVarianceToExcel = async (req, res) => {
  try {
    const { budgetVarianceId } = req.params;
    
    const budgetVariance = await BudgetVariance.findById(budgetVarianceId);
    if (!budgetVariance) {
      return res.status(404).json({ message: "Budget variance analysis not found" });
    }
    
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Suivi des écarts budgétaires");
    
    // Add headers
    worksheet.columns = [
      { header: "Compte", key: "compte", width: 15 },
      { header: "Catégorie", key: "categorie", width: 20 },
      { header: "Désignation", key: "designation", width: 30 },
      { header: "Montant prévu", key: "montantPrevu", width: 15 },
      { header: "Montant réel", key: "montantReel", width: 15 },
      { header: "Écart", key: "ecart", width: 15 },
      { header: "Écart (%)", key: "ecartPourcentage", width: 15 }
    ];
    
    // Style headers
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" }
    };
    worksheet.getRow(1).font = { color: { argb: "FFFFFFFF" } };
    
    // Add data
    budgetVariance.items.forEach(item => {
      worksheet.addRow({
        compte: item.compte,
        categorie: item.categorie,
        designation: item.designation,
        montantPrevu: item.montantPrevu,
        montantReel: item.montantReel,
        ecart: item.ecart,
        ecartPourcentage: `${item.ecartPourcentage.toFixed(2)}%`
      });
    });
    
    // Add totals row
    const totalRow = worksheet.addRow({
      compte: "",
      categorie: "",
      designation: "TOTAL",
      montantPrevu: budgetVariance.totalPrevu,
      montantReel: budgetVariance.totalReel,
      ecart: budgetVariance.ecartTotal,
      ecartPourcentage: `${budgetVariance.ecartPourcentageTotal.toFixed(2)}%`
    });
    
    // Style totals row
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE9EDF5" }
    };
    
    // Format cells
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      
      // Format numbers with currency
      row.getCell("montantPrevu").numFmt = "#,##0.00 ₹";
      row.getCell("montantReel").numFmt = "#,##0.00 ₹";
      row.getCell("ecart").numFmt = "#,##0.00 ₹";
      
      // Add conditional formatting for écart
      const ecartCell = row.getCell("ecart");
      if (ecartCell.value < 0) {
        ecartCell.font = { color: { argb: "FFFF0000" } }; // Red for negative values
      } else {
        ecartCell.font = { color: { argb: "FF008000" } }; // Green for positive values
      }
    }
    
    // Generate file
    const fileName = `budget_variance_${budgetVarianceId}.xlsx`;
    const filePath = `files/${fileName}`;
    
    await workbook.xlsx.writeFile(filePath);
    
    // Send file as response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    // Delete file after sending
    fileStream.on("end", () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("Error in exportBudgetVarianceToExcel:", error);
    return res.status(500).json({ 
      message: "Error exporting budget variance to Excel", 
      error: error.message 
    });
  }
}; 