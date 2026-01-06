import express from 'express';
import { FollowerController } from './follow.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

router.post('/follow', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER), FollowerController.followCreator);
router.delete('/unfollow/:followingId', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER), FollowerController.unfollowCreator);

router.get('/:creatorId/followers', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER), FollowerController.getFollowers);
router.get('/following', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER), FollowerController.getFollowing);
router.get('/:creatorId/stats', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER), FollowerController.getFollowerStats);
router.get('/is-following/:creatorId', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER), FollowerController.isFollowing);
router.get('/mutual-follows', auth(USER_ROLES.CREATOR, USER_ROLES.PROMOTER), FollowerController.getMutualFollows);
router.get('/promoter/:promoterId/partner-cta', auth(USER_ROLES.CREATOR), FollowerController.creatorVisibleToPromoter);
router.post('/promoter/:promoterId/become-partner', auth(USER_ROLES.CREATOR), FollowerController.becomePartner);
export const FollowerRouter = router;
