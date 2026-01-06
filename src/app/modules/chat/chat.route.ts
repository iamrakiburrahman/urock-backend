import { Router } from 'express';
import { ChatController } from './chat.controller';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';

const router = Router();

// Existing routes
router.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CREATOR, USER_ROLES.PROMOTER), ChatController.getChats);
router.post('/create', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CREATOR, USER_ROLES.PROMOTER), ChatController.createChat);
router.patch('/mark-chat-as-read/:chatId', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CREATOR, USER_ROLES.PROMOTER), ChatController.markChatAsRead);
router.patch('/mark-chat-as-read-icon', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CREATOR, USER_ROLES.PROMOTER), ChatController.markMessagesAsIconViewed);
router.delete('/delete/:chatId', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CREATOR, USER_ROLES.PROMOTER), ChatController.deleteChat);

// New routes for additional features
router.patch('/mute-unmute/:chatId', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CREATOR, USER_ROLES.PROMOTER), ChatController.muteUnmuteChat);
router.patch('/block-unblock/:chatId/:targetUserId', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.CREATOR, USER_ROLES.PROMOTER), ChatController.blockUnblockUser);

export const ChatRoutes = router;
