import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  CIN: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 8,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["accountant", "Project Manager","financial manager"," auditeur","manager controller","Employees" , "admin"],

  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  isDisabled: {
    type: Boolean,
    default: false, 
  },
  
  image: {
    data: Buffer,          
    contentType: String,   
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,

});

export const User = mongoose.model("User", userSchema);