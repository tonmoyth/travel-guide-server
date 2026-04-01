import express from "express";
import { MemberRoutes } from "../modules/Member/memeber.route";
import { TravelGuideRoutes } from "../modules/Travel-Guides/travel-guide.route";
import { CategoryRoutes } from "../modules/categories/categories.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { NewsletterRoutes } from "../modules/Newsletter/newsletter.route";
import { VoteRoutes } from "../modules/Vote/vote.route";
import { CommentRoutes } from "../modules/comments/comment.route";
import { PaymentRoutes } from "../modules/payment/payment.route";

const router = express.Router();

// Member routes
router.use("/members", MemberRoutes);

// Travel guide routes
router.use("/travel-guides", TravelGuideRoutes);

// Category routes
router.use("/categories", CategoryRoutes);

// Vote routes
router.use("/votes", VoteRoutes);

// Comment routes
router.use("/comments", CommentRoutes);

// Payment routes
router.use("/payments", PaymentRoutes);

// Admin routes
router.use("/admin", AdminRoutes);

// Newsletter routes
router.use("/newsletter", NewsletterRoutes);

export default router;
