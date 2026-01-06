import express from "express";
import { ReviewControllers } from "./review.controller";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middleware/auth";

const router = express.Router();


router
     .route("/")
     .post(
          auth(USER_ROLES.PROMOTER, USER_ROLES.CREATOR),
          ReviewControllers.createReview
     )
     .get(
          ReviewControllers.getReviewSummary
     );

export const ReviewRoutes = router;