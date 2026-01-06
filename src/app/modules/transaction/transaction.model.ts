import { Schema, model } from "mongoose";
import { ITransaction, TransactionStatus } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    type: {
      type: String,
      enum: ["TOPUP", "WITHDRAWAL", "PAYMENT", "REFUND", "BONUS", "TRANSFER"],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    // Stripe specific fields
    stripePaymentIntentId: {
      type: String,
      required: false,
    },
    stripePaymentMethodId: {
      type: String,
      required: false,
    },
    stripeTransferId: {
      type: String,
      required: false,
    }, // For withdrawals
    stripeChargeId: {
      type: String,
      required: false,
    },

    // Balance tracking
    balanceBefore: {
      type: Number,
      required: false,
    },
    balanceAfter: {
      type: Number,
      required: false,
    },

    // Additional details
    description: {
      type: String,
      required: false,
    },
    metadata: {
      type: Object,
      default: {},
    },
    failureReason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Transaction = model("Transaction", transactionSchema);
