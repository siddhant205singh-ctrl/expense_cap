import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  emoji: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense', 'both'], required: true },
  color: { type: String, required: true },
  isSystem: { type: Boolean, default: false }
}, { timestamps: true });

categorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);
