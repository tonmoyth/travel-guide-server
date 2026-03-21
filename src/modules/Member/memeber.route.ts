import express from "express";

import chackAuth from "../../middlewares/chackAuth";
import { MemberController } from "./memeber.controller";
import { MemberValidationSchema } from "./memeber.validation";
import { MemberRole } from "../../../prisma/generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";

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

router.post("/getNewRefreshToken", MemberController.getNewRefreshToken);

// Google OAuth
router.get("/login/google", MemberController.googleLogin);
router.get("/google/success", MemberController.googleLoginSuccess);
router.get("/google/error", MemberController.handleGoogleError);

export const MemberRoutes = router;
