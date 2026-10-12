import express from 'express';
import { createBudget, getBudgets, getMonthBudgets, updateBudget, deleteBudget } from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createBudgetSchema } from '../validators/budget.validators.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(validate(createBudgetSchema), createBudget);

router.get('/month/:month', getMonthBudgets);

router.route('/:id')
  .patch(updateBudget)
  .delete(deleteBudget);

export default router;
