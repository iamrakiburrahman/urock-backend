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
    video: string; 
    episodeThumbnail: string;
    releaseDate: string;
}


export type TSeason = {
    seasonNumber: number;
    title: string;
    description: string;
    seasonThumbnail: string;
    episodes: TEpisode[]; 
}


export type TSeries = {
    title: string;
    description: string;
    genreId: Schema.Types.ObjectId;
    releaseYear: string;
    ageRating: string;
   seriesThumbnail: string;
    trailer: string;
    cast: string;
    director: string;
    writer: string;
    tags: string[];
    views: number;
    status: CONTENT_STATUS;
    seasons: TSeason[];
}