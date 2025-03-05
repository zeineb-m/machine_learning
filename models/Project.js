import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate : {
    type: Date,
    required: true,
  } , 
  status : {
    type: String,
    required: true,
    default: "Not Started" ,
    enum: ["planned", "ongoing", "completed"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

export const Project = mongoose.model("Project", projectSchema);
