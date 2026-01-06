import { StatusCodes } from 'http-status-codes';
import { Wallet } from '../wallet/wallet.model';
import { v4 as uuidv4 } from 'uuid';
import { Withdrawal } from './withdrawal.model';
import AppError from '../../../errors/AppError';
import { WithdrawalStatus } from './withdrawal.interface';
import { Transaction } from '../transaction/transaction.model';
import stripe from '../../../config/stripe';
import { User } from '../user/user.model';
import { CACHE_TTL, createCacheHelper } from '../../builder/RedisCacheHelper';
import QueryBuilder from '../../builder/QueryBuilder';
import { NotificationQueueHelper } from '../../../helpers/bullMQ/bullHelper';
import { USER_ROLES } from '../../../enums/user';
const withdrawalCache = createCacheHelper('withdrawalCache');
const createWithdrawal = async (userId: string, amount: number, withdrawalMethod: string, bankDetails: any) => {
     if (!amount || amount < 10) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Minimum withdrawal amount is $10');
     }
     const wallet = await Wallet.findOne({ userId });
     const admin = await User.findOne({ role: USER_ROLES.SUPER_ADMIN });
     if (!admin) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found');
     }
     const adminId = admin?._id.toString();
     if (!wallet) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Wallet not found');
     }

     if (wallet.balance < amount) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Insufficient balance');
     }

     const requestId = `WD_${uuidv4()}`;
     const processingFee = amount * 0.02; // 2% fee
     const netAmount = amount - processingFee;

     const withdrawal = await Withdrawal.create({
          requestId,
          userId,
          walletId: wallet._id,
          amount,
          currency: wallet.currency,
          withdrawalMethod,
          bankDetails,
          processingFee,
          netAmount,
          status: 'PENDING',
     });
     withdrawal.submitAt = new Date();
     await withdrawal.save();
     await withdrawalCache.clearLists();
     await NotificationQueueHelper.sendNotification(adminId, 'New Withdrawal Request', `A new withdrawal request of $${amount} has been submitted.`, 'REQUESTED');
     return withdrawal;
};
const getAllWithdrawal = async (userId: string, query: Record<string, any>) => {
     return await withdrawalCache.wrapList(
          query,
          async () => {
               const queryBuilder = new QueryBuilder(Withdrawal.find({ userId }).populate('transactionId'), query);
               const result = await queryBuilder.filter().fields().paginate().sort().modelQuery.exec();
               const meta = await queryBuilder.countTotal();
               return {
                    result,
                    meta,
               };
          },
          CACHE_TTL.SHORT,
     );
};
const getAllWithdrawalForAdmin = async (query: Record<string, any>) => {
     return await withdrawalCache.wrapList(
          query,
          async () => {
               const queryBuilder = new QueryBuilder(Withdrawal.find().populate('transactionId'), query);
               const result = await queryBuilder.filter().fields().paginate().sort().modelQuery.exec();
               const meta = await queryBuilder.countTotal();
               return {
                    result,
                    meta,
               };
          },
          CACHE_TTL.SHORT,
     );
};
const approveWithdrawalById = async (withdrawalId: string) => {
     const withdrawal = await Withdrawal.findById(withdrawalId);

     if (!withdrawal || withdrawal.status !== 'PENDING') {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid withdrawal');
     }

     const user = await User.findById(withdrawal.userId);
     if (!user?.stripeConnectAccount?.accountId) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Stripe account not found');
     }

     const wallet = await Wallet.findById(withdrawal.walletId);
     if (!wallet || wallet.balance < withdrawal.amount) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Insufficient balance');
     }

     const balanceBefore = wallet.balance;

     const transfer = await stripe.transfers.create({
          amount: Math.round(withdrawal.amount * 100),
          currency: withdrawal.currency,
          destination: user.stripeConnectAccount.accountId,
     });

     wallet.balance -= withdrawal.amount;
     wallet.totalPayout += withdrawal.amount;
     await wallet.save();

     const transaction = await Transaction.create({
          transactionId: `TXN_${uuidv4()}`,
          userId: withdrawal.userId,
          walletId: wallet._id,
          type: 'WITHDRAWAL',
          amount: withdrawal.amount,
          currency: withdrawal.currency,
          status: 'SUCCESS',
          stripeTransferId: transfer.id,
          balanceBefore,
          balanceAfter: wallet.balance,
          description: 'Wallet withdrawal approved by admin',
     });

     withdrawal.status = WithdrawalStatus.COMPLETED;
     withdrawal.transactionId = transaction._id;
     withdrawal.autoApproved = false;
     withdrawal.processedAt = new Date();

     await withdrawal.save();
     await withdrawalCache.clearAfterUpdate(withdrawalId);
     await NotificationQueueHelper.sendNotification(user._id.toString(), 'Withdrawal Approved', `Your withdrawal request of $${withdrawal.amount} has been approved.`, 'SUCCESS');
     return withdrawal;
};
const rejectWithdrawalById = async (withdrawalId: string) => {
     const withdrawal = await Withdrawal.findById(withdrawalId);

     if (!withdrawal || withdrawal.status !== 'PENDING') {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid withdrawal');
     }

     withdrawal.status = WithdrawalStatus.REJECTED;
     withdrawal.processedAt = new Date();
     await withdrawalCache.clearAfterUpdate(withdrawalId);
     await NotificationQueueHelper.sendNotification(withdrawal.userId.toString(), 'Withdrawal Rejected', `Your withdrawal request of $${withdrawal.amount} has been rejected.`, 'ERROR');
     await withdrawal.save();
};
export const WithdrawalService = {
     createWithdrawal,
     getAllWithdrawal,
     getAllWithdrawalForAdmin,
     approveWithdrawalById,
     rejectWithdrawalById,
};
