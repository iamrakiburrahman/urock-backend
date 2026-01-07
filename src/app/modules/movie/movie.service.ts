import { TMovie } from "./movie.interface";
import { Movie } from "./movie.model";

const createMovieToDB = async (payload: TMovie) => {
    const result = await Movie.create(payload);
    if (!result) {
        throw new Error("Failed to create movie");
    }
    return result;
};

export const MovieServices = {
    createMovieToDB,
}