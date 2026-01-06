import { Types } from "mongoose";

export enum REVIEW_TYPE {
  CREATOR = "CREATOR",
  PROMOTER = "PROMOTER",
}

export type TCreateReviewPayload = {
  targetId: Types.ObjectId;
  type: REVIEW_TYPE;
  ratingValue: number;
  feedback?: string;
};

export type TReview = {
  fromUserId: Types.ObjectId;
  targetId: Types.ObjectId;
  type: REVIEW_TYPE;
  ratingValue: number;
  feedback?: string;
};
