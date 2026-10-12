import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createBudget = asyncHandler(async (req, res) => {
  const { category, amount, month } = req.body;
  const existing = await Budget.findOne({ user: req.user.id, category, month });
  
  if (existing) {
    existing.amount = amount;
    await existing.save();
    return res.status(200).json({ success: true, data: existing });
  }

  const budget = await Budget.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, data: budget });
});

export const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user.id }).populate('category');
  res.status(200).json({ success: true, data: budgets });
});

export const getMonthBudgets = asyncHandler(async (req, res) => {
  const { month } = req.params; // format: YYYY-MM
  const budgets = await Budget.find({ user: req.user.id, month }).populate('category').lean();

  const [year, monthStr] = month.split('-');
  const startDate = new Date(year, parseInt(monthStr) - 1, 1);
  const endDate = new Date(year, parseInt(monthStr), 0, 23, 59, 59, 999);

  for (let budget of budgets) {
    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          category: budget.category._id,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: { _id: null, totalSpent: { $sum: '$amount' } }
      }
    ]);

    budget.spent = expenses.length > 0 ? expenses[0].totalSpent : 0;
  }

  res.status(200).json({ success: true, data: budgets });
});

export const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!budget) throw new ApiError(404, 'Budget not found');
  res.status(200).json({ success: true, data: budget });
});

export const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!budget) throw new ApiError(404, 'Budget not found');
  res.status(200).json({ success: true, data: {} });
});
