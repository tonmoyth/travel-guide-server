import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { AdminService } from "./admin.service";
import AppError from "../../errors/AppError";

const updateGuideStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const status = req.body.status as string;
  const feedbackData = {
    feedback: req.body.feedback as string | undefined,
  };

  const reviewerId = req.user?.id;

  await AdminService.updateGuideStatus(id, status, feedbackData, reviewerId);

  res.status(200).json({
    success: true,
    message: "Guide status updated successfully",
    data: { id, status, ...feedbackData },
  });
});

const getAllMembers = catchAsync(async (req: Request, res: Response) => {
  const data = await AdminService.getAllMembers(req.query as any);
  res.status(200).json({
    success: true,
    message: "Members retrieved successfully",
    data,
  });
});

const updateMemberStatus = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.params.id as string;
  const updateData = req.body;

  const data = await AdminService.updateMemberStatus(memberId, updateData);

  res.status(200).json({
    success: true,
    message: "Member status updated successfully",
    data,
  });
});

const updateMemberRole = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.params.id as string;
  const { role } = req.body;

  if (!role) {
    throw new AppError(400, "Role is required");
  }

  const data = await AdminService.updateMemberRole(memberId, role);

  res.status(200).json({
    success: true,
    message: "Member role updated successfully",
    data,
  });
});

const getAllForAdmin = catchAsync(async (req: Request, res: Response) => {
  const data = await AdminService.getAllForAdmin(req.query as any);
  res.status(200).json({
    success: true,
    message: "All travel guides retrieved successfully",
    data,
  });
});

const getRejectedGuides = catchAsync(async (req: Request, res: Response) => {
  const data = await AdminService.getRejectedGuides(req.query as any);
  res.status(200).json({
    success: true,
    message: "Rejected travel guides retrieved successfully",
    data,
  });
});

const getUnderReviewGuides = catchAsync(async (req: Request, res: Response) => {
  const data = await AdminService.getUnderReviewGuides(req.query as any);
  res.status(200).json({
    success: true,
    message: "Under review travel guides retrieved successfully",
    data,
  });
});

const getApprovedGuides = catchAsync(async (req: Request, res: Response) => {
  const data = await AdminService.getApprovedGuides(req.query as any);

  res.status(200).json({
    success: true,
    message: "Approved travel guides retrieved successfully",
    data,
  });
});

const deleteGuideByAdmin = catchAsync(async (req: Request, res: Response) => {
  const guideId = req.params.id as string;

  await AdminService.deleteGuideByAdmin(guideId);

  res.status(200).json({
    success: true,
    message: "Travel guide deleted successfully",
  });
});

const updateRejectedGuide = catchAsync(async (req: Request, res: Response) => {
  const guideId = req.params.id as string;
  const adminId = req.user?.id as string;
  const { feedback } = req.body;

  if (!feedback) {
    throw new AppError(400, "Feedback is required");
  }

  await AdminService.updateRejectedGuide(guideId, adminId, feedback);

  res.status(200).json({
    success: true,
    message: "Guide rejected successfully with review feedback",
    data: { guideId, status: "REJECTED", feedback },
  });
});

const getStats = catchAsync(async (req: Request, res: Response) => {
  const role = req.user?.role as string;
  const normalizedRole = role.toUpperCase();
  const userId = req.user?.id;

  const data = await AdminService.getStats(normalizedRole, userId);

  res.status(200).json({
    success: true,
    message: `Stats for role: ${normalizedRole}`,
    data,
  });
});

export const AdminController = {
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
