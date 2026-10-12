import express from 'express';
import { createFixedCost, getFixedCosts, updateFixedCost, deleteFixedCost, markAsPaid } from '../controllers/fixedCost.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createFixedCostSchema } from '../validators/fixedCost.validators.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getFixedCosts)
  .post(validate(createFixedCostSchema), createFixedCost);

router.route('/:id')
  .patch(updateFixedCost)
  .delete(deleteFixedCost);

router.post('/:id/pay', markAsPaid);

export default router;
