import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import { ContactControllers } from './contact.controller';



const router = express.Router();


router.post(
    '/send-message',
    auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER),
    ContactControllers.createContact
);


router.get(
    '/',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ContactControllers.getAllContacts
);


router.get(
    '/:id',
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    ContactControllers.getContactById
);


router.delete(
    '/:id',
     auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN),
    ContactControllers.deleteContactById
);

export const ContactRoutes = router;