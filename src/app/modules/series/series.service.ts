import { TSeries } from "./series.interface";

import { Series } from "./series.model";

const createSeriesToDB = async (seriesData: TSeries) => {
    const series = await Series.create(seriesData);
    if (!series) {
        throw new Error('Failed to create series');
    }
    return series;
};



export const SeriesServices = {
    createSeriesToDB,
}