import cron from 'node-cron';
import { User } from '../app/modules/user/user.model';
import colors from 'colors';
import { printBanner } from './printBanner';
import config from '../config';
import { logger } from '../shared/logger';
import { CleanupQueueHelper } from '../helpers/bullMQ/bullHelper';
import { Wallet } from '../app/modules/wallet/wallet.model';
import stripe from '../config/stripe';
import { Withdrawal } from '../app/modules/withdrawal/withdrawal.model';
import { WithdrawalStatus } from '../app/modules/withdrawal/withdrawal.interface';
import { Transaction } from '../app/modules/transaction/transaction.model';
import { v4 as uuidv4 } from 'uuid';
// ====== CRON JOB SCHEDULERS ======
const setupCleanupScheduler = () => {
     // Every day at 2 AM - old notifications cleanup
     cron.schedule('0 2 * * *', async () => {
          logger.info(colors.blue('🕐 Running daily cleanup...'));
          await CleanupQueueHelper.cleanupOldNotifications(30);
     });

     // Every day at 3 AM - completed jobs cleanup
     cron.schedule('0 3 * * *', async () => {
          logger.info(colors.blue('🕐 Cleaning completed jobs...'));
          await CleanupQueueHelper.cleanupCompletedJobs();
     });

     // Every Sunday at 4 AM - failed jobs cleanup
     cron.schedule('0 4 * * 0', async () => {
          logger.info(colors.blue('🕐 Weekly failed jobs cleanup...'));
          await CleanupQueueHelper.cleanupFailedJobs();
     });

     // Every month 1st day at 5 AM - deep cleanup
     cron.schedule('0 5 1 * *', async () => {
          logger.info(colors.blue('🕐 Monthly deep cleanup...'));
          await CleanupQueueHelper.deepCleanup();
     });

     logger.info(colors.bgCyan.black('⏰ Cleanup scheduler initialized'));
};
const autoApprovePendingWithdrawals = async () => {
     const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

     const withdrawals = await Withdrawal.find({
          status: 'PENDING',
          submitAt: { $lte: twoDaysAgo },
     });

     for (const withdrawal of withdrawals) {
          try {
               const user = await User.findById(withdrawal.userId);
               if (!user?.stripeConnectAccount?.accountId) continue;

               const wallet = await Wallet.findById(withdrawal.walletId);
               if (!wallet || wallet.balance < withdrawal.amount) continue;

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
                    description: 'Wallet withdrawal auto approved after 2 days',
               });

               withdrawal.status = WithdrawalStatus.COMPLETED;
               withdrawal.transactionId = transaction._id;
               withdrawal.autoApproved = true;
               withdrawal.processedAt = new Date();

               await withdrawal.save();
          } catch (err) {
               console.log('Auto approve failed', withdrawal._id);
          }
     }
};

const setupTimeManagement = () => {
     logger.info(colors.bgCyan.black('🚀 Setting up trial management cron jobs...'));
     // Start all cron jobs
     printBanner(config.server.name as string);
     setupCleanupScheduler(); // Daily cleanup
     autoApprovePendingWithdrawals();
};
export default setupTimeManagement;
