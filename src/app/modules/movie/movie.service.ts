import { TMovie } from "./movie.interface";
import { Movie } from "./movie.model";

const createMovieToDB = async (payload: TMovie) => {
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

export const MovieServices = {
    createMovieToDB,
    getAllMoviesFromDB,
}