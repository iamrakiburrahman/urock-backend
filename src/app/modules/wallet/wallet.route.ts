import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { WalletController } from './wallet.controller';
import auth from '../../middleware/auth';
const router = express.Router();

// Wallet routes
router.get('/balance', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER), WalletController.getBalance);
router.get('/transactions', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER), WalletController.getTransactions);

export const WalletRouter = router;
