import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { AdminService } from "./admin.service";

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

export const AdminController = {
  updateGuideStatus,
  getAllMembers,
  updateMemberStatus,
};
