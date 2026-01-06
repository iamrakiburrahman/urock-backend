import { Types } from "mongoose";
import { Review } from "./review.model";
import { TCreateReviewPayload, REVIEW_TYPE } from "./review.interface";
import AppError from "../../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const createReviewToDB = async (payload: TCreateReviewPayload, fromUserId: string) => {
     const { targetId, type, ratingValue, feedback } = payload;

     if (!targetId || !type) {
          throw new AppError(StatusCodes.BAD_REQUEST, "targetId and type are required");
     }

     if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Rating must be between 1 and 5");
     }

     if (targetId.toString() === fromUserId) {
          throw new AppError(StatusCodes.BAD_REQUEST, "You cannot review yourself");
     }

     // Already reviewed check
     const alreadyReviewed = await Review.findOne({
          fromUserId,
          targetId,
          type,
     });

     if (alreadyReviewed) {
          throw new AppError(StatusCodes.CONFLICT, "You have already reviewed this user");
     }

     const review = await Review.create({
          fromUserId: new Types.ObjectId(fromUserId),
          targetId: new Types.ObjectId(targetId),
          type,
          ratingValue,
          feedback: feedback?.trim(),
     });

     return review;
};

function isPopulatedUser(obj: any): obj is {
     _id: string;
     name: string;
     userName?: string;
     role: string;
     profileImage?: string
} {
     return obj && typeof obj === "object" && "name" in obj && "role" in obj;
}


const getReviewSummaryFromDB = async (targetId: string, type: REVIEW_TYPE) => {
     if (!targetId || !type) {
          throw new AppError(StatusCodes.BAD_REQUEST, "targetId and type are required");
     }

     const objectId = new Types.ObjectId(targetId);

     const matchQuery = { targetId: objectId, type };

     const summary = await Review.aggregate([
          { $match: matchQuery },
          { $group: { _id: "$ratingValue", count: { $sum: 1 } } },
     ]);

     const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
     let totalReviews = 0;
     let totalScore = 0;

     summary.forEach(item => {
          starCounts[item._id] = item.count;
          totalReviews += item.count;
          totalScore += item._id * item.count;
     });

     const reviews = await Review.find(matchQuery)
          .populate({
               path: "fromUserId",
               select: "name userName role image",
          })
          .sort({ createdAt: -1 })
          .lean();


     const reviewList = reviews.map((r: any) => ({
          reviewId: r._id,
          ratingValue: r.ratingValue,
          feedback: r.feedback,
          fromUser: r.fromUserId
               ? {
                    _id: r.fromUserId._id,
                    name: r.fromUserId.name,
                    userName: r.fromUserId.userName,
                    role: r.fromUserId.role,
                    image: r.fromUserId.image,
               }
               : null,
     }));

     return {
          averageRating: totalReviews ? Number((totalScore / totalReviews).toFixed(1)) : 0,
          totalReviews,
          starCounts,
          reviews: reviewList,
     };
};

export const ReviewServices = { createReviewToDB, getReviewSummaryFromDB };
