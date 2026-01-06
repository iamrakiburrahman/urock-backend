import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FollowerService } from './follow.service';

const followCreator = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const { followingId } = req.body;

     const result = await FollowerService.followCreator(id, followingId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Followed creator successfully',
          data: result,
     });
});
const unfollowCreator = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const { followingId } = req.params;

     const result = await FollowerService.unfollowCreator(id, followingId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Unfollowed creator successfully',
          data: result,
     });
});
const getFollowers = catchAsync(async (req, res) => {
     const { creatorId } = req.params;
     const result = await FollowerService.getFollowers(creatorId, req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Followers retrieved successfully',
          data: result,
     });
});
const getFollowing = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const result = await FollowerService.getFollowing(id, req.query);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Following retrieved successfully',
          data: result.following,
          meta: result.meta,
     });
});
const getFollowerStats = catchAsync(async (req, res) => {
     const { creatorId } = req.params;
     const result = await FollowerService.getFollowerStats(creatorId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Follower stats retrieved successfully',
          data: result,
     });
});
const isFollowing = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const { followingId } = req.params;
     const result = await FollowerService.isFollowing(id, followingId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Following status retrieved successfully',
          data: result,
     });
});
const getMutualFollows = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const result = await FollowerService.getMutualFollows(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Mutual follows retrieved successfully',
          data: result,
     });
});
const creatorVisibleToPromoter = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const { promoterId } = req.params;
     const result = await FollowerService.creatorVisibleToPromoter(id, promoterId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Creator visibility to promoter retrieved successfully',
          data: result,
     });
});
const becomePartner = catchAsync(async (req, res) => {
     const { id } = req.user as { id: string };
     const { promoterId } = req.params;
     const result = await FollowerService.becomePartner(id, promoterId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Partner relation created successfully',
          data: result,
     });
});
export const FollowerController = {
     followCreator,
     unfollowCreator,
     getFollowers,
     getFollowing,
     getFollowerStats,
     isFollowing,
     getMutualFollows,
     creatorVisibleToPromoter,
     becomePartner,
};
