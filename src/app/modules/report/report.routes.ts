import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { ReportController } from './report.controller';
import auth from '../../middleware/auth';
const router = express.Router();

router.post('/create', auth(USER_ROLES.PROMOTER, USER_ROLES.CREATOR), ReportController.createReport);
router.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReportController.getReports);
router.post('/:reportId/action', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReportController.takeActionOnReport);
router.post('/:reportId/disable', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReportController.disableCampaign);
router.delete('/:reportId', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), ReportController.deleteReport);

export const ReportRoutes = router;
