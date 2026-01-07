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

export const SeriesServices = {
    createSeriesToDB,
    getAllSeriesFromDB,
}