import { BusinessService } from './business.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';

const createBusiness = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const result = await BusinessService.createBusinessToDB(id, req.body);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Banner created successfully',
          data: result,
     });
});

// const getAllBusiness = catchAsync(async (req, res) => {
//      const result = await BusinessService.getAllBusinessFromDB();

//      sendResponse(res, {
//           statusCode: StatusCodes.OK,
//           success: true,
//           message: 'Banner retrieved successfully',
//           data: result,
//      });
// });

// const updateBusiness = catchAsync(async (req, res) => {
//      const id = req.params.id;
//      const updateData = req.body;

//      const result = await BusinessService.updateBusinessToDB(id, updateData);

//      sendResponse(res, {
//           statusCode: StatusCodes.OK,
//           success: true,
//           message: 'Banner updated successfully',
//           data: result,
//      });
// });

// const deleteBusiness = catchAsync(async (req, res) => {
//      const id = req.params.id;
//      const result = await BusinessService.deleteBusinessToDB(id);

//      sendResponse(res, {
//           statusCode: StatusCodes.OK,
//           success: true,
//           message: 'Banner deleted successfully',
//           data: result,
//      });
// });

export const BusinessController = {
     createBusiness,
     // getAllBusiness,
     // updateBusiness,
     // deleteBusiness,
};
