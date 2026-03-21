import { TravelGuide, TravelGuideCreateInput } from "./travel-guide.interface";
import { prisma } from "../../lib/prisma";
import {
  GuideStatus,
  MemberRole,
} from "../../../prisma/generated/prisma/browser";
import AppError from "../../errors/AppError";

const getAll = async (
  userId: string,
  userRole: string,
): Promise<TravelGuide[]> => {
  if (userRole === MemberRole.MEMBER) {
    // Member gets only their own guides
    return await prisma.travelGuide.findMany({
      where: { isDeleted: false, memberId: userId },
    });
  } else {
    //for all other role get all guides
    return await prisma.travelGuide.findMany({
      where: { isDeleted: false },
    });
  }
};

const getById = async (
  id: string,
  userId: string,
): Promise<TravelGuide | null> => {
  // Member can only view their own guides
  return await prisma.travelGuide.findUnique({
    where: { id, isDeleted: false, memberId: userId },
  });
};

const create = async (
  data: TravelGuideCreateInput,
  memberId: string,
): Promise<TravelGuide> => {
  // Use transaction
  const result = await prisma.$transaction(async (tx) => {
    const guide = await tx.travelGuide.create({
      data: {
        memberId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        itinerary: JSON.stringify(data.itinerary),
        status: data.status || GuideStatus.DRAFT,
        isPaid: data.isPaid || false,
        price: data.price,
        coverImage: data.coverImage,
      },
    });

    const medias = await Promise.all(
      data.medias.map((media) =>
        tx.guideMedia.create({
          data: {
            guideId: guide.id,
            type: media.type,
            url: media.url,
          },
        }),
      ),
    );

    return { ...guide, guideMedia: medias };
  });

  return result as TravelGuide;
};

const update = async (
  id: string,
  data: Partial<TravelGuideCreateInput>,
  userId: string,
  userRole: string,
): Promise<TravelGuide> => {
  // Check if guide exists
  const guide = await prisma.travelGuide.findUnique({
    where: { id },
  });

  if (!guide) {
    throw new AppError(404, "Travel guide not found");
  }

  // Check authorization - only owner or admin can update
  if (userRole !== MemberRole.ADMIN && guide.memberId !== userId) {
    throw new AppError(
      403,
      "Forbidden: You can only update your own travel guides",
    );
  }

  if (
    guide.status === GuideStatus.UNDER_REVIEW ||
    guide.status === GuideStatus.APPROVED
  ) {
    throw new AppError(
      400,
      "Cannot update guide that is under review or approved",
    );
  }

  // Update the guide
  const updatedGuide = await prisma.travelGuide.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      itinerary: data.itinerary ? JSON.stringify(data.itinerary) : undefined,
      status: data.status,
      isPaid: data.isPaid,
      price: data.price,
      coverImage: data.coverImage,
    },
  });

  return updatedGuide as TravelGuide;
};

const remove = async (
  id: string,
  userId: string,
  userRole: string,
): Promise<void> => {
  // Check if guide exists
  const guide = await prisma.travelGuide.findUnique({
    where: { id },
  });

  if (!guide) {
    throw new AppError(404, "Travel guide not found");
  }

  // Check authorization - only owner or admin can delete
  if (userRole !== MemberRole.ADMIN && guide.memberId !== userId) {
    throw new AppError(
      403,
      "Forbidden: You can only delete your own travel guides",
    );
  }

  if (
    guide.status === GuideStatus.UNDER_REVIEW ||
    guide.status === GuideStatus.APPROVED
  ) {
    throw new AppError(
      400,
      "Cannot delete guide that is under review or approved",
    );
  }

  // Soft delete - mark as deleted
  await prisma.travelGuide.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

export const TravelGuideService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
