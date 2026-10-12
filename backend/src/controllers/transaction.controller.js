import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createTransaction = asyncHandler(async (req, res) => {
  const { wallet, type, amount } = req.body;
  
  const walletDoc = await Wallet.findOne({ _id: wallet, user: req.user.id });
  if (!walletDoc) throw new ApiError(404, 'Wallet not found');

  const transaction = await Transaction.create({ ...req.body, user: req.user.id });

  if (type === 'income') {
    walletDoc.balance += amount;
  } else if (type === 'expense') {
    walletDoc.balance -= amount;
  }
  await walletDoc.save();

  res.status(201).json({ success: true, data: transaction });
});

export const getTransactions = asyncHandler(async (req, res) => {
  const { startDate, endDate, category, wallet, type, search, page = 1, limit = 50 } = req.query;
  const query = { user: req.user.id };

  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (startDate) {
    query.date = { $gte: new Date(startDate) };
  } else if (endDate) {
    query.date = { $lte: new Date(endDate) };
  }

  if (category) query.category = category;
  if (wallet) query.wallet = wallet;
  if (type) query.type = type;
  if (search) query.note = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;

  const transactions = await Transaction.find(query)
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('category', 'name emoji color type')
    .populate('wallet', 'name icon color');

  const total = await Transaction.countDocuments(query);

  res.status(200).json({ 
    success: true, 
    data: transactions,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
  });
});

export const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id })
    .populate('category')
    .populate('wallet');
  
  if (!transaction) throw new ApiError(404, 'Transaction not found');
  res.status(200).json({ success: true, data: transaction });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
  if (!transaction) throw new ApiError(404, 'Transaction not found');

  const { amount: newAmount, category, note, date, isRecurring } = req.body;
  const oldAmount = transaction.amount;
  const type = transaction.type;

  if (newAmount !== undefined && newAmount !== oldAmount) {
    const walletDoc = await Wallet.findById(transaction.wallet);
    if (walletDoc) {
      if (type === 'income') {
        walletDoc.balance = walletDoc.balance - oldAmount + newAmount;
      } else if (type === 'expense') {
        walletDoc.balance = walletDoc.balance + oldAmount - newAmount;
      }
      await walletDoc.save();
    }
    transaction.amount = newAmount;
  }

  if (category) transaction.category = category;
  if (note !== undefined) transaction.note = note;
  if (date) transaction.date = date;
  if (isRecurring !== undefined) transaction.isRecurring = isRecurring;

  await transaction.save();
  res.status(200).json({ success: true, data: transaction });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
  if (!transaction) throw new ApiError(404, 'Transaction not found');

  const walletDoc = await Wallet.findById(transaction.wallet);
  if (walletDoc) {
    if (transaction.type === 'income') {
      walletDoc.balance -= transaction.amount;
    } else if (transaction.type === 'expense') {
      walletDoc.balance += transaction.amount;
    }
    await walletDoc.save();
  }

  await transaction.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
