import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SeriesServices } from "./series.service";


const createSeries = catchAsync(async (req, res) => {
  const data = req.body;

  
  data.seriesThumbnail = data.seriesThumbnail;
  data.trailer = data.trailer;


  let episodeIndex = 0;

  data.seasons.forEach((season: any, sIdx: number) => {
  
    season.seasonThumbnail = data.seasonThumbnail?.[sIdx];

    season.episodes.forEach((episode: any) => {
    
      episode.episodeThumbnail = data.episodeThumbnail?.[episodeIndex];
      episode.video = data.video?.[episodeIndex];
      episodeIndex++;
    });
  });

 
  delete data.seasonThumbnail;
  delete data.episodeThumbnail;
  delete data.video;

  console.log(data,'data')

  const result = await SeriesServices.createSeriesToDB(data);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Series created successfully",
    data: result
  });
});


const getAllSeries = catchAsync(async (req, res) => {
    const result = await SeriesServices.getAllSeriesFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Series retrieved successfully',
        data: result
    })
})

const getSeriesById = catchAsync(async (req, res) => {
    const result = await SeriesServices.getSeriesByIdFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Series retrieved successfully',
        data: result
    })
})



const updateSeries = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  
  if (data.action === 'add-season' && data.data) {
    if (typeof data.data === 'string') {
      data.data = JSON.parse(data.data);
    }


    if (data.seasonThumbnail && Array.isArray(data.seasonThumbnail)) {
      data.data.seasonThumbnail = data.seasonThumbnail[0];
    }


    if (data.data.episodes && data.data.episodes.length > 0) {
      if (data.episodeThumbnail && Array.isArray(data.episodeThumbnail)) {
        data.data.episodes[0].episodeThumbnail = data.episodeThumbnail[0];
      }
      if (data.video && Array.isArray(data.video)) {
        data.data.episodes[0].video = data.video[0];
      }
    }
  }


  else if (data.action === 'add-episode' && data.data) {
    if (typeof data.data === 'string') {
      data.data = JSON.parse(data.data);
    }
    if (data.episodeThumbnail && Array.isArray(data.episodeThumbnail)) {
      data.data.episodeThumbnail = data.episodeThumbnail[0];
    }
    if (data.video && Array.isArray(data.video)) {
      data.data.video = data.video[0];
    }
  }


  else if (data.seasons) {
    let episodeIndex = 0;
    const seasonsArray = typeof data.seasons === 'string' ? JSON.parse(data.seasons) : data.seasons;

    seasonsArray.forEach((season: any, sIdx: number) => {
      if (data.seasonThumbnail?.[sIdx]) {
        season.seasonThumbnail = data.seasonThumbnail[sIdx];
      }
      season.episodes?.forEach((episode: any) => {
        if (data.episodeThumbnail?.[episodeIndex]) {
          episode.episodeThumbnail = data.episodeThumbnail[episodeIndex];
        }
        if (data.video?.[episodeIndex]) {
          episode.video = data.video[episodeIndex];
        }
        episodeIndex++;
      });
    });
    data.seasons = seasonsArray;
  }


  delete data.seasonThumbnail;
  delete data.episodeThumbnail;
  delete data.video;

  const result = await SeriesServices.updateSeriesInDB(id, data);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Series updated successfully",
    data: result
  });
});



const deleteSeriesById = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await SeriesServices.deleteSeriesFromDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Series deleted successfully',
        data: result
    })
})

export const SeriesControllers = {
    createSeries,
    getAllSeries,
    getSeriesById,
    updateSeries,
    deleteSeriesById,
}