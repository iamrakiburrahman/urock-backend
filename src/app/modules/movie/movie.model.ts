import mongoose from "mongoose";

import { TMovie } from "./movie.interface";

import { MOVIE_STATUS } from "./movie.interface";

const movieSchema = new mongoose.Schema<TMovie>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genreId: { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true },
    releaseYear: { type: String, required: true },
    ageRating: { type: String, required: true },
    runTime: { type: String, required: true },
    thumbnail: { type: String, required: true },
    trailer: { type: String, required: true },
    movie: { type: String, required: true },
    cast: { type: String, required: true },
    director: { type: String, required: true },
    writer: { type: String, required: true },
    tags: { type: [String], required: true },
    views: { type: Number, default: 0 },
    status: { type: String, enum: MOVIE_STATUS, default: MOVIE_STATUS.ACTIVE },
},
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Movie = mongoose.model<TMovie>("Movie", movieSchema);  
