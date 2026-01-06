import { StatusCodes } from 'http-status-codes';
import { USER_ROLES } from '../../../enums/user';
import AppError from '../../../errors/AppError';
import { Follower } from './follow.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';
import { NotificationQueueHelper } from '../../../helpers/bullMQ/bullHelper';
import { PartnerRelation } from '../partner/partner.model';
import { isValidObjectId } from 'mongoose';

const followCreator = async (followerId: string, followingId: string) => {
     const followerUser = await User.isExistUserById(followerId);
     if (!followerUser) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Follower user not found!');
     }

     const followingUser = await User.isExistUserById(followingId);
     if (!followingUser) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Following user not found');
     }
     if (followerId === followingId) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'You cannot follow yourself');
     }

     // note: promoter can follow creator but creator cannot follow promoter

     // if (followerUser.role === USER_ROLES.PROMOTER && followingUser.role === USER_ROLES.CREATOR) {
     //      await
     // }

     // Check if already following
     const existingFollow = await Follower.findOne({
          followerId,
          followingId,
          followerRole: followerUser.role,
          followingRole: followingUser.role,
     });

     if (existingFollow) {
          throw new AppError(StatusCodes.CONFLICT, 'You are already following this creator');
     }

     // Create follow relationship
     const follower = await Follower.create({
          followerId,
          followingId,
          followerRole: followerUser.role,
          followingRole: followingUser.role,
     });

     // Update following user's totalFollowers
     if (follower) {
          await User.findByIdAndUpdate(followingId, {
               $inc: { totalFollowers: 1 },
          });
     }
     await NotificationQueueHelper.sendNotification(followingId, 'New Follower', `${followerUser.name} is now following you.`, 'NEW_FOLLOWER');
     return follower;
};
const unfollowCreator = async (followerId: string, followingId: string) => {
     const followerUser = await User.isExistUserById(followerId);
     if (!followerUser) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Follower user not found!');
     }
     console.log(followingId, followerId);
     const followingUser = await User.isExistUserById(followingId);

     if (!followingUser) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Following user not found');
     }

     const existingFollow = await Follower.findOne({
          followerId,
          followingId,
          followerRole: followerUser.role,
          followingRole: followingUser.role,
     });

     if (!existingFollow) {
          throw new AppError(StatusCodes.CONFLICT, 'You are not following this creator');
     }

     const result = await Follower.deleteOne({
          followerId,
          followingId,
          followerRole: followerUser.role,
          followingRole: followingUser.role,
     });
     // Update following user's totalFollowers
     if (result.deletedCount) {
          await User.findByIdAndUpdate(followingId, {
               $inc: { totalFollowers: -1 },
          });
     }
};

const updateFollowerRole = async (userId: string, newRole: USER_ROLES) => {
     await Follower.updateMany({ followerId: userId }, { $set: { followerRole: newRole } });
};
const handleCreatorToPromoterSwitch = async (userId: string) => {
     await updateFollowerRole(userId, USER_ROLES.PROMOTER);
};
const handlePromoterToCreatorSwitch = async (userId: string) => {
     await updateFollowerRole(userId, USER_ROLES.CREATOR);
};

const getFollowers = async (creatorId: string, query: Record<string, unknown>) => {
     const queryBuilder = new QueryBuilder(Follower.find({ followingId: creatorId }).populate('followerId', 'name email platforms image role rating'), query);
     const followers = await queryBuilder.paginate().fields().filter().sort().modelQuery.exec();
     const meta = await queryBuilder.countTotal();

     return {
          meta,
          followers,
     };
};
const getFollowing = async (userId: string, query: Record<string, unknown>) => {
     const user = await User.isExistUserById(userId);
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
     }
     const queryBuilder = new QueryBuilder(
          Follower.find({ followerId: userId, followerRole: user.role }).populate('followingId', 'name email image rating bio totalFollowers platforms engagement'),
          query,
     );
     const following = await queryBuilder.paginate().fields().filter().sort().modelQuery.exec();
     const meta = await queryBuilder.countTotal();

     return {
          meta,
          following,
     };
};
const getFollowerStats = async (creatorId: string) => {
     const stats = await Follower.aggregate([
          { $match: { followingId: creatorId } },
          {
               $group: {
                    _id: '$followerRole',
                    count: { $sum: 1 },
               },
          },
     ]);

     let creatorFollowers = 0;
     let promoterFollowers = 0;

     stats.forEach((stat) => {
          if (stat._id === USER_ROLES.CREATOR) {
               creatorFollowers = stat.count;
          } else if (stat._id === USER_ROLES.PROMOTER) {
               promoterFollowers = stat.count;
          }
     });

     return {
          totalFollowers: creatorFollowers + promoterFollowers,
          creatorFollowers,
          promoterFollowers,
     };
};
const isFollowing = async (followerId: string, followingId: string) => {
     const isExists = await User.findById(followerId).select('role');
     if (!isExists) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Follower user not found');
     }
     const existingFollow = await Follower.findOne({
          followerId,
          followingId,
          followerRole: isExists.role,
     });

     return existingFollow ? true : false;
};
const getMutualFollows = async (userId: string) => {
     const following = await Follower.find({ followerId: userId }).select('followingId').lean();

     const followingIds = following.map((f) => f.followingId);

     const mutual = await Follower.find({
          followerId: { $in: followingIds },
          followingId: userId,
     })
          .populate('followerId', 'name email image')
          .lean();

     return mutual;
};
const creatorVisibleToPromoter = async (creatorId: string, promoterId: string) => {
     const promoter = await User.findById(promoterId).select('role');
     if (!promoter) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Promoter not found');
     }
     if (promoter.role !== USER_ROLES.PROMOTER) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Target is not promoter');
     }

     // Core condition: promoter must follow this logged in creator
     const follow = await Follower.findOne({
          followerId: promoterId,
          followingId: creatorId,
          followerRole: USER_ROLES.PROMOTER,
          followingRole: USER_ROLES.CREATOR,
     }).select('_id');

     if (!follow) {
          throw new AppError(StatusCodes.FORBIDDEN, 'Not followed by promoter');
     }

     // Already trusted?
     const trusted = await PartnerRelation.findOne({
          promoterId,
          creatorId,
     }).select('_id status trustedAt');

     if (trusted) {
          return {
               success: true,
               showBecomePartner: false,
               isTrustedPartner: true,
               trustedAt: trusted.trustedAt,
          };
     }
     return {
          success: true,
          showBecomePartner: true,
          isTrustedPartner: false,
     };
};
const becomePartner = async (creatorId: string, promoterId: string) => {
     const creator = await User.findById(creatorId).select('role');
     if (!creator) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Creator not found');
     }
     if (creator.role !== USER_ROLES.CREATOR) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Target is not creator');
     }
     if (!isValidObjectId(promoterId)) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid promoterId');
     }

     // Security re-check: promoter must follow this creator
     const follow = await Follower.findOne({
          followerId: promoterId,
          followingId: creatorId,
          followerRole: USER_ROLES.PROMOTER,
          followingRole: USER_ROLES.CREATOR,
     }).select('_id');

     if (!follow) {
          throw new AppError(StatusCodes.FORBIDDEN, 'You are not eligible for this promoter');
     }

     // Upsert trusted relation
     const relation = await PartnerRelation.findOneAndUpdate(
          { promoterId, creatorId },
          { $setOnInsert: { promoterId, creatorId, status: 'trusted', trustedAt: new Date() } },
          { new: true, upsert: true },
     );

     return relation;
};
export const FollowerService = {
     followCreator,
     unfollowCreator,
     getFollowers,
     getFollowing,
     getFollowerStats,
     isFollowing,
     getMutualFollows,
     handleCreatorToPromoterSwitch,
     handlePromoterToCreatorSwitch,
     creatorVisibleToPromoter,
     becomePartner,
};
