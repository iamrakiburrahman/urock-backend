import { Types } from "mongoose";
export enum TransactionType {
  TOPUP = "TOPUP",
  WITHDRAWAL = "WITHDRAWAL",
  PAYMENT = "PAYMENT",
  REFUND = "REFUND",
  BONUS = "BONUS",
  TRANSFER = "TRANSFER",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  PROCESSING = "PROCESSING",
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  BDT = "BDT",
}
export interface ITransaction {
  transactionId: string;
  userId: Types.ObjectId;
  walletId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  currency: Currency | string;
  status: TransactionStatus;
  stripePaymentIntentId?: string;
  stripePaymentMethodId?: string;
  stripeTransferId?: string;
  stripeChargeId?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  description?: string;
  metadata?: Record<string, any>;
  failureReason?: string;
}
