import mongoose from "mongoose";

const varianceItemSchema = new mongoose.Schema({
  compte: {
    type: String,
    required: true,
    trim: true,
  },
  categorie: {
    type: String,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  montantPrevu: {
    type: Number,
    required: true,
    min: 0,
  },
  montantReel: {
    type: Number,
    required: true,
    min: 0,
  },
  ecart: {
    type: Number,
    required: true,
  },
  ecartPourcentage: {
    type: Number,
    required: true,
  },
  trimestre: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  annee: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100,
  }
});

const budgetVarianceSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
  items: [varianceItemSchema],
  totalPrevu: {
    type: Number,
    default: 0,
  },
  totalReel: {
    type: Number,
    default: 0,
  },
  ecartTotal: {
    type: Number,
    default: 0,
  },
  ecartPourcentageTotal: {
    type: Number,
    default: 0,
  }
});

export const BudgetVariance = mongoose.model("BudgetVariance", budgetVarianceSchema); 