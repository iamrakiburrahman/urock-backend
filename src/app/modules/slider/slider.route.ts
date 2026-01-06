import { Router } from 'express';
import { SliderController } from './slider.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

router
     .post('/create', auth(USER_ROLES.ADMIN, USER_ROLES.PROMOTER, USER_ROLES.CREATOR, USER_ROLES.SUPER_ADMIN), SliderController.createSlider)
     .get('/', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), SliderController.getAllSliders)
     .get('/all', SliderController.getSliders)
     .get('/get-single/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), SliderController.getSliderById)
     .put('/update/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), SliderController.updateSlider)
     .delete('/delete/:id', auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), SliderController.deleteSlider);

export const SliderRouter = router;
