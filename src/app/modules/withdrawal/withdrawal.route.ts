import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { WithdrawalController } from './withdrawal.controller';
import auth from '../../middleware/auth';
const router = express.Router();

router.post('/create', auth(USER_ROLES.PROMOTER, USER_ROLES.CREATOR), WithdrawalController.createWithdrawal);
router.get('/', auth(USER_ROLES.PROMOTER, USER_ROLES.CREATOR), WithdrawalController.getAllWithdrawal);
router.get('/admin', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), WithdrawalController.getAllWithdrawalForAdmin);
router.put('/approve/:requestId', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), WithdrawalController.approveWithdrawalById);
router.put('/reject/:requestId', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), WithdrawalController.rejectWithdrawalById);

export const WithdrawalRouter = router;
