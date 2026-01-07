import { Schema } from "mongoose";

export enum CONTENT_STATUS {
    "ACTIVE" = "active",
    "INACTIVE" = "inactive",
}


export type TEpisode = {
    episodeNumber: number;
    title: string;
    description: string;
    runTime: string;
    videoUrl: string; 
    thumbnail: string;
    releaseDate: string;
}


export type TSeason = {
    seasonNumber: number;
    title: string;
    description: string;
    thumbnail: string;
    episodes: TEpisode[]; 
}


export type TSeries = {
    title: string;
    description: string;
    genreId: Schema.Types.ObjectId;
    releaseYear: string;
    ageRating: string;
    thumbnail: string;
    trailer: string;
    cast: string;
    director: string;
    writer: string;
    tags: string[];
    views: number;
    status: CONTENT_STATUS;
    seasons: TSeason[];
}