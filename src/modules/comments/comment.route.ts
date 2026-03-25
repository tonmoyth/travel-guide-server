import express from "express";
import chackAuth from "../../middlewares/chackAuth";
import { CommentController } from "./comment.controller";
import { CommentValidationSchema } from "./comment.validation";
import validateRequest from "../../middlewares/validateRequest";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post(
  "/",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  validateRequest(CommentValidationSchema.create),
  CommentController.createComment,
);

router.get("/:guideId", CommentController.getComments);

router.patch(
  "/:commentId",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  validateRequest(CommentValidationSchema.update),
  CommentController.updateComment,
);

router.delete(
  "/:commentId",
  chackAuth(MemberRole.MEMBER, MemberRole.ADMIN),
  CommentController.deleteComment,
);

export const CommentRoutes = router;
