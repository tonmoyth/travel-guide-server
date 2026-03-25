import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import {
  Vote,
  VotePayload,
  VoteResponse,
  VoteCountResponse,
} from "./vote.interface";

const castVote = async (
  memberId: string,
  payload: VotePayload,
): Promise<VoteResponse> => {
  const { guideId, voteType } = payload;

  // Check if guide exists
  const guide = await prisma.travelGuide.findUnique({
    where: { id: guideId },
  });

  if (!guide) {
    throw new AppError(404, "Travel guide not found");
  }

  // Get existing vote with memberId_guideId composite key
  const existingVote = await prisma.vote.findUnique({
    where: {
      memberId_guideId: {
        memberId,
        guideId,
      },
    },
  });

  let vote: Vote | null = null;

  if (!existingVote) {
    // No vote yet → create
    vote = await prisma.vote.create({
      data: {
        memberId,
        guideId,
        voteType: voteType as "UP" | "DOWN",
      },
    });
  } else if (existingVote.voteType === voteType) {
    // Same vote → remove vote (toggle)
    await prisma.vote.delete({
      where: {
        id: existingVote.id,
      },
    });
    vote = null;
  } else {
    // Different vote → update
    vote = await prisma.vote.update({
      where: {
        id: existingVote.id,
      },
      data: {
        voteType: voteType as "UP" | "DOWN",
      },
    });
  }

  // Get vote count and score
  const voteCount = await getVoteCount(guideId);
  const userVoteScore = calculateUserVoteScore(vote);

  return {
    vote,
    voteCount: {
      upVotes: voteCount.upVotes,
      downVotes: voteCount.downVotes,
    },
    userVoteScore,
  };
};

const getVoteCount = async (guideId: string): Promise<VoteCountResponse> => {
  const votes = await prisma.vote.findMany({
    where: { guideId },
  });

  const upVotes = votes.filter((v) => v.voteType === "UP").length;
  const downVotes = votes.filter((v) => v.voteType === "DOWN").length;
  const totalScore = upVotes - downVotes;

  return {
    upVotes,
    downVotes,
    totalScore,
  };
};

const getGuideVoteStats = async (
  guideId: string,
  memberId?: string,
): Promise<{
  voteCount: VoteCountResponse;
  userVote: Vote | null;
}> => {
  // Check if guide exists
  const guide = await prisma.travelGuide.findUnique({
    where: { id: guideId },
  });

  if (!guide) {
    throw new AppError(404, "Travel guide not found");
  }

  const voteCount = await getVoteCount(guideId);

  let userVote: Vote | null = null;
  if (memberId) {
    userVote = await prisma.vote.findUnique({
      where: {
        memberId_guideId: {
          memberId,
          guideId,
        },
      },
    });
  }

  return {
    voteCount,
    userVote,
  };
};

const calculateUserVoteScore = (vote: Vote | null): number => {
  if (!vote) return 0;
  return vote.voteType === "UP" ? 1 : -1;
};

export const VoteService = {
  castVote,
  getVoteCount,
  getGuideVoteStats,
  calculateUserVoteScore,
};
