import { TravelGuide, TravelGuideCreateInput } from "./travel-guide.interface";
import { prisma } from "../../lib/prisma";
import {
  GuideStatus,
  MemberRole,
  Prisma,
} from "../../../prisma/generated/prisma/browser";
import AppError from "../../errors/AppError";
import {
  IQueryParams,
  IQueryResult,
} from "../../interface/queryBuilder.interface";
import { QueryBuilder } from "../../utils/queryBuilder";
import { SearchableFields, FilterableFields } from "./travel-guide.constant";
import { truncateText } from "../../shared/trancateText";

const getAll = async (
  query: IQueryParams = {},
): Promise<IQueryResult<TravelGuide>> => {
  const queryBuilder = new QueryBuilder<
    TravelGuide,
    Prisma.TravelGuideWhereInput,
    Prisma.TravelGuideInclude
  >(prisma.travelGuide, query, {
    searchableFields: SearchableFields,
    filterableFields: FilterableFields,
  });

  queryBuilder.where({ isDeleted: false, status: GuideStatus.APPROVED });

  const results = await queryBuilder
    .search()
    .filter()
    .include({ guideMedia: true, votes: true, comments: true, category: true })
    .paginate()
    .sort()
    .fields()
    .execute();

  return results;
};

// const getAllForAdmin = async (
//   query: IQueryParams = {},
// ): Promise<IQueryResult<TravelGuide>> => {
//   const queryBuilder = new QueryBuilder<
//     TravelGuide,
//     Prisma.TravelGuideWhereInput,
//     Prisma.TravelGuideInclude
//   >(prisma.travelGuide, query, {
//     searchableFields: SearchableFields,
//     filterableFields: FilterableFields,
//   });

//   queryBuilder.where({ isDeleted: false });

//   const results = await queryBuilder
//     .search()
//     .filter()
//     .include({ guideMedia: true, votes: true, comments: true, category: true })
//     .paginate()
//     .sort()
//     .fields()
//     .execute();

//   return results;
// };

const getMemberDraftGuides = async (
  memberId: string,
  query: IQueryParams = {},
): Promise<IQueryResult<TravelGuide>> => {
  const safeQuery = { ...query };
  delete (safeQuery as any).status;
  delete (safeQuery as any).memberId;
  delete (safeQuery as any).isDeleted;

  const queryBuilder = new QueryBuilder<
    TravelGuide,
    Prisma.TravelGuideWhereInput,
    Prisma.TravelGuideInclude
  >(prisma.travelGuide, safeQuery, {
    searchableFields: SearchableFields,
    filterableFields: FilterableFields,
  });

  queryBuilder.where({
    memberId,
    status: GuideStatus.DRAFT,
    isDeleted: false,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .include({ guideMedia: true, votes: true, comments: true, category: true })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getMyApprovedGuides = async (
  memberId: string,
  query: IQueryParams = {},
): Promise<IQueryResult<TravelGuide>> => {
  const safeQuery = { ...query };
  delete (safeQuery as any).status;
  delete (safeQuery as any).memberId;
  delete (safeQuery as any).isDeleted;

  const queryBuilder = new QueryBuilder<
    TravelGuide,
    Prisma.TravelGuideWhereInput,
    Prisma.TravelGuideInclude
  >(prisma.travelGuide, safeQuery, {
    searchableFields: SearchableFields,
    filterableFields: FilterableFields,
  });

  queryBuilder.where({
    memberId,
    status: GuideStatus.APPROVED,
    isDeleted: false,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .include({ guideMedia: true, votes: true, comments: true, category: true })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getMyUnderReviewGuides = async (
  memberId: string,
  query: IQueryParams = {},
): Promise<IQueryResult<TravelGuide>> => {
  const safeQuery = { ...query };
  delete (safeQuery as any).status;
  delete (safeQuery as any).memberId;
  delete (safeQuery as any).isDeleted;

  const queryBuilder = new QueryBuilder<
    TravelGuide,
    Prisma.TravelGuideWhereInput,
    Prisma.TravelGuideInclude
  >(prisma.travelGuide, safeQuery, {
    searchableFields: SearchableFields,
    filterableFields: FilterableFields,
  });

  queryBuilder.where({
    memberId,
    status: GuideStatus.UNDER_REVIEW,
    isDeleted: false,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .include({ guideMedia: true, votes: true, comments: true, category: true })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getTopVotedGuides = async () => {
  const guides = await prisma.travelGuide.findMany({
    where: {
      isDeleted: false,
      status: GuideStatus.APPROVED,
    },
    include: {
      category: true,
      guideMedia: true,
      votes: true,
      comments: true,
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      votes: {
        _count: "desc",
      },
    },
    take: 3,
  });

  const formatted = guides.map((guide) => {
    if (guide.isPaid) {
      return {
        id: guide.id,
        title: guide.title,
        category: guide.category,
        coverImage: guide.coverImage,
        votes: guide._count.votes,
        comments: guide.comments,
        isPaid: guide.isPaid,
        price: guide.price,
        createdAt: guide.createdAt,
        description: truncateText(guide.description, 10),
        locked: true,
      };
    }

    return {
      ...guide,
      locked: false,
    };
  });

  return formatted;
};

const getById = async (id: string, userId?: string) => {
  const guide = await prisma.travelGuide.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      category: true,
    },
  });

  // const user = await prisma.user.findUnique({
  //   where: { id: userId, isDeleted: false },
  // });

  // if (user?.role === MemberRole.ADMIN) {
  //   return {
  //     ...guide,
  //     locked: false,
  //   };
  // }

  if (!guide) {
    throw new AppError(404, "Guide not found");
  }

  const isOwner = userId && guide.memberId === userId;

  // 🟢 CASE 1: FREE GUIDE → everyone can see full
  if (!guide.isPaid) {
    return {
      ...guide,
      locked: false,
    };
  }

  // 🔴 CASE 2: PAID GUIDE

  // Owner can see full
  if (isOwner) {
    return {
      ...guide,
      locked: false,
    };
  }

  // If not logged in → only preview
  if (!userId) {
    return {
      id: guide.id,
      title: guide.title,
      category: guide.category,
      isPaid: guide.isPaid,
      price: guide.price,
      createdAt: guide.createdAt,
      description: truncateText(guide.description, 10),
      locked: true,
    };
  }

  // Check purchase
  const hasPurchased = await prisma.purchase.findFirst({
    where: {
      memberId: userId,
      guideId: id,
      paymentStatus: "COMPLETED",
    },
  });

  // যদি কিনে থাকে → full access
  if (hasPurchased) {
    return {
      ...guide,
      locked: false,
    };
  }

  // ❌ না কিনলে → preview only
  return {
    id: guide.id,
    title: guide.title,
    category: guide.category,
    isPaid: guide.isPaid,
    price: guide.price,
    createdAt: guide.createdAt,
    description: truncateText(guide.description, 10),
    locked: true,
  };
};

const create = async (
  data: TravelGuideCreateInput,
  memberId: string,
): Promise<TravelGuide> => {
  // Validate required fields
  if (!data.title || !data.description || !data.categoryId) {
    throw new AppError(
      400,
      "Missing required fields: title, description, categoryId",
    );
  }

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  // Handle price validation for paid guides
  if (data.isPaid && (!data.price || data.price <= 0)) {
    throw new AppError(
      400,
      "Price is required and must be greater than 0 for paid guides",
    );
  }

  // Use transaction
  const result = await prisma.$transaction(async (tx) => {
    const guide = await tx.travelGuide.create({
      data: {
        memberId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        itinerary: data.itinerary
          ? JSON.stringify(data.itinerary)
          : JSON.stringify([]),
        status: data.status || GuideStatus.DRAFT,
        isPaid: data.isPaid || false,
        price: data.isPaid ? data.price : null,
        coverImage: data.coverImage || null,
      },
      include: {
        guideMedia: true,
        category: true,
      },
    });

    // Create medias if provided
    let medias: any[] = [];
    if (data.medias && data.medias.length > 0) {
      medias = await Promise.all(
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
    }

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

const submitForReview = async (
  id: string,
  userId: string,
): Promise<{ message: string; data: TravelGuide }> => {
  // Check if guide exists and belongs to user
  const guide = await prisma.travelGuide.findUnique({
    where: { id },
  });

  if (!guide) {
    throw new AppError(404, "Travel guide not found");
  }

  // Check authorization - only owner can submit
  if (guide.memberId !== userId) {
    throw new AppError(
      403,
      "Forbidden: You can only submit your own travel guides",
    );
  }

  // Check current status
  if (guide.status === GuideStatus.UNDER_REVIEW) {
    throw new AppError(
      400,
      "This guide is already under review. Please wait for admin approval.",
    );
  }

  if (guide.status === GuideStatus.APPROVED) {
    throw new AppError(
      400,
      "This guide is already approved. No further submission needed.",
    );
  }

  // Update status to UNDER_REVIEW
  const updatedGuide = await prisma.travelGuide.update({
    where: { id },
    data: {
      status: GuideStatus.UNDER_REVIEW,
    },
  });

  return {
    message: "Travel guide submitted for review successfully",
    data: updatedGuide as TravelGuide,
  };
};

export const TravelGuideService = {
  getAll,
  getById,
  getMemberDraftGuides,
  getMyApprovedGuides,
  getMyUnderReviewGuides,
  getTopVotedGuides,
  create,
  update,
  submitForReview,
  remove,
};
