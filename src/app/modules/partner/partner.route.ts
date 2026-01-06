import express from 'express';
import { PartnerController } from './partner.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

router.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CREATOR, USER_ROLES.PROMOTER), PartnerController.getAllPartners);
router.get('/promoter', auth(USER_ROLES.CREATOR), PartnerController.getAllPartnersForPromoter);
router.get('/creator', auth(USER_ROLES.PROMOTER), PartnerController.getAllPartnersForCreator);

export const partnerRoutes = router;
