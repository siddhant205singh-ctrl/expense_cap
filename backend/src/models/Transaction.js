import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  amount: { type: Number, required: true }, // in cents
  note: { type: String, default: '' },
  date: { type: Date, required: true, default: Date.now },
  toWallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  isRecurring: { type: Boolean, default: false }
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, wallet: 1 });

export default mongoose.model('Transaction', transactionSchema);
