import express from "express";

import chackAuth from "../../middlewares/chackAuth";
import { TravelGuideController } from "./travel-guide.controller";
import { TravelGuideValidationSchema } from "./travel-guide.validation";
import { MemberRole } from "../../../prisma/generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { multerUpload } from "../../config/multer";

const router = express.Router();

router.get("/", chackAuth(), TravelGuideController.getAll);
router.get("/:id", chackAuth(), TravelGuideController.getById);

router.post(
  "/",
  chackAuth(MemberRole.MEMBER),
  multerUpload.single("file"),
  // validateRequest(TravelGuideValidationSchema.create),
  TravelGuideController.create,
);

router.put(
  "/:id",
  chackAuth(MemberRole.MEMBER),
  validateRequest(TravelGuideValidationSchema.update),
  TravelGuideController.update,
);
router.delete(
  "/:id",
  chackAuth(MemberRole.MEMBER),
  TravelGuideController.remove,
);

export const TravelGuideRoutes = router;
