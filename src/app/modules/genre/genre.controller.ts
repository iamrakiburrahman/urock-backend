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

const getAllGenres = catchAsync(async (req, res) => {
    const result = await GenreServices.getAllGenresFromDB();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Genres retrieved are successfully',
        data: result,
    });
})

const getGenreById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await GenreServices.getGenreByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Genre retrieved successfully',
        data: result,
    });
})

const updateGenreById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const genre = req.body;
    const result = await GenreServices.updateGenreByIdInDB(id, genre);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Genre updated successfully',
        data: result,
    });
})

const deleteGenreById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await GenreServices.deleteGenreByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Genre deleted successfully',
        data: result,
    });
})

export const GenreControllers = {
    createGenre,
    getAllGenres,
    getGenreById,
    updateGenreById,
    deleteGenreById,
}