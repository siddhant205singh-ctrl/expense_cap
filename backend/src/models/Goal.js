import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
  amount: { type: Number, required: true }, // in cents
  date: { type: Date, default: Date.now },
  note: { type: String }
});

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true }, // in cents
  savedAmount: { type: Number, default: 0 }, // in cents
  deadline: { type: Date, required: true },
  emoji: { type: String, required: true },
  color: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  contributions: [contributionSchema]
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
