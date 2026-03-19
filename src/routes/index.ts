import express from "express";
import { MemberRoutes } from "../modules/Member/memeber.route";

const router = express.Router();

// Member routes
router.use("/members", MemberRoutes);

// Add other module routes here as they are created
// router.use('/guides', GuideRoutes);
// etc.

export default router;
