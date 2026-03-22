import {
  GuideStatus,
  MediaType,
} from "../../../prisma/generated/prisma/browser";
import { JsonArray } from "../../../prisma/generated/prisma/internal/prismaNamespace";

export type ItineraryItem = {
  day: number;
  title: string;
  activities: string[];
};

export type TravelGuideCreateInput = {
  title: string;
  destination: string;
  description: string;
  categoryId: string;
  itinerary: ItineraryItem[];
  status?: GuideStatus;
  isPaid?: boolean;
  price?: number;
  coverImage?: string;
  medias: {
    type: MediaType;
    url: string;
  }[];
};

export type TravelGuide = {
  id: string;
  memberId: string;
  categoryId: string;
  title: string;
  description: string;
  itinerary: JsonArray; // JSON string
  status: GuideStatus;
  isPaid: boolean;
  price: number | null;
  coverImage: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
