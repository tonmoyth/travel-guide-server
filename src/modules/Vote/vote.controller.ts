import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import { VoteService } from "./vote.service";

const castVote = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user!.id;
  const payload = req.body;

  const data = await VoteService.castVote(memberId, payload);

  res.status(200).json({
    success: true,
    message: data.vote ? "Vote cast successfully" : "Vote removed successfully",
    data,
  });
});

const getVoteStats = catchAsync(async (req: Request, res: Response) => {
  const guideId = req.params.guideId as string;
  const memberId = req.user?.id;

  const data = await VoteService.getGuideVoteStats(guideId, memberId);

  res.status(200).json({
    success: true,
    message: "Vote stats retrieved successfully",
    data,
  });
});

export const VoteController = {
  castVote,
  getVoteStats,
};
