import mongoose from 'mongoose';

const accountingTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const AccountingTask = mongoose.model('AccountingTask', accountingTaskSchema);
export default AccountingTask;
