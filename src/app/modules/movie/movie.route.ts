import express from "express";
import { MovieControllers } from "./movie.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middleware/fileUploadHandler";
import parseFileData from "../../middleware/parseFileData";
import { FOLDER_NAMES } from "../../../enums/files";
import parseJsonMiddleware from "../../middleware/dataParseHandler";
import optionalAuth from "../../middleware/optionalAuth";

const router = express.Router();

router.post('/',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    parseFileData(
        { fieldName: FOLDER_NAMES.THUMBNAIL, forceSingle: true },
        { fieldName: FOLDER_NAMES.TRAILER, forceSingle: true },
        { fieldName: FOLDER_NAMES.MOVIE, forceSingle: true },
    ),
    MovieControllers.createMovie);

router.get('/', optionalAuth(), MovieControllers.getAllMovies);

router.get('/related/:id', MovieControllers.getRelatedMovies);

router.get('/:id', MovieControllers.getMovieById);

router.patch('/:id/status',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    MovieControllers.updateMovieStatus);

router.patch('/:id',
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    parseFileData(
        { fieldName: FOLDER_NAMES.THUMBNAIL, forceSingle: true },
        { fieldName: FOLDER_NAMES.TRAILER, forceSingle: true },
        { fieldName: FOLDER_NAMES.MOVIE, forceSingle: true },
    ),
    MovieControllers.updateMovieById);
    
router.delete('/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), MovieControllers.deleteMovieById);

export const MovieRoutes = router;