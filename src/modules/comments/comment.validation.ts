import * as z from "zod";

export const CommentValidationSchema = {
  create: z.object({
    guideId: z.string().min(1, "Guide ID is required"),
    comment: z.string().min(1, "Comment text is required"),
    parentId: z.string().optional(),
  }),
  update: z.object({
    comment: z.string().min(1, "Comment text is required"),
  }),
};
