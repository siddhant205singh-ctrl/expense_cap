import Goal from '../models/Goal.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, data: goal });
});

export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json({ success: true, data: goals });
});

export const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
  if (!goal) throw new ApiError(404, 'Goal not found');
  res.status(200).json({ success: true, data: goal });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!goal) throw new ApiError(404, 'Goal not found');
  res.status(200).json({ success: true, data: goal });
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!goal) throw new ApiError(404, 'Goal not found');
  res.status(200).json({ success: true, data: {} });
});

export const addContribution = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
  if (!goal) throw new ApiError(404, 'Goal not found');

  const { amount, note, date } = req.body;
  goal.contributions.push({ amount, note, date: date || new Date() });
  goal.savedAmount += amount;
  
  if (goal.savedAmount >= goal.targetAmount) {
    goal.isCompleted = true;
  }

  await goal.save();
  res.status(200).json({ success: true, data: goal });
});

export const removeContribution = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
  if (!goal) throw new ApiError(404, 'Goal not found');

  const contributionId = req.params.cid;
  const contribution = goal.contributions.id(contributionId);
  
  if (!contribution) throw new ApiError(404, 'Contribution not found');

  goal.savedAmount -= contribution.amount;
  goal.contributions.pull(contributionId);
  
  if (goal.savedAmount < goal.targetAmount) {
    goal.isCompleted = false;
  }

  await goal.save();
  res.status(200).json({ success: true, data: goal });
});
