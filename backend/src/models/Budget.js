import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true }, // in cents
  month: { type: String, required: true }, // YYYY-MM
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// spent will be computed dynamically, but keeping a virtual placeholder
budgetSchema.virtual('spent').get(function() {
  return this._spent || 0;
});

export default mongoose.model('Budget', budgetSchema);
