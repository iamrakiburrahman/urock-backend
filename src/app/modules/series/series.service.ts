import { USER_ROLES } from "../../../enums/user";
import { User } from "../user/user.model";
import { SERIES_STATUS, TSeries } from "./series.interface";

import { Series } from "./series.model";

const createSeriesToDB = async (seriesData: TSeries) => {
    const series = await Series.create(seriesData);
    if (!series) {
        throw new Error('Failed to create series');
    }
    return series;
};

const getAllSeriesFromDB = async (userId?: string) => {
    let query: any = {};
    let userRole = null;

   
    if (userId) {
        const user = await User.findById(userId);
        userRole = user?.role;
    }

 
    const isAdmin = userRole === USER_ROLES.SUPER_ADMIN || userRole === USER_ROLES.ADMIN;

 
    if (!isAdmin) {
        query.status = SERIES_STATUS.ACTIVE;
    }

    const result = await Series.find(query)
        .populate('genreId')
        .sort({ createdAt: -1 });

    return result;
};

const getSeriesByIdFromDB = async (id: string) => {
    const series = await Series.findById(id);
    if (!series) {
        throw new Error('Failed to get series');
    }
    return series;
};

const updateSeriesInDB = async (id: string, payload: any) => {
    const { action, seasonIndex, episodeIndex, data, ...remainingData } = payload;

    const modifiedUpdatedData: Record<string, any> = {};


    Object.keys(remainingData).forEach((key) => {
        if (key !== 'seasons') {
            modifiedUpdatedData[key] = remainingData[key];
        }
    });

    if (remainingData.seasons && Array.isArray(remainingData.seasons)) {
        remainingData.seasons.forEach((season: any, sIdx: number) => {
            Object.keys(season).forEach((key) => {
                modifiedUpdatedData[`seasons.${sIdx}.${key}`] = season[key];
            });
        });
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

        Object.assign(doc, modifiedUpdatedData);
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

const updateSeriesStatusInDB = async (id: string, status: SERIES_STATUS.ACTIVE | SERIES_STATUS.INACTIVE) => {

    if (!(status === SERIES_STATUS.ACTIVE || status === SERIES_STATUS.INACTIVE)) {
        throw new Error("Invalid series status");
    }

    const result = await Series.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
        throw new Error("Failed to update series status");  
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
    updateSeriesStatusInDB,
    deleteSeriesFromDB,
}