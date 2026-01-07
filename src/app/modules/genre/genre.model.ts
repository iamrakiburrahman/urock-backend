import mongoose from "mongoose";

import { TGenre } from "./genre.interface";

const genreSchema = new mongoose.Schema<TGenre>({
    name: {
        type: String,
        required: true,
    },
    totalMovies: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});

export const Genre = mongoose.model<TGenre>('Genre', genreSchema);