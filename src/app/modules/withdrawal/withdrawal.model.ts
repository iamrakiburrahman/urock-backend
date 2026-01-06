import { Schema, model } from 'mongoose';
import { IWithdrawalRequest, WithdrawalStatus } from './withdrawal.interface';

const withdrawalSchema = new Schema<IWithdrawalRequest>(
     {
          requestId: {
               type: String,
               unique: true,
               required: true,
          },
          userId: {
               type: Schema.Types.ObjectId,
               ref: 'User',
               required: true,
               index: true,
          },
          walletId: {
               type: Schema.Types.ObjectId,
               ref: 'Wallet',
               required: true,
          },
          amount: {
               type: Number,
               required: true,
               min: 10, // Minimum withdrawal amount
          },
          currency: {
               type: String,
               default: 'USD',
          },
          withdrawalMethod: {
               type: String,
               enum: ['BANK_ACCOUNT', 'CARD', 'MOBILE_MONEY'],
               required: true,
          },
          submitAt: {
               type: Date,
               required: false,
          },
          autoApproved: {
               type: Boolean,
               default: false,
          },
          processedAt: {
               type: Date,
          },
          status: {
               type: String,
               enum: Object.values(WithdrawalStatus),
               default: WithdrawalStatus.PENDING,
               index: true,
          },
          // Stripe fields
          stripeTransferId: {
               type: String,
               required: false,
          },
          stripePayoutId: {
               type: String,
               required: false,
          },

          transactionId: {
               type: Schema.Types.ObjectId,
               ref: 'Transaction',
          },

          // Processing fees
          processingFee: {
               type: Number,
               default: 0,
          },
          netAmount: {
               type: Number,
               required: false,
          }, // amount - processingFee

          // Admin review
          reviewedBy: {
               type: Schema.Types.ObjectId,
               ref: 'Admin',
          },
          reviewedAt: {
               type: Date,
               required: false,
          },
          rejectionReason: {
               type: String,
               required: false,
          },

          completedAt: {
               type: Date,
               required: false,
          },
     },
     {
          timestamps: true,
     },
);

export const Withdrawal = model('Withdrawal', withdrawalSchema);
