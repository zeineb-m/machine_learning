import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
});

export const File = mongoose.model("File", fileSchema);
