import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { TravelGuideService } from "./travel-guide.service";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const data = await TravelGuideService.getAll(userId, userRole);
  res.status(200).json({
    success: true,
    message: "Travel guides retrieved successfully",
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

const create = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const memberId = req.user!.id;
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
  const data = await TravelGuideService.update(id, payload, userId, userRole);
  res.status(200).json({
    success: true,
    message: "Travel guide updated successfully",
    data,
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
  getById,
  create,
  update,
  remove,
};
