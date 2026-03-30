import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import {
  GuideReviewStatus,
  GuideStatus,
  MemberRole,
  MemberStatus,
} from "../../../prisma/generated/prisma/enums";
import {
  IQueryParams,
  IQueryResult,
} from "../../interface/queryBuilder.interface";
import { QueryBuilder } from "../../utils/queryBuilder";
import {
  MemberSearchableFields,
  MemberFilterableFields,
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
          status: GuideReviewStatus.REJECTED,
          feedback: feedbackData.feedback,
        },
      }),
    ]);

    return;
  }

  // For APPROVED, update guide status and soft delete any existing rejected reviews
  await prisma.$transaction([
    prisma.travelGuide.update({
      where: { id: guideId },
      data: { status: guideStatus },
    }),
    prisma.guideReview.updateMany({
      where: {
        guideId,
        status: GuideReviewStatus.REJECTED,
        isDeleted: false,
      },
      data: { isDeleted: true },
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

export const AdminService = {
  updateGuideStatus,
  getAllMembers,
  updateMemberStatus,
};
