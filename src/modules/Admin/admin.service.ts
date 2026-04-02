import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import {
  GuideReviewStatus,
  GuideStatus,
  MemberRole,
} from "../../../prisma/generated/prisma/enums";
import {
  IQueryParams,
  IQueryResult,
} from "../../interface/queryBuilder.interface";
import { QueryBuilder } from "../../utils/queryBuilder";
import {
  MemberSearchableFields,
  MemberFilterableFields,
  TravelGuideSearchableFields,
  TravelGuideFilterableFields,
} from "./admin.constant";

interface FeedbackData {
  feedback?: string;
}

const updateGuideStatus = async (
  guideId: string,
  status: string,
  feedbackData: FeedbackData,
  reviewerId?: string,
): Promise<void> => {
  const normalizedStatus = status?.toUpperCase();

  if (
    normalizedStatus !== GuideStatus.APPROVED &&
    normalizedStatus !== GuideStatus.REJECTED
  ) {
    throw new AppError(400, "Invalid status. Use APPROVED or REJECTED.");
  }

  const guideStatus =
    normalizedStatus === GuideStatus.APPROVED
      ? GuideStatus.APPROVED
      : GuideStatus.REJECTED;

  if (guideStatus === GuideStatus.REJECTED) {
    if (!reviewerId) {
      throw new AppError(
        400,
        "Reviewer id is required for rejected guide review.",
      );
    }

    if (!feedbackData.feedback) {
      throw new AppError(400, "Feedback is required when rejecting a guide.");
    }

    await prisma.$transaction([
      prisma.travelGuide.update({
        where: { id: guideId },
        data: { status: guideStatus },
      }),
      prisma.guideReview.create({
        data: {
          guideId,
          reviewedBy: reviewerId,
          isDeleted: false,
          status: GuideReviewStatus.REJECTED,
          feedback: feedbackData.feedback,
        },
      }),
    ]);

    return;
  }

  // For APPROVED, update guide status and soft delete all existing reviews
  await prisma.$transaction([
    prisma.travelGuide.update({
      where: { id: guideId },
      data: { status: guideStatus },
    }),
    prisma.guideReview.deleteMany({
      where: {
        guideId,
        isDeleted: false,
      },
    }),
  ]);
};

const getAllMembers = async (
  query: IQueryParams = {},
): Promise<IQueryResult<any>> => {
  const queryBuilder = new QueryBuilder(prisma.user, query, {
    searchableFields: MemberSearchableFields,
    filterableFields: MemberFilterableFields,
  });

  queryBuilder.where({ isDeleted: false });

  const results = await queryBuilder
    .search()
    .filter()
    .include({
      guides: {
        where: { isDeleted: false },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          guides: true,
          comments: true,
          votes: true,
        },
      },
    })
    .paginate()
    .sort()
    .fields()
    .execute();

  return results;
};

const updateMemberStatus = async (
  memberId: string,
  updateData: { status: string },
): Promise<any> => {
  // Validate member exists
  const member = await prisma.user.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    throw new AppError(404, "Member not found");
  }

  // Validate status if provided
  if (updateData.status) {
    const normalizedStatus = updateData.status.toUpperCase();
    if (normalizedStatus !== "ACTIVE" && normalizedStatus !== "INACTIVE") {
      throw new AppError(400, "Invalid status. Use ACTIVE or INACTIVE.");
    }
  }

  // Map string to enum value
  const statusValue =
    updateData.status.toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE";

  const updatedMember = await prisma.user.update({
    where: { id: memberId },
    data: {
      status: statusValue as any, // Using 'as any' to bypass TypeScript issues until proper enum is available
    },
  });

  return {
    id: updatedMember.id,
    name: updatedMember.name,
    email: updatedMember.email,
    role: updatedMember.role,
    status: (updatedMember as any).status || "ACTIVE", // Fallback if status field doesn't exist
    updatedAt: updatedMember.updatedAt,
  };
};

const updateMemberRole = async (
  memberId: string,
  role: string,
): Promise<any> => {
  // Validate member exists
  const member = await prisma.user.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    throw new AppError(404, "Member not found");
  }

  // Validate role
  const normalizedRole = role.toUpperCase();
  if (normalizedRole !== "ADMIN" && normalizedRole !== "MEMBER") {
    throw new AppError(400, "Invalid role. Use ADMIN or MEMBER.");
  }

  // Map string to enum value
  const roleValue =
    normalizedRole === "ADMIN" ? MemberRole.ADMIN : MemberRole.MEMBER;

  const updatedMember = await prisma.user.update({
    where: { id: memberId },
    data: {
      role: roleValue,
    },
  });

  return {
    id: updatedMember.id,
    name: updatedMember.name,
    email: updatedMember.email,
    role: updatedMember.role,
    status: (updatedMember as any).status || "ACTIVE", // Fallback if status field doesn't exist
    updatedAt: updatedMember.updatedAt,
  };
};

const getAllForAdmin = async (
  query: IQueryParams = {},
): Promise<IQueryResult<any>> => {
  const queryBuilder = new QueryBuilder(prisma.travelGuide, query, {
    searchableFields: TravelGuideSearchableFields,
    filterableFields: TravelGuideFilterableFields,
  });

  queryBuilder.where({ isDeleted: false });

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

const getRejectedGuides = async (
  query: IQueryParams = {},
): Promise<IQueryResult<any>> => {
  const queryBuilder = new QueryBuilder(prisma.travelGuide, query, {
    searchableFields: TravelGuideSearchableFields,
    filterableFields: TravelGuideFilterableFields,
  });

  queryBuilder.where({ isDeleted: false, status: GuideStatus.REJECTED });

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

const getUnderReviewGuides = async (
  query: IQueryParams = {},
): Promise<IQueryResult<any>> => {
  const queryBuilder = new QueryBuilder(prisma.travelGuide, query, {
    searchableFields: TravelGuideSearchableFields,
    filterableFields: TravelGuideFilterableFields,
  });

  queryBuilder.where({ isDeleted: false, status: GuideStatus.UNDER_REVIEW });

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

const getApprovedGuides = async (
  query: IQueryParams = {},
): Promise<IQueryResult<any>> => {
  const queryBuilder = new QueryBuilder(prisma.travelGuide, query, {
    searchableFields: TravelGuideSearchableFields,
    filterableFields: TravelGuideFilterableFields,
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

const deleteGuideByAdmin = async (guideId: string): Promise<void> => {
  // Check if guide exists
  const guide = await prisma.travelGuide.findUnique({
    where: { id: guideId },
  });

  if (!guide) {
    throw new AppError(404, "Travel guide not found");
  }

  // Soft delete - mark as deleted
  await prisma.travelGuide.update({
    where: { id: guideId },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

const updateRejectedGuide = async (
  guideId: string,
  adminId: string,
  feedback: string,
): Promise<void> => {
  // Check if guide exists
  const guide = await prisma.travelGuide.findUnique({
    where: { id: guideId },
  });

  if (!guide) {
    throw new AppError(404, "Travel guide not found");
  }

  // Validate feedback
  if (!feedback || feedback.trim().length === 0) {
    throw new AppError(400, "Feedback is required to reject a guide");
  }

  // Use transaction to create GuideReview and update guide status
  await prisma.$transaction([
    prisma.travelGuide.update({
      where: { id: guideId },
      data: { status: GuideStatus.REJECTED },
    }),
    prisma.guideReview.create({
      data: {
        guideId,
        reviewedBy: adminId,
        status: GuideReviewStatus.REJECTED,
        feedback,
      },
    }),
  ]);
};

const getStats = async (role: string, userId?: string) => {
  const normalizedRole = role.toUpperCase();

  if (normalizedRole === "ADMIN") {
    return await prisma.$transaction(async (tx) => {
      const [totalUsers, totalGuides, totalCategories, totalPurchases] =
        await Promise.all([
          tx.user.count(),
          tx.travelGuide.count({ where: { isDeleted: false } }),
          tx.category.count({ where: { isDeleted: false } }),
          tx.purchase.count(),
        ]);

      return {
        totalUsers,
        totalGuides,
        totalCategories,
        totalPurchases,
      };
    });
  }

  if (normalizedRole === "MEMBER") {
    if (!userId) {
      throw new AppError(400, "User ID is required for member stats");
    }

    return await prisma.$transaction(async (tx) => {
      const [existGuideCount, existPurchasesCount, existRejectedCount] =
        await Promise.all([
          tx.travelGuide.count({
            where: { memberId: userId, isDeleted: false },
          }),
          tx.purchase.count({
            where: { memberId: userId },
          }),
          tx.guideReview.count({
            where: {
              guide: { memberId: userId },
              status: GuideReviewStatus.REJECTED,
              isDeleted: false,
            },
          }),
        ]);

      return {
        existGuideCount,
        existPurchasesCount,
        existRejectedCount,
      };
    });
  }

  throw new AppError(400, "Invalid role for stats. Use ADMIN or MEMBER.");
};

export const AdminService = {
  updateGuideStatus,
  getAllMembers,
  updateMemberStatus,
  updateMemberRole,
  getAllForAdmin,
  getRejectedGuides,
  getUnderReviewGuides,
  getApprovedGuides,
  deleteGuideByAdmin,
  updateRejectedGuide,
  getStats,
};
