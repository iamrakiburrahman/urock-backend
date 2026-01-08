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
    const { id: userId } = req.user as any;
    const result = await MovieServices.getAllMoviesFromDB(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Movies retrieved are successfully',
        data: result,
    });
});

const getRelatedMovies = catchAsync(async (req, res) => {
    const movieId = req.params.id;
   
    const result = await MovieServices.getRelatedMoviesFromDB(movieId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Related movies retrieved are successfully',
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

const updateMovieStatus = catchAsync(async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    console.log(status,"status")
    const result = await MovieServices.updateMovieStatusInDB(id, status);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Movie status updated are successfully',
        data: result,
    });
})

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
    getRelatedMovies,
    getMovieById,
    updateMovieById,
    updateMovieStatus,
    deleteMovieById,
}