import { USER_ROLES } from "../../../enums/user";
import { User } from "../user/user.model";
import { MOVIE_STATUS, TMovie } from "./movie.interface";
import { Movie } from "./movie.model";

const createMovieToDB = async (payload: TMovie) => {
    console.log(payload, "payload");
    const result = await Movie.create(payload);
    if (!result) {
        throw new Error("Failed to create movie");
    }
    return result;
};

const getAllMoviesFromDB = async (userId?: string) => {
    let query: any = {};
    let userRole = null;

   
    if (userId) {
        const user = await User.findById(userId);
        userRole = user?.role;
    }

 
    const isAdmin = userRole === USER_ROLES.SUPER_ADMIN || userRole === USER_ROLES.ADMIN;

 
    if (!isAdmin) {
        query.status = MOVIE_STATUS.ACTIVE;
    }

    const result = await Movie.find(query)
        .populate('genreId')
        .sort({ createdAt: -1 });

    return result;
};

const getRelatedMoviesFromDB = async (movieId: string) => {
   
    const currentMovie = await Movie.findById(movieId);
   
    
    if (!currentMovie) {
        throw new Error("Current movie not found");
    }

    const result = await Movie.find({
        genreId: currentMovie.genreId,       
        _id: { $ne: movieId },               
        status: MOVIE_STATUS.ACTIVE        
    })
    .populate('genreId')
    .limit(10)                             
    .sort({ createdAt: -1 });
    
    
    return result;
};

const getPopularMoviesFromDB = async () => {
    
    const result = await Movie.find({ status: MOVIE_STATUS.ACTIVE })
        .populate('genreId')
        .sort({ views: -1 }) 
        .limit(10);

    return result;
};

const getTrendingMoviesFromDB = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Movie.find({
        status: MOVIE_STATUS.ACTIVE,
        createdAt: { $gte: thirtyDaysAgo } 
    })
    .populate('genreId')
    .sort({ views: -1, createdAt: -1 })
    .limit(10);


    if (result.length < 5) {
        return await Movie.find({ status: MOVIE_STATUS.ACTIVE })
            .populate('genreId')
            .sort({ views: -1 })
            .limit(10);
    }

    return result;
};

const getMovieByIdFromDB = async (id: string) => {

    const result = await Movie.findByIdAndUpdate(
        id, 
        { $inc: { views: 1 } }, 
        { new: true }         
    ).populate('genreId');

    if (!result) {
        throw new Error("Failed to get movie");
    }

    return result;
};

const updateMovieByIdInDB = async (id: string, payload: Partial<TMovie>) => {
    const result = await Movie.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new Error("Failed to update movie");
    }
    return result;
};

const updateMovieStatusInDB = async (id: string, status: MOVIE_STATUS.ACTIVE | MOVIE_STATUS.INACTIVE) => {

    if (!(status === MOVIE_STATUS.ACTIVE || status === MOVIE_STATUS.INACTIVE)) {
        throw new Error("Invalid movie status");
    }

    const result = await Movie.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
        throw new Error("Failed to update movie status");
    }
    return result;
};

const deleteMovieByIdFromDB = async (id: string) => {
    const result = await Movie.findByIdAndDelete(id);
    if (!result) {
        throw new Error("Failed to delete movie");
    }
    return result;
};

export const MovieServices = {
    createMovieToDB,
    getAllMoviesFromDB,
    getPopularMoviesFromDB,
    getTrendingMoviesFromDB,
    getRelatedMoviesFromDB,
    getMovieByIdFromDB,
    updateMovieByIdInDB,
    updateMovieStatusInDB,
    deleteMovieByIdFromDB,
}