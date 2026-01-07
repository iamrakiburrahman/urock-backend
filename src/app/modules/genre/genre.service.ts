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

const getGenreByIdFromDB = async (id: string) => {
    const result = await Genre.findById(id);
    if (!result) {
        throw new Error('Genre not found');
    }
    return result;
};

const updateGenreByIdInDB = async (id: string, genre: TGenre) => {
    const result = await Genre.findByIdAndUpdate(id, genre, { new: true });
    if (!result) {
        throw new Error('Genre not found');
    }
    return result;
};

const deleteGenreByIdFromDB = async (id: string) => {
    const result = await Genre.findByIdAndDelete(id);
    if (!result) {
        throw new Error('Genre not found');
    }
    return result;
};

export const GenreServices = {
    createGenreToDB,
    getAllGenresFromDB,
    getGenreByIdFromDB,
    updateGenreByIdInDB,
    deleteGenreByIdFromDB,
}
