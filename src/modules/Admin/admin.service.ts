import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import {
  GuideReviewStatus,
  GuideStatus,
} from "../../../prisma/generated/prisma/enums";

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

export const AdminService = {
  updateGuideStatus,
};
