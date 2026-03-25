import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { CommentService } from "./comment.service";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user!.id;
  const payload = req.body;

  const result = await CommentService.createComment(memberId, payload);
  res.status(201).json({
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});

const getComments = catchAsync(async (req: Request, res: Response) => {
  const guideId = req.params.guideId as string;

  const result = await CommentService.getNestedComments(guideId);
  res.status(200).json({
    success: true,
    message: "Comments retrieved successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId as string;
  const memberId = req.user!.id;
  const memberRole = req.user!.role;
  const payload = req.body;

  const result = await CommentService.updateComment(
    commentId,
    memberId,
    memberRole,
    payload,
  );
  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.commentId as string;
  const memberId = req.user!.id;
  const memberRole = req.user!.role;

  const result = await CommentService.deleteComment(
    commentId,
    memberId,
    memberRole,
  );
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const CommentController = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
