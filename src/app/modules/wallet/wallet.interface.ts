import { Types } from 'mongoose';
export enum Currency {
     USD = 'USD',
     EUR = 'EUR',
     GBP = 'GBP',
     BDT = 'BDT',
}
// Enums
export enum TransactionType {
     TOPUP = 'TOPUP',
     WITHDRAWAL = 'WITHDRAWAL',
     PAYMENT = 'PAYMENT',
     REFUND = 'REFUND',
     BONUS = 'BONUS',
     TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
     PENDING = 'PENDING',
     COMPLETED = 'COMPLETED',
     FAILED = 'FAILED',
     CANCELLED = 'CANCELLED',
     PROCESSING = 'PROCESSING',
}

// Query parameters interface
export interface GetTransactionsQuery {
     page?: number;
     limit?: number;
     type?: TransactionType;
     status?: TransactionStatus;
     startDate?: string;
     endDate?: string;
}

// MongoDB query interface
export interface TransactionQueryFilter {
     userId: string | Types.ObjectId;
     type?: TransactionType;
     status?: TransactionStatus;
     createdAt?: {
          $gte?: Date;
          $lte?: Date;
     };
}

// Transaction interface
export interface ITransaction {
     _id: Types.ObjectId;
     transactionId: string;
     userId: Types.ObjectId;
     walletId: Types.ObjectId;
     type: TransactionType;
     amount: number;

     currency: string;
     status: TransactionStatus;
     stripePaymentIntentId?: string;
     stripeChargeId?: string;
     balanceBefore: number;
     balanceAfter: number;
     description?: string;
     createdAt: Date;
     updatedAt: Date;
}

// Enriched transaction with Stripe data
export interface EnrichedTransaction extends ITransaction {
     stripeStatus?: string;
     stripeAmount?: number;
     paymentMethod?: string;
}

// Response interface
export interface TransactionResponse {
     data: EnrichedTransaction[];
     meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
     };
}

export interface IWallet extends Document {
     userId: Types.ObjectId;
     balance: number;
     totalPayout: number;
     currency: Currency;
     stripeCustomerId?: string | null;
     stripeAccountId?: string | null;
     isActive: boolean;
     createdAt: Date;
     updatedAt: Date;
}
