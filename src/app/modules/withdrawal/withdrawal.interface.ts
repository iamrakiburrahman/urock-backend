import { Types } from 'mongoose';
export enum WithdrawalStatus {
     PENDING = 'PENDING',
     APPROVED = 'APPROVED',
     PROCESSING = 'PROCESSING',
     COMPLETED = 'COMPLETED',
     REJECTED = 'REJECTED',
     FAILED = 'FAILED',
}

export enum WithdrawalMethod {
     BANK_ACCOUNT = 'BANK_ACCOUNT',
     CARD = 'CARD',
     MOBILE_MONEY = 'MOBILE_MONEY',
}

export enum Currency {
     USD = 'USD',
     EUR = 'EUR',
     GBP = 'GBP',
     BDT = 'BDT',
}
export interface IWithdrawalRequest {
     requestId: string;
     userId: Types.ObjectId;
     walletId: Types.ObjectId;
     amount: number;
     currency: Currency | string;
     withdrawalMethod: WithdrawalMethod;
     submitAt?: Date;
     autoApproved: boolean;
     processedAt?: Date;
     status: WithdrawalStatus;
     stripeTransferId?: string;
     stripePayoutId?: string;
     transactionId?: Types.ObjectId;
     processingFee: number;
     netAmount?: number;
     reviewedBy?: Types.ObjectId;
     reviewedAt?: Date;
     rejectionReason?: string;
     completedAt?: Date;
}
