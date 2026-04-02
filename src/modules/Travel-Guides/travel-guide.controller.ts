import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { TravelGuideService } from "./travel-guide.service";
import AppError from "../../errors/AppError";
import status from "http-status";
import {
  validateMedias,
  extractMediasFromFiles,
} from "../../utils/fileUploadHelper";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const data = await TravelGuideService.getAll(req.query as any);
  res.status(200).json({
    success: true,
    message: "Travel guides retrieved successfully",
    data,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  // user may or may not exist
  const userId = req.user?.id;

  const data = await TravelGuideService.getById(id, userId as string);

  res.status(200).json({
    success: true,
    message: "Travel guide retrieved successfully",
    data,
  });
});

const getMemberDraftGuides = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user!.id;

  const data = await TravelGuideService.getMemberDraftGuides(
    memberId,
    req.query as any,
  );

  res.status(200).json({
    success: true,
    message: "Draft travel guides fetched successfully",
    data,
  });
});

const getMyApprovedGuides = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user!.id;

  const data = await TravelGuideService.getMyApprovedGuides(
    memberId,
    req.query as any,
  );

  res.status(200).json({
    success: true,
    message: "Approved travel guides fetched successfully",
    data,
  });
});

const getMyUnderReviewGuides = catchAsync(
  async (req: Request, res: Response) => {
    const memberId = req.user!.id;

    const data = await TravelGuideService.getMyUnderReviewGuides(
      memberId,
      req.query as any,
    );

    res.status(200).json({
      success: true,
      message: "Under review travel guides fetched successfully",
      data,
    });
  },
);

const create = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user!.id;
  const payload = req.body;

  // Handle cover image if provided as URL
  if (!payload.coverImage && req.file) {
    payload.coverImage = (req.file as any).path;
  }

  // Parse JSON fields if they exist as strings
  if (payload.itinerary && typeof payload.itinerary === "string") {
    try {
      payload.itinerary = JSON.parse(payload.itinerary);
    } catch {
      // Keep as is if parsing fails
    }
  }

  const data = await TravelGuideService.create(payload, memberId);

  res.status(201).json({
    success: true,
    message: "Travel guide created successfully",
    data,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  // Handle cover image if provided
  if (req.file) {
    payload.coverImage = (req.file as any).path;
  }

  // Parse JSON fields if they exist
  // if (payload.itinerary) {
  //   payload.itinerary = JSON.parse(payload.itinerary);
  // }

  const data = await TravelGuideService.update(id, payload, userId, userRole);

  res.status(200).json({
    success: true,
    message: "Travel guide updated successfully",
    data,
  });
});

const submitForReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;

  const result = await TravelGuideService.submitForReview(id, userId);

  res.status(200).json({
    success: true,
    message: result.message,
    data: result.data,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  await TravelGuideService.remove(id, userId, userRole);
  res
    .status(200)
    .json({ success: true, message: "Travel guide deleted successfully" });
});

const getTopVotedGuides = catchAsync(async (req: Request, res: Response) => {
  const data = await TravelGuideService.getTopVotedGuides();
  res.status(200).json({
    success: true,
    message: "Top voted travel guides retrieved successfully",
    data,
  });
});

export const TravelGuideController = {
  getAll,
  getById,
  getMemberDraftGuides,
  getMyApprovedGuides,
  getMyUnderReviewGuides,
  create,
  update,
  submitForReview,
  remove,
  getTopVotedGuides,
};
