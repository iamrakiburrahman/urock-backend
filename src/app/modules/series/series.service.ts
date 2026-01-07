import { TSeries } from "./series.interface";

import { Series } from "./series.model";

const createSeriesToDB = async (seriesData: TSeries) => {
    const series = await Series.create(seriesData);
    if (!series) {
        throw new Error('Failed to create series');
    }
    return series;
};

const getAllSeriesFromDB = async () => {
    const series = await Series.find();
    if (!series || series.length === 0) {
        throw new Error('Failed to get series');
    }
    return series;
};

const getSeriesByIdFromDB = async (id: string) => {
    const series = await Series.findById(id);
    if (!series) {
        throw new Error('Failed to get series');
    }
    return series;
};

const updateSeriesInDB = async (
    id: string,
    payload: any
) => {
    const { action, seasonIndex, episodeIndex, data, ...remainingData } = payload;


    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingData,
    };


    if (remainingData.seasons && Array.isArray(remainingData.seasons)) {
        remainingData.seasons.forEach((season: any, sIdx: number) => {
            Object.keys(season).forEach((key) => {
                modifiedUpdatedData[`seasons.${sIdx}.${key}`] = season[key];
            });
        });
        delete modifiedUpdatedData.seasons;
    }


    let updateQuery: any = { $set: modifiedUpdatedData };

    if (action === 'add-season') {
        updateQuery.$push = { seasons: data };
    }
    else if (action === 'add-episode' && seasonIndex !== undefined) {
        updateQuery.$push = { [`seasons.${seasonIndex}.episodes`]: data };
    }


    if (action === 'remove-season' || action === 'remove-episode') {
        const doc = await Series.findById(id);
        if (!doc) throw new Error("Series not found");

        if (action === 'remove-season' && seasonIndex !== undefined) {
            doc.seasons.splice(seasonIndex, 1);
        } else if (action === 'remove-episode' && seasonIndex !== undefined && episodeIndex !== undefined) {
            doc.seasons[seasonIndex].episodes.splice(episodeIndex, 1);
        }


        Object.assign(doc, remainingData);
        return await doc.save();
    }


    const result = await Series.findByIdAndUpdate(
        id,
        updateQuery,
        { new: true, runValidators: true }
    );

    if (!result) {
        throw new Error('Failed to update series');
    }
    return result;
};

const deleteSeriesFromDB = async (id: string) => {
    const result = await Series.findByIdAndDelete(id);
    if (!result) {
        throw new Error('Failed to delete series');
    }
    return result;
};

export const SeriesServices = {
    createSeriesToDB,
    getAllSeriesFromDB,
    getSeriesByIdFromDB,
    updateSeriesInDB,
    deleteSeriesFromDB, 
}