import { Schema, model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import { IFollower } from './follow.interface';

const followerSchema = new Schema<IFollower>(
     {
          followerId: {
               type: String,
               required: true,
               ref: 'User',
               index: true,
          },
          followingId: {
               type: String,
               required: true,
               ref: 'User',
               index: true,
          },
          followerRole: {
               type: String,
               enum: Object.values(USER_ROLES),
               required: true,
          },
          followingRole: {
               type: String,
               enum: Object.values(USER_ROLES),
               required: true,
          },
     },
     {
          timestamps: true,
     },
);

export const Follower = model<IFollower>('Follower', followerSchema);
