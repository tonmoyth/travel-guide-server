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

router.put(
  "/update-guide-status/:id",
  chackAuth(MemberRole.ADMIN),
  AdminController.updateGuideStatus,
);

export const AdminRoutes = router;
