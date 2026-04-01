import express from "express";
import optionalAuth from "../../middlewares/optionalAuth";
import { NewsletterController } from "./newsletter.controller";

const router = express.Router();

router.post("/subscribe", optionalAuth(), NewsletterController.subscribe);
router.post("/unsubscribe", optionalAuth(), NewsletterController.unsubscribe);
router.get("/", optionalAuth(), NewsletterController.getAll);

export const NewsletterRoutes = router;
