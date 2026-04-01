import express from "express";

import chackAuth from "../../middlewares/chackAuth";
import { TravelGuideController } from "./travel-guide.controller";
import { TravelGuideValidationSchema } from "./travel-guide.validation";
import { MemberRole } from "../../../prisma/generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";

import optionalAuth from "../../middlewares/optionalAuth";

const router = express.Router();

// Specific routes MUST come before dynamic :id route
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

// Dynamic routes
router.get("/", TravelGuideController.getAll);
router.get("/:id", optionalAuth(), TravelGuideController.getById);

// Create guide route
router.post(
  "/",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),

  validateRequest(TravelGuideValidationSchema.create),
  TravelGuideController.create,
);

router.put(
  "/:id",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),

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

export const TravelGuideRoutes = router;
