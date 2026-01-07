import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SeriesServices } from "./series.service";

const createSeries = catchAsync(async (req, res) => {
    const data = req.body;
    const result = await SeriesServices.createSeriesToDB(data);
    sendResponse(res,{
        success:true,
        statusCode:200,
        message:'Series created successfully',
        data:result
    })
})

export const SeriesControllers={
    createSeries,
}