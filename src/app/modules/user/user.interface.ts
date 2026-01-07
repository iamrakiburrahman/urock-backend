import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
     name: string;
     userName?: string;
     role: USER_ROLES;
     email: string;
     password?: string;
     image?: string;
     isDeleted: boolean;
     stripeCustomerId: string;
     status: 'active' | 'blocked';
     isVerified: boolean;
     googleId?: string;
     oauthProvider?: 'google';
     country?: string;
     birthday?: Date;
     gender?: 'male' | 'female' | 'other';
     totalFollowers?: number;
     location?: string;
     interest?: string[];
     stripeConnectAccount: {
          accountId: string;
          accountStatus: 'pending' | 'active' | 'rejected';
          onboardingComplete: boolean;
          loginUrl: string;
          bankAccountInfo: {
               accountNumber: string;
               routingNumber: string;
               accountHolderName: string;
               bankName: string;
          };
          payoutEnabled: boolean;
          chargesEnabled: boolean;
          lastUpdated: Date;
     };
     authentication?: {
          isResetPassword: boolean;
          oneTimeCode: number;
          expireAt: Date;
     };
     //  online Status Interface
     onlineStatus?: {
          isOnline?: boolean;
          lastSeen?: Date;
          lastHeartbeat?: Date;
     };
};

export type IUserProfile = {
     // User core info
     name: string;
     image?: string;

     // Personal info
     bio?: string;
     birthday?: Date;
     gender?: 'male' | 'female' | 'other';

     tiktokUserName: string;
     instagramUserName: string;
     youtubeUserName: string;
     tiktokFollowers: number;
     instagramFollowers: number;
     youtubeFollowers: number;
     contentTypes: string[];
     totalFollowers: number;
     location?: string;
     country: string;
};

export type UserProfileModel = {
     isExistUserById(id: string): any;
     isExistUserByEmail(email: string): any;
     isExistUserByPhone(contact: string): any;
     isMatchPassword(password: string, hashPassword: string): boolean;

     setUserOnline(userId: string): Promise<void>;
     setUserOffline(userId: string): Promise<void>;
     updateHeartbeat(userId: string): Promise<void>;
     getOnlineUsers(): Promise<IUserProfile[]>;
     bulkUserStatus(userIds: string[]): Promise<IUserProfile[]>;
} & Model<IUserProfile>;

export type UserModel = {
     isExistUserById(id: string): any;
     isExistUserByEmail(email: string): any;
     isExistUserByPhone(contact: string): any;
     isMatchPassword(password: string, hashPassword: string): boolean;
     // ✅ Online Status Methods
     setUserOnline(userId: string): Promise<void>;
     setUserOffline(userId: string): Promise<void>;
     updateHeartbeat(userId: string): Promise<void>;
     getOnlineUsers(): Promise<IUser[]>;
     bulkUserStatus(userIds: string[]): Promise<IUser[]>;
} & Model<IUser>;
