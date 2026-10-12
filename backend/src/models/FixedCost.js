import mongoose from 'mongoose';

const fixedCostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true }, // in cents
  frequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  nextDueDate: { type: Date, required: true },
  lastPaidDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('FixedCost', fixedCostSchema);
