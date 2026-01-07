import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { GenreServices } from "./genre.service";

const createGenre = catchAsync(async (req, res) => {
    const genre = req.body;
    const result = await GenreServices.createGenreToDB(genre);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Genre created successfully',
        data: result,
    });
})

export const GenreControllers = {
    createGenre,
}