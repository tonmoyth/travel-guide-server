import * as z from "zod";

export const CategoryValidationSchema = {
  create: z.object({
    slug: z.string().min(1, "Slug is required and cannot be empty"),
    title: z.string().min(1, "Title is required and cannot be empty"),
    description: z.string().optional(),
  }),
  update: z.object({
    slug: z
      .string()
      .min(1, "Slug must be at least 1 character long")
      .optional(),
    title: z
      .string()
      .min(1, "Title must be at least 1 character long")
      .optional(),
    description: z.string().optional(),
  }),
};
