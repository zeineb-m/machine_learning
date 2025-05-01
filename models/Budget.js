import mongoose from "mongoose";

const budgetItemSchema = new mongoose.Schema({
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

const budgetSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
  },
  items: [budgetItemSchema]
});

// Pre-save hook to update the 'updatedAt' field
budgetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Budget = mongoose.model("Budget", budgetSchema); 