import { z } from 'zod';

export const createTransactionSchema = z.object({
  wallet: z.string().min(1, 'Wallet ID is required'),
  category: z.string().min(1, 'Category ID is required'),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().int().positive('Amount must be positive integer'),
  note: z.string().optional(),
  date: z.string().datetime().optional(),
  toWallet: z.string().optional(),
  isRecurring: z.boolean().optional()
});

export const updateTransactionSchema = z.object({
  category: z.string().min(1).optional(),
  amount: z.number().int().positive().optional(),
  note: z.string().optional(),
  date: z.string().datetime().optional(),
  isRecurring: z.boolean().optional()
});
