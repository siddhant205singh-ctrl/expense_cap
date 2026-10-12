import express from 'express';
import { createTransaction, getTransactions, getTransaction, updateTransaction, deleteTransaction } from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTransactionSchema, updateTransactionSchema } from '../validators/transaction.validators.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(validate(createTransactionSchema), createTransaction);

router.route('/:id')
  .get(getTransaction)
  .patch(validate(updateTransactionSchema), updateTransaction)
  .delete(deleteTransaction);

export default router;
