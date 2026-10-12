import { z } from 'zod';

export const createBudgetSchema = z.object({
  category: z.string().min(1, 'Category ID is required'),
  amount: z.number().int().positive('Amount must be positive integer'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format')
});
