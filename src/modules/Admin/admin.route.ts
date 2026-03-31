import express from "express";

import chackAuth from "../../middlewares/chackAuth";
import { AdminController } from "./admin.controller";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.get(
  "/members",
  chackAuth(MemberRole.ADMIN),
  AdminController.getAllMembers,
);

router.patch(
  "/members/:id",
  chackAuth(MemberRole.ADMIN),
  AdminController.updateMemberStatus,
);

router.patch(
  "/members/:id/role",
  chackAuth(MemberRole.ADMIN),
  AdminController.updateMemberRole,
);

router.put(
  "/update-guide-status/:id",
  chackAuth(MemberRole.ADMIN),
  AdminController.updateGuideStatus,
);

//
router.get(
  "/all-guides",
  chackAuth(MemberRole.ADMIN),
  AdminController.getAllForAdmin,
);

router.get(
  "/rejected-guides",
  chackAuth(MemberRole.ADMIN),
  AdminController.getRejectedGuides,
);

router.get(
  "/under-review-guides",
  chackAuth(MemberRole.ADMIN),
  AdminController.getUnderReviewGuides,
);

router.get(
  "/approved-guides",
  chackAuth(MemberRole.ADMIN),
  AdminController.getApprovedGuides,
);

router.delete(
  "/guides/:id",
  chackAuth(MemberRole.ADMIN),
  AdminController.deleteGuideByAdmin,
);

router.patch(
  "/rejected-guides/:id",
  chackAuth(MemberRole.ADMIN),
  AdminController.updateRejectedGuide,
);

router.get(
  "/stats",
  chackAuth(MemberRole.ADMIN, MemberRole.MEMBER),
  AdminController.getStats,
);

export const AdminRoutes = router;
