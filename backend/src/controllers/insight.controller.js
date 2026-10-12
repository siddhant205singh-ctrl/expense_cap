import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import Goal from '../models/Goal.js';
import Budget from '../models/Budget.js';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';

export const getSpendingByCategory = asyncHandler(async (req, res) => {
  const { month } = req.query; // YYYY-MM
  const matchQuery = { user: new mongoose.Types.ObjectId(req.user.id), type: 'expense' };

  if (month) {
    const [year, monthStr] = month.split('-');
    const startDate = new Date(year, parseInt(monthStr) - 1, 1);
    const endDate = new Date(year, parseInt(monthStr), 0, 23, 59, 59, 999);
    matchQuery.date = { $gte: startDate, $lte: endDate };
  }

  const data = await Transaction.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'categoryInfo' } },
    { $unwind: '$categoryInfo' },
    { $project: { _id: 0, category: '$categoryInfo.name', color: '$categoryInfo.color', emoji: '$categoryInfo.emoji', total: 1 } },
    { $sort: { total: -1 } }
  ]);

  res.status(200).json({ success: true, data });
});

export const getMonthlyIncomeExpense = asyncHandler(async (req, res) => {
  const months = parseInt(req.query.months) || 6;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months + 1);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const data = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user.id), type: { $in: ['income', 'expense'] }, date: { $gte: startDate } } },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
        expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        _id: 0,
        month: { $concat: [{ $toString: '$_id.year' }, '-', { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] }] },
        income: 1,
        expense: 1
      }
    }
  ]);

  res.status(200).json({ success: true, data });
});

export const getSpendingTrend = asyncHandler(async (req, res) => {
  const days = 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const data = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user.id), type: 'expense', date: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', total: 1 } }
  ]);

  res.status(200).json({ success: true, data });
});

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const wallets = await Wallet.find({ user: req.user.id, isArchived: false });
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const currentMonthTx = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user.id), type: { $in: ['income', 'expense'] }, date: { $gte: startOfMonth } } },
    {
      $group: {
        _id: null,
        income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
        expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
      }
    }
  ]);

  const monthlyIncome = currentMonthTx.length > 0 ? currentMonthTx[0].income : 0;
  const monthlyExpense = currentMonthTx.length > 0 ? currentMonthTx[0].expense : 0;

  const recentTransactions = await Transaction.find({ user: req.user.id })
    .sort({ date: -1, createdAt: -1 })
    .limit(5)
    .populate('category', 'name emoji color')
    .populate('wallet', 'name icon');

  const goals = await Goal.find({ user: req.user.id, isCompleted: false }).limit(3);

  const currentMonthStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  const budgets = await Budget.find({ user: req.user.id, month: currentMonthStr }).populate('category');

  res.status(200).json({
    success: true,
    data: {
      totalBalance,
      thisMonth: {
        income: monthlyIncome,
        expense: monthlyExpense,
        net: monthlyIncome - monthlyExpense
      },
      recentTransactions,
      goals,
      budgets
    }
  });
});
