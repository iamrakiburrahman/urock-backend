import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewServices } from "./review.service";
import { StatusCodes } from "http-status-codes";
import { REVIEW_TYPE } from "./review.interface";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { id: fromUserId } = req.user as any; // logged-in user
  const payload = req.body;

  const result = await ReviewServices.createReviewToDB(payload, fromUserId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getReviewSummary = catchAsync(async (req: Request, res: Response) => {
  const { targetId, type } = req.query;

  const result = await ReviewServices.getReviewSummaryFromDB(
    targetId as string,
    type as REVIEW_TYPE,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Review summary retrieved successfully",
    data: result,
  });
});

export const ReviewControllers = { createReview, getReviewSummary };
