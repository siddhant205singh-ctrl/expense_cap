import mongoose from 'mongoose';

const repaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true }, // in cents
  date: { type: Date, default: Date.now },
  note: { type: String }
});

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['borrowed', 'lent'], required: true },
  counterparty: { type: String, required: true },
  principal: { type: Number, required: true }, // in cents
  repayments: [repaymentSchema],
  dueDate: { type: Date, required: true },
  note: { type: String },
  isSettled: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

loanSchema.virtual('remaining').get(function() {
  const totalRepaid = this.repayments.reduce((sum, r) => sum + r.amount, 0);
  return this.principal - totalRepaid;
});

export default mongoose.model('Loan', loanSchema);
