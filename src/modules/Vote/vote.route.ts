import express from "express";
import chackAuth from "../../middlewares/chackAuth";
import { VoteController } from "./vote.controller";
import { VoteValidationSchema } from "./vote.validation";
import validateRequest from "../../middlewares/validateRequest";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

// Cast a vote (upvote/downvote)
router.post(
  "/cast-vote",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  validateRequest(VoteValidationSchema.create),
  VoteController.castVote,
);

// Get vote stats for a guide
router.get("/stats/:guideId", VoteController.getVoteStats);

export const VoteRoutes = router;
