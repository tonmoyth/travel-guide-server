import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryController } from "./categories.controller";
import { CategoryValidationSchema } from "./categories.validation";

import { MemberRole } from "../../../prisma/generated/prisma/enums";
import chackAuth from "../../middlewares/chackAuth";

const router = express.Router();

router.get(
  "/",
  chackAuth(MemberRole.ADMIN, MemberRole.MEMBER),
  CategoryController.getAll,
);

router.get(
  "/:id",
  chackAuth(MemberRole.ADMIN, MemberRole.MEMBER),
  CategoryController.getById,
);

router.post(
  "/",
  chackAuth(MemberRole.ADMIN),
  validateRequest(CategoryValidationSchema.create),
  CategoryController.create,
);

router.put(
  "/:id",
  chackAuth(MemberRole.ADMIN),
  validateRequest(CategoryValidationSchema.update),
  CategoryController.update,
);
router.delete("/:id", chackAuth(MemberRole.ADMIN), CategoryController.remove);

export const CategoryRoutes = router;
