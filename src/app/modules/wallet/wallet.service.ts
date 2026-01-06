import { Wallet } from "./wallet.model";
import stripe from "../../../config/stripe";
import { Transaction } from "../transaction/transaction.model";
import { Types } from "mongoose";
import {
  EnrichedTransaction,
  GetTransactionsQuery,
  ITransaction,
  TransactionQueryFilter,
  TransactionStatus,
  TransactionType,
} from "./wallet.interface";

const getOrCreateWallet = async (userId: string) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    // Create Stripe customer
    const customer = await stripe.customers.create({
      metadata: { userId: userId.toString() },
    });
    wallet = await Wallet.create({
      userId,
      balance: 0,
      stripeCustomerId: customer.id,
      currency: "USD",
    });
  }

  return wallet;
};
const getTransactions = async (
  userId: string,
  queryParams: GetTransactionsQuery,
) => {
  // Destructure with defaults
  const {
    page = 1,
    limit = 20,
    type,
    status,
    startDate,
    endDate,
  } = queryParams;

  // Validate userId
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  // Check wallet exists
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  // Build query with proper typing
  const query: TransactionQueryFilter = { userId };

  // Filter by type
  if (type && Object.values(TransactionType).includes(type)) {
    query.type = type;
  }

  // Filter by status
  if (status && Object.values(TransactionStatus).includes(status)) {
    query.status = status;
  }

  // Date range filter
  if (startDate || endDate) {
    query.createdAt = {};

    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw new Error("Invalid start date");
      }
      query.createdAt.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        throw new Error("Invalid end date");
      }
      // Set to end of day
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  // Validate pagination
  const validPage = Math.max(1, page);
  const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 per page
  const skip = (validPage - 1) * validLimit;

  // Fetch transactions and total count in parallel
  const [transactions, total] = await Promise.all([
    Transaction.find(query as any)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit)
      .select("-__v")
      .lean<ITransaction[]>(),
    Transaction.countDocuments(query as any),
  ]);

  // Enrich with Stripe data (only for recent TOPUP transactions)
  const enrichedTransactions = await Promise.all(
    transactions.map(async (txn) => {
      // Only enrich topups with Stripe data
      if (txn.type === TransactionType.TOPUP && txn.stripePaymentIntentId) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            txn.stripePaymentIntentId,
          );

          return {
            ...txn,
            stripeStatus: paymentIntent.status,
            stripeAmount: paymentIntent.amount / 100,
            paymentMethod: paymentIntent.payment_method_types?.[0] || "card",
          };
        } catch (error) {
          // Log error but don't fail the request
          console.error(
            `Failed to fetch Stripe data for ${txn.stripePaymentIntentId}:`,
            error,
          );
          return txn as EnrichedTransaction;
        }
      }

      return txn as EnrichedTransaction;
    }),
  );

  // Calculate pagination metadata
  const totalPage = Math.ceil(total / validLimit);

  return {
    data: enrichedTransactions,
    meta: {
      page: validPage,
      limit: validLimit,
      total,
      totalPage,
      hasNextPage: validPage < totalPage,
      hasPrevPage: validPage > 1,
    },
  };
};
export const WalletService = {
  getOrCreateWallet,
  getTransactions,
};
