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
    title: z.string().min(1),
    destination: z.string().min(1),
    description: z.string().min(1),
    categoryId: z.string().min(1),
    itinerary: z.array(ItineraryItemSchema).min(1),
    status: z.nativeEnum(GuideStatus).optional().default(GuideStatus.DRAFT),
    isPaid: z.boolean().optional().default(false),
    price: z.number().optional(),
    coverImage: z.string().optional(),
    medias: z
      .array(
        z.object({
          type: z.nativeEnum(MediaType),
          url: z.string().url(),
        }),
      )
      .min(1),
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
