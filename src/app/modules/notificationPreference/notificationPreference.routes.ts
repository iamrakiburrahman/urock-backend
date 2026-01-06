import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { NotificationPreferenceController } from './notificationPreference.controller';
import auth from '../../middleware/auth';
const router = express.Router();

router.get('/preferences', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), NotificationPreferenceController.getUserPreference);
router.patch('/preferences', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), NotificationPreferenceController.updateUserPreference);

export const NotificationRoutes = router;
