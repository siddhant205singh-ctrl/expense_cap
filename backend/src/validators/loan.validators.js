import { z } from 'zod';

export const createLoanSchema = z.object({
  type: z.enum(['borrowed', 'lent']),
  counterparty: z.string().min(1, 'Counterparty is required'),
  principal: z.number().int().positive('Principal must be positive integer'),
  dueDate: z.string().datetime(),
  note: z.string().optional()
});

export const addRepaymentSchema = z.object({
  amount: z.number().int().positive('Amount must be positive integer'),
  note: z.string().optional(),
  date: z.string().datetime().optional()
});
