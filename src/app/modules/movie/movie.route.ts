import express from "express";
import { MovieControllers } from "./movie.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.post('/',auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), MovieControllers.createMovie);
router.get('/', MovieControllers.getAllMovies);
router.get('/:id', MovieControllers.getMovieById);
router.patch('/:id',auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), MovieControllers.updateMovieById);
router.delete('/:id',auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), MovieControllers.deleteMovieById);

export const MovieRoutes = router;