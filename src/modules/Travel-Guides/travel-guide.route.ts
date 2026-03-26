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

router.get("/", chackAuth(), TravelGuideController.getAll);
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
router.delete(
  "/:id",
  chackAuth(MemberRole.MEMBER),
  TravelGuideController.remove,
);

export const TravelGuideRoutes = router;
