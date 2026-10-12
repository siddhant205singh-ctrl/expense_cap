import express from 'express';
import { createGoal, getGoals, getGoal, updateGoal, deleteGoal, addContribution, removeContribution } from '../controllers/goal.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createGoalSchema, addContributionSchema } from '../validators/goal.validators.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getGoals)
  .post(validate(createGoalSchema), createGoal);

router.route('/:id')
  .get(getGoal)
  .patch(updateGoal)
  .delete(deleteGoal);

router.route('/:id/contributions')
  .post(validate(addContributionSchema), addContribution);

router.route('/:id/contributions/:cid')
  .delete(removeContribution);

export default router;
