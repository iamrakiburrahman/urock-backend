import { TGenre } from "./genre.interface";

import { Genre } from "./genre.model";

const createGenreToDB = async (genre: TGenre) => {
    const result = await Genre.create(genre);
    if (!result) {
        throw new Error('Failed to create genre');
    }
    return result;
};

const getAllGenresFromDB = async () => {
    const result = await Genre.find();
    if (!result || result.length === 0) {
        throw new Error('No genres found in the database');
    }
    return result;
};

export const GenreServices = {
    createGenreToDB,
    getAllGenresFromDB,
}
