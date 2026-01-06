import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WithdrawalService } from './withdrawal.service';

const createWithdrawal = catchAsync(async (req, res) => {
     const { id: userId } = req.user as { id: string };
     const { amount, withdrawalMethod, bankDetails } = req.body;
     const result = await WithdrawalService.createWithdrawal(userId, amount, withdrawalMethod, bankDetails);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Withdrawal request created successfully',
          data: result,
     });
});
const getAllWithdrawal = catchAsync(async (req, res) => {
     const { id: userId } = req.user as { id: string };
     const result = await WithdrawalService.getAllWithdrawal(userId, req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Withdrawal status retrieved successfully',
          data: result,
     });
});
const getAllWithdrawalForAdmin = catchAsync(async (req, res) => {
     const result = await WithdrawalService.getAllWithdrawalForAdmin(req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Withdrawal status retrieved successfully',
          data: result,
     });
});
const approveWithdrawalById = catchAsync(async (req, res) => {
     const { requestId } = req.params;
     const result = await WithdrawalService.approveWithdrawalById(requestId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Withdrawal approved successfully',
          data: result,
     });
});
const rejectWithdrawalById = catchAsync(async (req, res) => {
     const { requestId } = req.params;
     const result = await WithdrawalService.rejectWithdrawalById(requestId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Withdrawal rejected successfully',
          data: result,
     });
});
export const WithdrawalController = {
     createWithdrawal,
     getAllWithdrawal,
     approveWithdrawalById,
     getAllWithdrawalForAdmin,
     rejectWithdrawalById,
};
