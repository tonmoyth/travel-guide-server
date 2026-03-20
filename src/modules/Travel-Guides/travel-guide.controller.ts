import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { TravelGuideService } from "./travel-guide.service";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const data = await TravelGuideService.getAll();
  res.status(200).json({ success: true, data });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await TravelGuideService.getById(id);
  res.status(200).json({ success: true, data });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const data = await TravelGuideService.create(payload);
  res.status(201).json({ success: true, data });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;
  const data = await TravelGuideService.update(id, payload);
  res.status(200).json({ success: true, data });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await TravelGuideService.remove(id);
  res.status(200).json({ success: true, message: "Travel guide deleted" });
});

export const TravelGuideController = {
  getAll,
  getById,
  create,
  update,
  remove,
};
