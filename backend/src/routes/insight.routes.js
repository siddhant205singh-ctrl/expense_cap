import express from 'express';
import { getSpendingByCategory, getMonthlyIncomeExpense, getSpendingTrend, getDashboardSummary } from '../controllers/insight.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/dashboard', getDashboardSummary);
router.get('/spending-by-category', getSpendingByCategory);
router.get('/monthly-income-expense', getMonthlyIncomeExpense);
router.get('/spending-trend', getSpendingTrend);

export default router;
