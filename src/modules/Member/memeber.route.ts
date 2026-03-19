import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import chackAuth from "../../middlewares/chackAuth";
import { MemberController } from "./memeber.controller";
import { MemberValidationSchema } from "./memeber.validation";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post(
  "/signup",
  validateRequest(MemberValidationSchema.signupValidationSchema),
  MemberController.signup,
);

router.post(
  "/login",
  validateRequest(MemberValidationSchema.loginValidationSchema),
  MemberController.login,
);

router.get(
  "/me",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  MemberController.getCurrentMember,
);

router.post("/logout", MemberController.logout);

export const MemberRoutes = router;
