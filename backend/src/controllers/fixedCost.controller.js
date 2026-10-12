import FixedCost from '../models/FixedCost.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createFixedCost = asyncHandler(async (req, res) => {
  const fixedCost = await FixedCost.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, data: fixedCost });
});

export const getFixedCosts = asyncHandler(async (req, res) => {
  const fixedCosts = await FixedCost.find({ user: req.user.id }).populate('category').populate('wallet');
  res.status(200).json({ success: true, data: fixedCosts });
});

export const updateFixedCost = asyncHandler(async (req, res) => {
  const fixedCost = await FixedCost.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!fixedCost) throw new ApiError(404, 'Fixed cost not found');
  res.status(200).json({ success: true, data: fixedCost });
});

export const deleteFixedCost = asyncHandler(async (req, res) => {
  const fixedCost = await FixedCost.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!fixedCost) throw new ApiError(404, 'Fixed cost not found');
  res.status(200).json({ success: true, data: {} });
});

export const markAsPaid = asyncHandler(async (req, res) => {
  const fixedCost = await FixedCost.findOne({ _id: req.params.id, user: req.user.id });
  if (!fixedCost) throw new ApiError(404, 'Fixed cost not found');

  const walletDoc = await Wallet.findOne({ _id: fixedCost.wallet, user: req.user.id });
  if (!walletDoc) throw new ApiError(404, 'Wallet not found');

  const transaction = await Transaction.create({
    user: req.user.id,
    wallet: fixedCost.wallet,
    category: fixedCost.category,
    type: 'expense',
    amount: fixedCost.amount,
    note: `Auto-paid: ${fixedCost.name}`,
    date: new Date(),
    isRecurring: true
  });

  walletDoc.balance -= fixedCost.amount;
  await walletDoc.save();

  fixedCost.lastPaidDate = new Date();
  
  const currentDueDate = new Date(fixedCost.nextDueDate);
  let nextDate = new Date(currentDueDate);
  
  if (fixedCost.frequency === 'weekly') {
    nextDate.setDate(currentDueDate.getDate() + 7);
  } else if (fixedCost.frequency === 'monthly') {
    nextDate.setMonth(currentDueDate.getMonth() + 1);
  } else if (fixedCost.frequency === 'yearly') {
    nextDate.setFullYear(currentDueDate.getFullYear() + 1);
  }
  
  fixedCost.nextDueDate = nextDate;
  await fixedCost.save();

  res.status(200).json({ success: true, data: { fixedCost, transaction } });
});
