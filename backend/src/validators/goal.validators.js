import { z } from 'zod';

export const createGoalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  targetAmount: z.number().int().positive('Target amount must be positive integer'),
  deadline: z.string().datetime(),
  emoji: z.string().min(1),
  color: z.string().min(1)
});

export const addContributionSchema = z.object({
  amount: z.number().int().positive('Amount must be positive integer'),
  note: z.string().optional(),
  date: z.string().datetime().optional()
});
