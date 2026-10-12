import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['cash', 'bank', 'mobile_banking', 'card'], required: true },
  balance: { type: Number, required: true, default: 0 }, // in cents
  color: { type: String, required: true },
  icon: { type: String, required: true },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

walletSchema.virtual('formattedBalance').get(function() {
  return (this.balance / 100).toFixed(2);
});

export default mongoose.model('Wallet', walletSchema);
