import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SliderService } from './slider.service';

const createSlider = catchAsync(async (req, res) => {
     const result = await SliderService.createSlider(req.body);
     sendResponse(res, {
          statusCode: StatusCodes.CREATED,
          success: true,
          message: 'Slider created successfully',
          data: result,
     });
});
const getSliders = catchAsync(async (req, res) => {
     const result = await SliderService.getSliders();
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sliders retrieved successfully',
          data: result,
     });
});
const getAllSliders = catchAsync(async (req, res) => {
     const result = await SliderService.getAllSliders(req.query);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Sliders retrieved successfully',
          meta: result.meta,
          data: result.data,
     });
});
const getSliderById = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SliderService.getSliderById(id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Slider retrieved successfully',
          data: result,
     });
});
const updateSlider = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SliderService.updateSlider(id, req.body);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Slider updated successfully',
          data: result,
     });
});
const deleteSlider = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await SliderService.deleteSlider(id);
     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Slider deleted successfully',
          data: result,
     });
});

export const SliderController = {
     createSlider,
     getSliders,
     getSliderById,
     updateSlider,
     deleteSlider,
     getAllSliders,
};
