import express from "express";
import { AIController } from "./ai.controller";
import chackAuth from "../../middlewares/chackAuth";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

// Define AI chat route
router.post("/chat", chackAuth(MemberRole.MEMBER, MemberRole.ADMIN), AIController.chatWithAI);

export const AIRoutes = router;
