import express from "express";

import chackAuth from "../../middlewares/chackAuth";
import { TravelGuideController } from "./travel-guide.controller";
import { TravelGuideValidationSchema } from "./travel-guide.validation";
import { MemberRole } from "../../../prisma/generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import {
  uploadGuideMediaWithCover,
  uploadSingleImage,
} from "../../config/multer";
import optionalAuth from "../../middlewares/optionalAuth";

const router = express.Router();

router.get("/", TravelGuideController.getAll);

router.get(
  "/draft-guides",
  chackAuth(MemberRole.MEMBER),
  TravelGuideController.getMemberDraftGuides,
);

router.get(
  "/my-approved-guides",
  chackAuth(MemberRole.MEMBER),
  TravelGuideController.getMyApprovedGuides,
);

router.get(
  "/my-under-review-guides",
  chackAuth(MemberRole.MEMBER),
  TravelGuideController.getMyUnderReviewGuides,
);

router.get(
  "/top-voted",
  optionalAuth(),
  TravelGuideController.getTopVotedGuides,
);

//
router.get("/:id", optionalAuth(), TravelGuideController.getById);

// Create guide with multiple image and video uploads
router.post(
  "/",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  uploadGuideMediaWithCover, // Multiple images, videos, and optional cover image
  validateRequest(TravelGuideValidationSchema.create),
  TravelGuideController.create,
);

router.put(
  "/:id",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  uploadSingleImage, // Single cover image for update
  validateRequest(TravelGuideValidationSchema.update),
  TravelGuideController.update,
);
router.patch(
  "/:id/submit-for-review",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  TravelGuideController.submitForReview,
);

router.delete(
  "/:id",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  TravelGuideController.remove,
);

router.get(
  "/top-voted",
  optionalAuth(),
  TravelGuideController.getTopVotedGuides,
);

export const TravelGuideRoutes = router;
