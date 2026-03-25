import * as z from "zod";

export const VoteValidationSchema = {
  create: z.object({
    guideId: z.string().min(1, "Guide ID is required"),
    voteType: z.enum(["UP", "DOWN"], {
      message: "Vote type must be either UP or DOWN",
    }),
  }),
};
