import { TMovie } from "./movie.interface";
import { Movie } from "./movie.model";

const createMovieToDB = async (payload: TMovie) => {
    console.log(payload,"payload");
    const result = await Movie.create(payload);
    if (!result) {
        throw new Error("Failed to create movie");
    }
    return result;
};

const getAllMoviesFromDB = async () => {
    const result = await Movie.find();
    if (!result || result.length === 0) {   
        throw new Error("Failed to get movies");
    }
    return result;
};

const getMovieByIdFromDB = async (id: string) => {
    const result = await Movie.findById(id);
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
    getMovieByIdFromDB,
    updateMovieByIdInDB,    
    deleteMovieByIdFromDB,  
}