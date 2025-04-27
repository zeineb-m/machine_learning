import mongoose from "mongoose";

// Define the schema for individual entries in the Grand Livre
const entrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,   // Date is important for accounting, should be required
  },
  ref: {
    type: String,
    trim: true,
    required: true,
  },
  libelle: {
    type: String,
    trim: true,
    required: true,
  },
  debit: {
    type: Number,
    default: 0,
    min: 0,  // Debit can't be negative
  },
  credit: {
    type: Number,
    default: 0,
    min: 0,  // Credit can't be negative
  },
  compte: {
    type: String,
    trim: true,
    required: true,
  },
});

// Schema for the Grand Livre document
const grandLivreSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,   // The Grand Livre is linked to a Project, so it's required
  },
  date: {
    type: Date,
    default: Date.now,   // Default to current date
  },
  entries: {
    type: [entrySchema],   // Array of entries
    validate: [arrayLimit, '{PATH} exceeds the limit of entries'],   // Ensure the array has a reasonable size
  },
});

// Optional: Array length validation to prevent too large arrays (you can adjust the limit as needed)
function arrayLimit(val) {
  return val.length <= 10000; // Limit the entries to 10,000 (you can adjust as per requirements)
}

// Export the model for use in controllers
export const GrandLivre = mongoose.model("GrandLivre", grandLivreSchema);