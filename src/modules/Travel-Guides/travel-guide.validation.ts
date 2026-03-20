import * as z from "zod";

export const TravelGuideValidationSchema = {
  create: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    location: z.string().optional(),
  }),
  update: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
  }),
};
