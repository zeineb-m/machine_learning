import { GrandLivre } from "../models/GrandLivre.js";
import Bilan from "../models/Bilans.js";
import { spawn } from "child_process";
import path from "path";

export const predictCashFlow = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const grandLivre = await GrandLivre.findOne({ project: projectId });
    const bilan = await Bilan.findOne({ projectId });

    if (!grandLivre || !bilan) {
      return res.status(404).json({ message: "Missing data for prediction" });
    }

    // Sum Crédit (cash in)
    const cashIn = grandLivre.entries
      .filter(e => e.credit && parseFloat(e.credit) > 0)
      .reduce((acc, e) => acc + parseFloat(e.credit), 0);

    // Sum Débit (cash out)
    const cashOut = grandLivre.entries
      .filter(e => e.debit && parseFloat(e.debit) > 0)
      .reduce((acc, e) => acc + parseFloat(e.debit), 0);

    // Liquidity from ACTIF
    const actif = bilan.bilanData?.ACTIF || {};
    const currentLiquidity =
      (parseFloat(actif.Banque) || 0) +
      (parseFloat(actif.Caisse) || 0);

    const netFlow = cashIn - cashOut;
    const nextMonthPrediction = currentLiquidity + netFlow;

    // Group monthly net flows
    const grouped = {};
    
    console.log(`Found ${grandLivre.entries.length} entries in Grand Livre`);
    
    for (const entry of grandLivre.entries) {
      if (!entry.date) {
        console.log("Entry missing date:", entry);
        continue;
      }
      
      try {
        const date = new Date(entry.date);
        if (isNaN(date.getTime())) {
          console.log("Invalid date:", entry.date);
          continue;
        }
        
        const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
        const credit = parseFloat(entry.credit) || 0;
        const debit = parseFloat(entry.debit) || 0;
        const net = credit - debit;
        
        grouped[month] = (grouped[month] || 0) + net;
      } catch (e) {
        console.log("Error processing entry:", e.message, entry);
      }
    }

    console.log("Grouped data:", grouped);
    
    // Make sure we have at least 2 months of data
    if (Object.keys(grouped).length < 2) {
      // Add dummy data if needed (just for testing)
      const today = new Date();
      const thisMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}`;
      const lastMonth = `${today.getFullYear()}-${(today.getMonth()).toString().padStart(2, "0")}`;
      
      if (!grouped[thisMonth]) grouped[thisMonth] = netFlow || 1000;
      if (!grouped[lastMonth]) grouped[lastMonth] = netFlow * 0.9 || 900;
      
      console.log("Added dummy data to have at least 2 months:", grouped);
    }

    const formattedData = Object.entries(grouped).map(([month, net]) => ({
      ds: `${month}-01`, // First day of the month
      y: net,
    }));

    console.log("Sending to Python:", JSON.stringify(formattedData));

    // Use path to ensure script loads correctly
    const scriptPath = path.join(process.cwd(), "python", "predict_cashflow.py");

    const python = spawn("python", [scriptPath, JSON.stringify(formattedData)]);

    let output = "";
    python.stdout.on("data", data => {
      const chunk = data.toString();
      output += chunk;
      console.log("Python stdout:", chunk);
    });
    
    python.stderr.on("data", err => {
      // This is now used for logging/debugging messages
      console.log("🐍 Python Log:", err.toString());
    });

    python.on("close", code => {
      console.log(`Python process exited with code ${code}`);
      
      try {
        // Trim any whitespace that might cause JSON parsing issues
        const cleanOutput = output.trim();
        console.log("Clean output for parsing:", cleanOutput);
        
        const aiPredictions = JSON.parse(cleanOutput);

        if (aiPredictions.error) {
          throw new Error(aiPredictions.error);
        }

        const response = {
          projectId,
          currentLiquidity,
          cashIn,
          cashOut,
          netFlow,
          predictedNextMonthCash: nextMonthPrediction,
          aiForecast: aiPredictions,
        };

        res.status(200).json(response);
      } catch (e) {
        console.error("🛑 Prediction parse error:", e.message, "Raw output:", output);
        res.status(500).json({ message: "AI prediction error", error: e.message });
      }
    });

  } catch (error) {
    console.error("🔥 Cash Flow Prediction Error:", error.message);
    res.status(500).json({ message: "Error predicting cash flow", error });
  }
};