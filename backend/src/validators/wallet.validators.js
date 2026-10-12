import { z } from 'zod';

export const createWalletSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['cash', 'bank', 'mobile_banking', 'card']),
  balance: z.number().int('Balance must be an integer (cents)'),
  color: z.string().min(1, 'Color is required'),
  icon: z.string().min(1, 'Icon is required')
});

export const updateWalletSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['cash', 'bank', 'mobile_banking', 'card']).optional(),
  color: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  isArchived: z.boolean().optional()
});
