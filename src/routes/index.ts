import express from "express";
import { MemberRoutes } from "../modules/Member/memeber.route";
import { TravelGuideRoutes } from "../modules/Travel-Guides/travel-guide.route";
import { CategoryRoutes } from "../modules/categories/categories.route";
import { AdminRoutes } from "../modules/Admin/admin.route";

const router = express.Router();

// Member routes
router.use("/members", MemberRoutes);

// Travel guide routes
router.use("/travel-guides", TravelGuideRoutes);

// Category routes
router.use("/categories", CategoryRoutes);

// Admin routes
router.use("/admin", AdminRoutes);

export default router;
