import { z } from 'zod';

export const createFixedCostSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().int().positive('Amount must be positive integer'),
  frequency: z.enum(['weekly', 'monthly', 'yearly']),
  category: z.string().min(1, 'Category ID is required'),
  wallet: z.string().min(1, 'Wallet ID is required'),
  nextDueDate: z.string().datetime()
});
