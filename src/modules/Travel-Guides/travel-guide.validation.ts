import * as z from "zod";
import {
  GuideStatus,
  MediaType,
} from "../../../prisma/generated/prisma/browser";

const ItineraryItemSchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  activities: z.array(z.string().min(1)),
});

export const TravelGuideValidationSchema = {
  create: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().min(1, "Category ID is required"),
    destination: z.string().optional(),

    itinerary: z.preprocess((value) => {
      if (typeof value === "string" && value) {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    }, z.array(ItineraryItemSchema).optional()),

    status: z.nativeEnum(GuideStatus).optional().default(GuideStatus.DRAFT),

    isPaid: z.preprocess((value) => {
      if (typeof value === "string") {
        return value === "true" || value === "1";
      }
      return value;
    }, z.boolean().optional().default(false)),

    price: z.preprocess((value) => {
      if (typeof value === "string" && value) {
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
      }
      return value;
    }, z.number().optional()),

    // Accept both string URLs and file objects from multer
    coverImage: z.union([z.string().url(), z.any()]).optional(),
  }),
  update: z.object({
    title: z.string().optional(),
    destination: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().optional(),

    itinerary: z.preprocess((value) => {
      if (typeof value === "string" && value) {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    }, z.array(ItineraryItemSchema).optional()),

    isPaid: z.preprocess((value) => {
      if (typeof value === "string") {
        return value === "true" || value === "1";
      }
      return value;
    }, z.boolean().optional()),

    price: z.preprocess((value) => {
      if (typeof value === "string" && value) {
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
      }
      return value;
    }, z.number().optional()),

    coverImage: z.string().optional(),
  }),
};
