import mongoose from "mongoose";

const balanceLineSchema = new mongoose.Schema({
  compte: { type: String, required: true },
  totalDebit: { type: Number, default: 0 },
  totalCredit: { type: Number, default: 0 },
  soldeDebiteur: { type: Number, default: 0 },
  soldeCrediteur: { type: Number, default: 0 },
});

const balanceSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lines: [balanceLineSchema],
});

export const Balance = mongoose.model("Balance", balanceSchema);
