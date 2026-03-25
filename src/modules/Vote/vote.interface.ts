export type Vote = {
  id: string;
  memberId: string;
  guideId: string;
  voteType: "UP" | "DOWN";
  createdAt: Date;
  updatedAt: Date;
};

export type VotePayload = {
  guideId: string;
  voteType: "UP" | "DOWN";
};

export type VoteResponse = {
  vote: Vote | null;
  voteCount: {
    upVotes: number;
    downVotes: number;
  };
  userVoteScore: number;
};

export type VoteCountResponse = {
  upVotes: number;
  downVotes: number;
  totalScore: number;
};
