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

const router = express.Router();

router.get("/", TravelGuideController.getAll);

router.get(
  "/admin/all-guides",
  chackAuth(MemberRole.ADMIN),
  TravelGuideController.getAllForAdmin,
);

router.get(
  "/admin/rejected-guides",
  chackAuth(MemberRole.ADMIN),
  TravelGuideController.getRejectedGuides,
);

router.get(
  "/admin/under-review-guides",
  chackAuth(MemberRole.ADMIN),
  TravelGuideController.getUnderReviewGuides,
);

router.get(
  "/admin/approved-guides",
  chackAuth(MemberRole.ADMIN),
  TravelGuideController.getApprovedGuides,
);

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

router.get("/:id", chackAuth(), TravelGuideController.getById);

// Create guide with multiple image and video uploads
router.post(
  "/",
  chackAuth(MemberRole.MEMBER),
  uploadGuideMediaWithCover, // Multiple images, videos, and optional cover image
  validateRequest(TravelGuideValidationSchema.create),
  TravelGuideController.create,
);

router.put(
  "/:id",
  chackAuth(MemberRole.MEMBER),
  uploadSingleImage, // Single cover image for update
  validateRequest(TravelGuideValidationSchema.update),
  TravelGuideController.update,
);
router.patch(
  "/:id/submit-for-review",
  chackAuth(MemberRole.MEMBER),
  TravelGuideController.submitForReview,
);

router.delete(
  "/:id",
  chackAuth(MemberRole.MEMBER),
  TravelGuideController.remove,
);

export const TravelGuideRoutes = router;
