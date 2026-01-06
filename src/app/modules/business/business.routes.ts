import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { BusinessController } from './business.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/create', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), BusinessController.createBusiness);

export const BannerRoutes = router;
