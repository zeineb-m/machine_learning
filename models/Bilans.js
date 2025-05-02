import mongoose, { Schema } from "mongoose";

// Define the Bilan model without associated files
const Bilans = new Schema({
  projectId: {
    type: String, // Project ID associated with the bilan
    required: true,
    // unique: true
  },
  bilanData: {
    ACTIF: {
      type: Map,
      of: Schema.Types.Mixed, // Flexible data structure to store ACTIF bilan data
      required: true
    },
    PASSIF: {
      type: Map,
      of: Schema.Types.Mixed, // Flexible data structure to store PASSIF bilan data
      required: true
    },
    TOTAL: {
      type: Number, // Global total for the bilan
      // required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Bilan = mongoose.model("Bilan", Bilans);

export default Bilan;  