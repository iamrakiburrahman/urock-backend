import { Schema, model } from 'mongoose';
import { IPayoutTransaction } from './payoutTransaction.interface';

const payoutTransactionSchema = new Schema<IPayoutTransaction>(
     {
          campaignId: {
               type: Schema.Types.ObjectId,
               ref: 'Campaign',
               required: true,
               index: true,
          },
          submissionId: {
               type: Schema.Types.ObjectId,
               ref: 'Submission',
               required: true,
               index: true,
          },
          influencerId: {
               type: Schema.Types.ObjectId,
               ref: 'User',
               required: true,
               index: true,
          },
          brandId: {
               type: Schema.Types.ObjectId,
               ref: 'User',
               required: true,
               index: true,
          },

          // Platform & Content
          platform: {
               type: String,
               enum: ['tiktok', 'instagram', 'youtube', 'facebook'],
               required: true,
               index: true,
          },
          contentType: {
               type: String,
               enum: ['UGC', 'Clipping'],
               required: true,
          },

          // Metrics
          metrics: {
               views: { type: Number, default: 0 },
               likes: { type: Number, default: 0 },
               comments: { type: Number, default: 0 },
               shares: { type: Number, default: 0 },
               engagementRate: { type: Number, default: 0 },
          },

          // Payment
          payoutAmount: {
               type: Number,
               required: true,
               min: 0,
          },
          bonusAmount: {
               type: Number,
               default: 0,
               min: 0,
          },
          totalPayout: {
               type: Number,
               required: true,
               min: 0,
          },
          currency: {
               type: String,
               default: 'usd',
          },

          // Calculation
          calculationDetails: {
               rewardRate: { type: Number, required: true },
               perViews: { type: Number, required: true },
               actualViews: { type: Number, required: true },
               formula: { type: String },
          },

          // Transaction
          transactionType: {
               type: String,
               enum: ['submission_payout', 'bonus', 'refund', 'adjustment'],
               default: 'submission_payout',
          },
          paymentMethod: { type: String },
          paymentReference: { type: String },

          status: {
               type: String,
               enum: ['pending', 'completed', 'failed', 'cancelled'],
               default: 'completed',
               index: true,
          },
          paidAt: {
               type: Date,
               default: Date.now,
          },

          // Metadata
          notes: { type: String },
          isFirstSubmission: {
               type: Boolean,
               default: false,
          },
     },
     {
          timestamps: true,
          versionKey: false,
     },
);

// Compound Indexes for Analytics
payoutTransactionSchema.index({ campaignId: 1, platform: 1 });
payoutTransactionSchema.index({ influencerId: 1, paidAt: -1 });
payoutTransactionSchema.index({ brandId: 1, paidAt: -1 });
payoutTransactionSchema.index({ platform: 1, paidAt: -1 });
payoutTransactionSchema.index({ status: 1, paidAt: -1 });
payoutTransactionSchema.index({ createdAt: -1 });

// Virtual for engagement calculation
payoutTransactionSchema.virtual('engagementMetrics').get(function () {
     const total: number = this.metrics.likes + this.metrics.comments + this.metrics.shares;
     return {
          total,
          rate: this.metrics.views > 0 ? (total / this.metrics.views) * 100 : 0,
     };
});

export const PayoutTransaction = model<IPayoutTransaction>('PayoutTransaction', payoutTransactionSchema);
