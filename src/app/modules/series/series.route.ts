import express from "express";
import { SeriesControllers } from "./series.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middleware/fileUploadHandler";
import parseFileData from "../../middleware/parseFileData";
import { FOLDER_NAMES } from "../../../enums/files";

const router = express.Router();

router.post('/', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    parseFileData(
        { fieldName: FOLDER_NAMES.SERIES_THUMBNAIL, forceSingle: true },
        { fieldName: FOLDER_NAMES.EPISODE_THUMBNAIL, forceSingle: true },
        { fieldName: FOLDER_NAMES.SEASON_THUMBNAIL, forceSingle: true },
    ),
    SeriesControllers.createSeries);
router.get('/', SeriesControllers.getAllSeries);
router.get('/:id', SeriesControllers.getSeriesById);
router.patch('/:id', fileUploadHandler(),
    parseFileData(
        { fieldName: FOLDER_NAMES.SERIES_THUMBNAIL, forceSingle: true },
        { fieldName: FOLDER_NAMES.EPISODE_THUMBNAIL, forceSingle: true },
        { fieldName: FOLDER_NAMES.SEASON_THUMBNAIL, forceSingle: true },
    ),
    SeriesControllers.updateSeries);
router.delete('/:id', SeriesControllers.deleteSeriesById);

export const SeriesRoutes = router;