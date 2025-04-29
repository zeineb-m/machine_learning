import { GrandLivre } from "../models/GrandLivre.js";
import { Balance } from "../models/Balance.js";

export const generateAndSaveBalanceGenerale = async (req, res) => {
  try {
    const { projectId } = req.params;

    const grandLivre = await GrandLivre.findOne({ project: projectId });

    if (!grandLivre) {
      return res.status(404).json({ message: "Grand Livre not found." });
    }

    const balanceMap = {};

    for (const entry of grandLivre.entries) {
      const { compte, debit, credit } = entry;

      if (!balanceMap[compte]) {
        balanceMap[compte] = {
          compte,
          totalDebit: 0,
          totalCredit: 0,
        };
      }

      balanceMap[compte].totalDebit += debit;
      balanceMap[compte].totalCredit += credit;
    }

    const lines = Object.values(balanceMap).map(item => {
      const solde = item.totalDebit - item.totalCredit;
      return {
        compte: item.compte,
        totalDebit: item.totalDebit,
        totalCredit: item.totalCredit,
        soldeDebiteur: solde > 0 ? solde : 0,
        soldeCrediteur: solde < 0 ? -solde : 0,
      };
    });

    const existingBalance = await Balance.findOne({ project: projectId });
    if (existingBalance) {
      return res.status(200).json({ message: "Balance already exists.", balance: existingBalance });
    }

    const newBalance = new Balance({
      project: projectId,
      lines,
    });

    await newBalance.save();

    res.status(201).json({
      message: "Balance Générale saved successfully.",
      balance: newBalance,
    });

  } catch (error) {
    console.error("Error saving balance générale:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }

};


export const getBalanceGenerale = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      const balance = await Balance.findOne({ project: projectId });
  
      if (!balance) {
        return res.status(404).json({ message: "No balance found for this project." });
      }
  
      res.status(200).json({ balance });
    } catch (error) {
      console.error("Error fetching balance générale:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
