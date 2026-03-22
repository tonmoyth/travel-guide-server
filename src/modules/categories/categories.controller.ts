import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { CategoryService } from "./categories.service";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const data = await CategoryService.getAll(req.query as any);
  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await CategoryService.getById(id);
  res
    .status(200)
    .json({ success: true, message: "Category retrieved successfully", data });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const data = await CategoryService.create(payload);
  res
    .status(201)
    .json({ success: true, message: "Category created successfully", data });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;
  const data = await CategoryService.update(id, payload);
  res
    .status(200)
    .json({ success: true, message: "Category updated successfully", data });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await CategoryService.remove(id);
  res
    .status(200)
    .json({ success: true, message: "Category deleted successfully" });
});

export const CategoryController = {
  getAll,
  getById,
  create,
  update,
  remove,
};
