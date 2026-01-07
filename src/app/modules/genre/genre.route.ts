import express from "express";
import { GenreControllers } from "./genre.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();
router.post('/', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), GenreControllers.createGenre);
router.get('/', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), GenreControllers.getAllGenres);
router.get('/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), GenreControllers.getGenreById);
router.put('/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), GenreControllers.updateGenreById);
router.delete('/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), GenreControllers.deleteGenreById);

export const GenreRoutes = router;