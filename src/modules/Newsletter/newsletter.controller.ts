import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { NewsletterService } from "./newsletter.service";
import status from "http-status";

const subscribe = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const data = await NewsletterService.createSubscription(email);

  res.status(status.CREATED).json({
    success: true,
    message: "Successfully subscribed to newsletter",
    data,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const data = await NewsletterService.getAllSubscriptions();

  res.status(status.OK).json({
    success: true,
    message: "Newsletter subscriptions retrieved",
    data,
  });
});

const unsubscribe = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const data = await NewsletterService.unsubscribe(email);

  res.status(status.OK).json({
    success: true,
    message: "Successfully unsubscribed from newsletter",
    data,
  });
});

export const NewsletterController = {
  subscribe,
  getAll,
  unsubscribe,
};
