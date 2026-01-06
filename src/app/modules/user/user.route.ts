import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middleware/auth';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import validateRequest from '../../middleware/validateRequest';
import parseFileData from '../../middleware/parseFileData';
import { FOLDER_NAMES } from '../../../enums/files';
const router = express.Router();

router
     .route('/profile')
     .get(auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN), UserController.getUserProfile)
     .patch(
          auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
          fileUploadHandler(),
          parseFileData({ fieldName: FOLDER_NAMES.IMAGE, forceSingle: true }),
          UserController.updateProfile,
     );
router.get('/check-field', UserController.checkFieldAvailability);
router.post('/register', validateRequest(UserValidation.createUserZodSchema), UserController.registerUser);
router.post(
     '/complete-registration',
     auth(USER_ROLES.USER),
     fileUploadHandler(),
     parseFileData({ fieldName: FOLDER_NAMES.IMAGE, forceSingle: true }),
     validateRequest(UserValidation.completeRegistrationZodSchema),
     UserController.completeRegistration,
);
router.post('/switched-role', auth(USER_ROLES.USER), UserController.toggleUserRole);
router.delete('/delete/account', auth(USER_ROLES.USER), UserController.deleteAccount);

// Admin routes for user management
router.route('/admin').post(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), validateRequest(UserValidation.createUserZodSchema), UserController.createAdmin);

export const UserRouter = router;
