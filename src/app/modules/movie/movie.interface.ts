import { Schema } from "mongoose";

export enum MOVIE_STATUS {
    "ACTIVE" = "ACTIVE",
    "INACTIVE" = "INACTIVE",
}

export type TMovie = {
    title: string;
    description: string;
    genreId: Schema.Types.ObjectId;
    releaseYear: string;
    ageRating: string;
    runTime: string;
    thumbnail: string;
    trailer: string;
    movie: string;
    cast: string;
    director: string;
    writer: string;
    tags: string[];
    views: number;
    status: MOVIE_STATUS;
}