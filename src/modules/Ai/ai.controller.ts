import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { sendMessageToAI } from "./ai.service";
import { prisma } from "../../lib/prisma";
import status from "http-status";
import AppError from "../../errors/AppError";

/**
 * Controller to handle AI chat requests.
 */
const chatWithAI = catchAsync(async (req: Request, res: Response) => {
  const { message } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }

  // 1. Call AI Service
  const reply = await sendMessageToAI(message);

  // 2. Save history to database
  await prisma.chatHistory.create({
    data: {
      userId,
      message,
      reply,
    },
  });

  // 3. Send response
  res.status(status.OK).json({
    success: true,
    message: "AI responded successfully",
    data: reply,
  });
});

export const AIController = {
  chatWithAI,
};
