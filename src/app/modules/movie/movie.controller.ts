import catchAsync from "../../../shared/catchAsync";
import { MovieServices } from "./movie.service";
import sendResponse from "../../../shared/sendResponse";

const createMovie = catchAsync(async (req, res) => {
    const movie = req.body;
    const result = await MovieServices.createMovieToDB(movie);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Movie created successfully',
        data: result,
    });
});

const getAllMovies = catchAsync(async (req, res) => {
    const result = await MovieServices.getAllMoviesFromDB();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Movies retrieved are successfully',
        data: result,
    });
});

const getMovieById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await MovieServices.getMovieByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Movie retrieved are successfully',
        data: result,
    });
});

const updateMovieById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await MovieServices.updateMovieByIdInDB(id, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Movie updated are successfully',
        data: result,
    });
});

const deleteMovieById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await MovieServices.deleteMovieByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Movie deleted are successfully',
        data: result,
    });
});

export const MovieControllers = {
    createMovie,
    getAllMovies,   
    getMovieById,   
    updateMovieById,    
    deleteMovieById,    
}