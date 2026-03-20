import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TravelGuideController } from "./travel-guide.controller";
import { TravelGuideValidationSchema } from "./travel-guide.validation";

const router = express.Router();

router.get("/", TravelGuideController.getAll);
router.get("/:id", TravelGuideController.getById);

router.post(
  "/",
  validateRequest(TravelGuideValidationSchema.create),
  TravelGuideController.create,
);

router.put(
  "/:id",
  validateRequest(TravelGuideValidationSchema.update),
  TravelGuideController.update,
);
router.delete("/:id", TravelGuideController.remove);

export const TravelGuideRoutes = router;
