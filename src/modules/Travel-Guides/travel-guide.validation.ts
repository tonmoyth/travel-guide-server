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
    itinerary: z.array(ItineraryItemSchema).optional(),
    status: z.nativeEnum(GuideStatus).optional().default(GuideStatus.DRAFT),
    isPaid: z.boolean().optional().default(false),
    price: z.number().optional(),
    coverImage: z.string().optional(),
    // Note: medias are handled separately via file uploads
  }),
  update: z.object({
    title: z.string().optional(),
    destination: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    itinerary: z.array(ItineraryItemSchema).optional(),
    status: z.nativeEnum(GuideStatus).optional(),
    isPaid: z.boolean().optional(),
    price: z.number().optional(),
    coverImage: z.string().optional(),
  }),
};
