import { z } from 'zod';

// Transaction Type Enum
export const transactionTypeSchema = z.enum(['DEPOSIT', 'WITHDRAWAL', 'PURCHASE', 'REFUND', 'TRANSFER', 'REWARD']);

// Transaction Status Enum
export const transactionStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED']);

// Payment Method Enum
export const paymentMethodSchema = z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CRYPTO', 'WALLET_BALANCE']);

// Deposit Funds Schema
export const depositFundsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  amount: z.number().min(1, 'Minimum deposit is $1').max(10000, 'Maximum deposit is $10,000'),
  paymentMethod: paymentMethodSchema,
  paymentMethodId: z.string().optional(), // Stripe payment method ID
  currency: z.string().length(3, 'Currency must be 3-letter ISO code').default('USD'),
});

// Withdraw Funds Schema
export const withdrawFundsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  amount: z.number().min(1, 'Minimum withdrawal is $1'),
  withdrawalMethod: z.enum(['BANK_TRANSFER', 'PAYPAL', 'CRYPTO']),
  destination: z.string().min(1, 'Destination is required').max(200),
  currency: z.string().length(3).default('USD'),
});

// Transfer Funds Schema
export const transferFundsSchema = z.object({
  fromUserId: z.string().uuid('Invalid sender ID'),
  toUserId: z.string().uuid('Invalid recipient ID'),
  amount: z.number().min(0.01, 'Minimum transfer is $0.01'),
  note: z.string().max(500).optional(),
  currency: z.string().length(3).default('USD'),
}).refine(
  (data) => data.fromUserId !== data.toUserId,
  { message: 'Cannot transfer to yourself', path: ['toUserId'] }
);

// Purchase with Wallet Schema
export const purchaseWithWalletSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  amount: z.number().min(0.01, 'Amount must be positive'),
  itemType: z.enum(['TICKET', 'PRODUCT', 'ADVENTURE', 'MEMBERSHIP']),
  itemId: z.string().uuid('Invalid item ID'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Transaction Query Schema
export const transactionQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  type: transactionTypeSchema.optional(),
  status: transactionStatusSchema.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'amount', 'type']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Get Balance Schema
export const getBalanceSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  currency: z.string().length(3).default('USD'),
});

// Type exports
export type DepositFundsInput = z.infer<typeof depositFundsSchema>;
export type WithdrawFundsInput = z.infer<typeof withdrawFundsSchema>;
export type TransferFundsInput = z.infer<typeof transferFundsSchema>;
export type PurchaseWithWalletInput = z.infer<typeof purchaseWithWalletSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
export type GetBalanceInput = z.infer<typeof getBalanceSchema>;
