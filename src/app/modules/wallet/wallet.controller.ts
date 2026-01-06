import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WalletService } from './wallet.service';

const getBalance = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const wallet = await WalletService.getOrCreateWallet(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Wallet balance retrieved successfully',
          data: wallet,
     });
});

// Get transaction history
const getTransactions = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     // const queryParams: GetTransactionsQuery = {
     //     page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
     //     limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
     //     type: req.query.type as TransactionType | undefined,
     //     status: req.query.status as TransactionStatus | undefined,
     //     startDate: req.query.startDate as string | undefined,
     //     endDate: req.query.endDate as string | undefined
     // };
     const transactions = await WalletService.getTransactions(id, req.query);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Transactions retrieved successfully',
          data: transactions.data,
          meta: transactions.meta,
     });
});

export const WalletController = {
     getBalance,
     getTransactions,
};
