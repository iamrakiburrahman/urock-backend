import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SeriesServices } from "./series.service";

const createSeries = catchAsync(async (req, res) => {
    const data = req.body;
    const result = await SeriesServices.createSeriesToDB(data);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Series created successfully',
        data: result
    })
})

const getAllSeries = catchAsync(async (req, res) => {
    const result = await SeriesServices.getAllSeriesFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Series retrieved successfully',
        data: result
    })
})

const getSeriesById = catchAsync(async (req, res) => {
    const result = await SeriesServices.getSeriesByIdFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Series retrieved successfully',
        data: result
    })
})

const updateSeries = catchAsync(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await SeriesServices.updateSeriesInDB(id, data);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Series updated successfully',
        data: result
    })
})

export const SeriesControllers = {
    createSeries,
    getAllSeries,
    getSeriesById,
    updateSeries,
}