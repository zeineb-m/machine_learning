import mongoose from 'mongoose';

const reclamationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pending' },
  response: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

export const Reclamation = mongoose.model('Reclamation', reclamationSchema);