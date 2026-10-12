import Loan from '../models/Loan.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.create({ ...req.body, user: req.user.id });
  res.status(201).json({ success: true, data: loan });
});

export const getLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.find({ user: req.user.id });
  res.status(200).json({ success: true, data: loans });
});

export const getLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findOne({ _id: req.params.id, user: req.user.id });
  if (!loan) throw new ApiError(404, 'Loan not found');
  res.status(200).json({ success: true, data: loan });
});

export const updateLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!loan) throw new ApiError(404, 'Loan not found');
  res.status(200).json({ success: true, data: loan });
});

export const deleteLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!loan) throw new ApiError(404, 'Loan not found');
  res.status(200).json({ success: true, data: {} });
});

export const addRepayment = asyncHandler(async (req, res) => {
  const loan = await Loan.findOne({ _id: req.params.id, user: req.user.id });
  if (!loan) throw new ApiError(404, 'Loan not found');

  const { amount, note, date } = req.body;
  loan.repayments.push({ amount, note, date: date || new Date() });
  
  const totalRepaid = loan.repayments.reduce((sum, r) => sum + r.amount, 0);
  if (totalRepaid >= loan.principal) {
    loan.isSettled = true;
  }

  await loan.save();
  res.status(200).json({ success: true, data: loan });
});

export const removeRepayment = asyncHandler(async (req, res) => {
  const loan = await Loan.findOne({ _id: req.params.id, user: req.user.id });
  if (!loan) throw new ApiError(404, 'Loan not found');

  const repaymentId = req.params.rid;
  const repayment = loan.repayments.id(repaymentId);
  
  if (!repayment) throw new ApiError(404, 'Repayment not found');

  loan.repayments.pull(repaymentId);
  
  const totalRepaid = loan.repayments.reduce((sum, r) => sum + r.amount, 0);
  if (totalRepaid < loan.principal) {
    loan.isSettled = false;
  }

  await loan.save();
  res.status(200).json({ success: true, data: loan });
});
