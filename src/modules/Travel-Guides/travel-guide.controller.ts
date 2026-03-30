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
  console.log("Received query parameters:", req.query);
  const data = await TravelGuideService.getAll(req.query as any);
  res.status(200).json({
    success: true,
    message: "Travel guides retrieved successfully",
    data,
  });
});

const getAllForAdmin = catchAsync(async (req: Request, res: Response) => {
  console.log("Received query parameters for admin:", req.query);
  const data = await TravelGuideService.getAllForAdmin(req.query as any);
  res.status(200).json({
    success: true,
    message: "All travel guides retrieved successfully",
    data,
  });
});

const getRejectedGuides = catchAsync(async (req: Request, res: Response) => {
  console.log("Received query parameters for rejected guides:", req.query);
  const data = await TravelGuideService.getRejectedGuides(req.query as any);
  res.status(200).json({
    success: true,
    message: "Rejected travel guides retrieved successfully",
    data,
  });
});

const getUnderReviewGuides = catchAsync(async (req: Request, res: Response) => {
  console.log("Received query parameters for under review guides:", req.query);
  const data = await TravelGuideService.getUnderReviewGuides(req.query as any);
  res.status(200).json({
    success: true,
    message: "Under review travel guides retrieved successfully",
    data,
  });
});

const getApprovedGuides = catchAsync(async (req: Request, res: Response) => {
  console.log("Received query parameters for approved guides:", req.query);
  const data = await TravelGuideService.getApprovedGuides(req.query as any);
  res.status(200).json({
    success: true,
    message: "Approved travel guides retrieved successfully",
    data,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;

  const data = await TravelGuideService.getById(id, userId);
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

  // Type assertion for multer files
  const files = req.files as {
    images?: Express.Multer.File[];
    videos?: Express.Multer.File[];
    pdfs?: Express.Multer.File[];
    coverImage?: Express.Multer.File[];
  };

  // For Postman `data` object pattern, parse it too
  let bodyPayload = req.body;
  if (req.body.data) {
    try {
      const parsedData =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;
      bodyPayload = { ...bodyPayload, ...parsedData };
    } catch (err) {
      throw new AppError(400, "Invalid JSON in data field");
    }
  }

  const { title, description, categoryId, itinerary, isPaid, price, status } =
    bodyPayload;

  if (!title || !description || !categoryId) {
    throw new AppError(
      400,
      "Missing required fields: title, description, categoryId",
    );
  }

  // Debug: log received files
  console.log("Files received:", Object.keys(files || {}), {
    images: files?.images?.length || 0,
    videos: files?.videos?.length || 0,
    pdfs: files?.pdfs?.length || 0,
    coverImage: files?.coverImage?.length || 0,
  });

  // Validate media files
  const validation = validateMedias(files);
  if (!validation.isValid) {
    throw new AppError(400, validation.message || "Invalid media");
  }

  // Extract medias from uploaded files
  const medias = extractMediasFromFiles(files);

  // Extract cover image if provided
  let coverImage: string | undefined;
  if (files.coverImage && files.coverImage.length > 0) {
    coverImage = (files.coverImage[0] as any).path;
  }

  // Parse JSON fields
  let parsedItinerary = [];
  if (itinerary) {
    try {
      parsedItinerary =
        typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary;
    } catch (error) {
      throw new AppError(
        status.BAD_REQUEST,
        "Invalid JSON format for itinerary",
      );
    }
  }

  const parsePayload = {
    title,
    description,
    categoryId,
    itinerary: parsedItinerary,
    medias,
    isPaid: isPaid === "true" || isPaid === true,
    price: price ? parseFloat(price) : undefined,
    status: status || "DRAFT",
    coverImage,
  };

  const data = await TravelGuideService.create(parsePayload, memberId);

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
  console.log("Update payload after parsing:", payload);

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

export const TravelGuideController = {
  getAll,
  getAllForAdmin,
  getRejectedGuides,
  getUnderReviewGuides,
  getApprovedGuides,
  getById,
  getMemberDraftGuides,
  getMyApprovedGuides,
  getMyUnderReviewGuides,
  create,
  update,
  submitForReview,
  remove,
};
