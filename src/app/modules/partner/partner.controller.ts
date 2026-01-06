import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { PartnerService } from './partner.service';
import catchAsync from '../../../shared/catchAsync';

const getAllPartners = catchAsync(async (req, res) => {
     const query = req.query;
     const result = await PartnerService.getAllPartners(query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Partners retrieved successfully',
          meta: result.meta,
          data: result.result,
     });
});
const getAllPartnersForPromoter = catchAsync(async (req, res) => {
     const { id: userId } = req.user as { id: string };
     const result = await PartnerService.getAllPartnersForPromoter(userId, req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Partners retrieved successfully',
          meta: result.meta,
          data: result.result,
     });
});
const getAllPartnersForCreator = catchAsync(async (req, res) => {
     const { id: userId } = req.user as { id: string };
     const result = await PartnerService.getAllPartnersForCreator(userId, req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Partners retrieved successfully',
          meta: result.meta,
          data: result.result,
     });
});
export const PartnerController = {
     getAllPartners,
     getAllPartnersForPromoter,
     getAllPartnersForCreator,
};
