import express from 'express';
import { createLoan, getLoans, getLoan, updateLoan, deleteLoan, addRepayment, removeRepayment } from '../controllers/loan.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createLoanSchema, addRepaymentSchema } from '../validators/loan.validators.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getLoans)
  .post(validate(createLoanSchema), createLoan);

router.route('/:id')
  .get(getLoan)
  .patch(updateLoan)
  .delete(deleteLoan);

router.route('/:id/repayments')
  .post(validate(addRepaymentSchema), addRepayment);

router.route('/:id/repayments/:rid')
  .delete(removeRepayment);

export default router;
