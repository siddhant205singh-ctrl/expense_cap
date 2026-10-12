import express from 'express';
import authRoutes from './auth.routes.js';
import walletRoutes from './wallet.routes.js';
import transactionRoutes from './transaction.routes.js';
import categoryRoutes from './category.routes.js';
import budgetRoutes from './budget.routes.js';
import goalRoutes from './goal.routes.js';
import loanRoutes from './loan.routes.js';
import fixedCostRoutes from './fixedCost.routes.js';
import insightRoutes from './insight.routes.js';
import exportRoutes from './export.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/wallets', walletRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/goals', goalRoutes);
router.use('/loans', loanRoutes);
router.use('/fixed-costs', fixedCostRoutes);
router.use('/insights', insightRoutes);
router.use('/exports', exportRoutes);

export default router;
