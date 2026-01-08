import mongoose from "mongoose";
import { TEpisode, TSeason, TSeries } from "./series.interface";
import { SERIES_STATUS } from "./series.interface";

const episodeSchema = new mongoose.Schema<TEpisode>({
    episodeNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    runTime: { type: String, required: true },
    video: { type: String, required: true },
    episodeThumbnail: { type: String, required: true },
    releaseDate: { type: String, required: true },
});

const seasonSchema = new mongoose.Schema<TSeason>({
    seasonNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    seasonThumbnail: { type: String, required: true },
    episodes: { type: [episodeSchema], required: true },
});

const seriesSchema = new mongoose.Schema<TSeries>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
    releaseYear: { type: String, required: true },
    ageRating: { type: String, required: true },
    seriesThumbnail: { type: String, required: true },
    trailer: { type: String, required: true },
    cast: { type: String, required: true },
    director: { type: String, required: true },
    writer: { type: String, required: true },
    tags: { type: [String], required: true },
    views: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(SERIES_STATUS), default: SERIES_STATUS.ACTIVE },
    seasons: { type: [seasonSchema], required: true },
},
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Series = mongoose.model<TSeries>('Series', seriesSchema);