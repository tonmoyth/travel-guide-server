import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import {
  Comment,
  CreateCommentPayload,
  UpdateCommentPayload,
} from "./comment.interface";
import { MemberRole } from "../../../prisma/generated/prisma/enums";

const createComment = async (
  memberId: string,
  payload: CreateCommentPayload,
): Promise<Comment> => {
  const { guideId, comment, parentId } = payload;

  const guide = await prisma.travelGuide.findUnique({ where: { id: guideId } });
  if (!guide) throw new AppError(404, "Travel guide not found");

  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment || parentComment.isDeleted) {
      throw new AppError(404, "Parent comment not found");
    }
    if (parentComment.guideId !== guideId) {
      throw new AppError(400, "Parent comment must belong to same guide");
    }
  }

  const created = await prisma.comment.create({
    data: {
      guideId,
      memberId,
      parentId: parentId ?? null,
      comment,
    },
  });

  return created;
};

const getNestedComments = async (guideId: string): Promise<Comment[]> => {
  const guide = await prisma.travelGuide.findUnique({ where: { id: guideId } });
  if (!guide) throw new AppError(404, "Travel guide not found");

  const comments = await prisma.comment.findMany({
    where: {
      guideId,
      isDeleted: false,
    },
    include: {
      member: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const map = new Map<string, Comment & { replies: Comment[] }>();
  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  const roots: Comment[] = [];

  comments.forEach((c) => {
    const enhanced = map.get(c.id)!;
    if (c.parentId) {
      const parent = map.get(c.parentId);
      if (parent) {
        parent.replies.push(enhanced);
      }
    } else {
      roots.push(enhanced);
    }
  });

  return roots;
};

const updateComment = async (
  commentId: string,
  memberId: string,
  memberRole: string,
  payload: UpdateCommentPayload,
): Promise<Comment> => {
  const existing = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!existing || existing.isDeleted) {
    throw new AppError(404, "Comment not found");
  }

  if (existing.memberId !== memberId && memberRole !== MemberRole.ADMIN) {
    throw new AppError(403, "You can only update your own comments");
  }

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: { comment: payload.comment },
  });

  return updated;
};

const deleteComment = async (
  commentId: string,
  memberId: string,
  memberRole: string,
): Promise<{ message: string }> => {
  const existing = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!existing || existing.isDeleted) {
    throw new AppError(404, "Comment not found");
  }

  if (existing.memberId !== memberId && memberRole !== MemberRole.ADMIN) {
    throw new AppError(403, "Not authorized to delete this comment");
  }

  const allComments = await prisma.comment.findMany({
    where: {
      guideId: existing.guideId,
      isDeleted: false,
    },
  });

  const childMap = new Map<string, string[]>();
  allComments.forEach((c) => {
    if (!c.parentId) return;
    const array = childMap.get(c.parentId) ?? [];
    array.push(c.id);
    childMap.set(c.parentId, array);
  });

  const idsToSoftDelete = new Set<string>();
  const stack = [existing.id];

  while (stack.length) {
    const current = stack.pop()!;
    if (idsToSoftDelete.has(current)) continue;
    idsToSoftDelete.add(current);
    const children = childMap.get(current);
    if (!children) continue;
    children.forEach((childId) => stack.push(childId));
  }

  await prisma.comment.updateMany({
    where: {
      id: { in: Array.from(idsToSoftDelete) },
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return { message: "Comment deleted successfully" };
};

export const CommentService = {
  createComment,
  getNestedComments,
  updateComment,
  deleteComment,
};
