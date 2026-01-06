import { USER_ROLES } from '../../../enums/user';

export interface IFollower {
     followerId: string;
     followingId: string;
     followerRole: USER_ROLES;
     followingRole: USER_ROLES;
}

export interface IFollowRequest {
     followingId: string;
}

export interface IFollowerStats {
     totalFollowers: number;
     creatorFollowers: number;
     promoterFollowers: number;
}

export interface IFollowingStats {
     totalFollowing: number;
}
