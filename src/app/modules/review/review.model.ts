import { Schema, model } from "mongoose";
import { TReview, REVIEW_TYPE } from "./review.interface";

const reviewSchema = new Schema<TReview>(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: Object.values(REVIEW_TYPE), required: true },
    ratingValue: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent duplicate review: same reviewer → same target → only once
reviewSchema.index({ fromUserId: 1, targetId: 1, type: 1 }, { unique: true });

export const Review = model<TReview>("Review", reviewSchema);
