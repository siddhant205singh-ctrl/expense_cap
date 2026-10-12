import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Category from '../models/Category.js';

export const createWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, data: wallet });
});

export const getWallets = asyncHandler(async (req, res) => {
  const wallets = await Wallet.find({ user: req.user.id, isArchived: false });
  res.status(200).json({ success: true, data: wallets });
});

export const getWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOne({ _id: req.params.id, user: req.user.id });
  if (!wallet) throw new ApiError(404, 'Wallet not found');
  res.status(200).json({ success: true, data: wallet });
});

export const updateWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!wallet) throw new ApiError(404, 'Wallet not found');
  res.status(200).json({ success: true, data: wallet });
});

export const deleteWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isArchived: true },
    { new: true }
  );
  if (!wallet) throw new ApiError(404, 'Wallet not found');
  res.status(200).json({ success: true, data: {} });
});

export const transferBetweenWallets = asyncHandler(async (req, res) => {
  const { fromWalletId, toWalletId, amount, note, date } = req.body;

  const fromWallet = await Wallet.findOne({ _id: fromWalletId, user: req.user.id });
  const toWallet = await Wallet.findOne({ _id: toWalletId, user: req.user.id });

  if (!fromWallet || !toWallet) {
    throw new ApiError(404, 'One or both wallets not found');
  }

  if (fromWallet.balance < amount) {
    throw new ApiError(400, 'Insufficient balance in source wallet');
  }

  // Create a system category for transfer if not exists
  let transferCategory = await Category.findOne({ user: req.user.id, name: 'Transfer', type: 'both' });
  if (!transferCategory) {
    transferCategory = await Category.create({
      user: req.user.id, name: 'Transfer', emoji: '🔄', type: 'both', color: '#808080', isSystem: true
    });
  }

  const transactionDate = date ? new Date(date) : new Date();

  const expenseTx = await Transaction.create({
    user: req.user.id,
    wallet: fromWallet._id,
    category: transferCategory._id,
    type: 'expense',
    amount,
    note: note || `Transfer to ${toWallet.name}`,
    date: transactionDate,
    toWallet: toWallet._id
  });

  const incomeTx = await Transaction.create({
    user: req.user.id,
    wallet: toWallet._id,
    category: transferCategory._id,
    type: 'income',
    amount,
    note: note || `Transfer from ${fromWallet.name}`,
    date: transactionDate
  });

  fromWallet.balance -= amount;
  toWallet.balance += amount;

  await fromWallet.save();
  await toWallet.save();

  res.status(200).json({ success: true, data: { expenseTx, incomeTx, fromWallet, toWallet } });
});
