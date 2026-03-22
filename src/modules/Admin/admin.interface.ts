import { GuideStatus } from "../../../prisma/generated/prisma/enums";

export interface UpdateGuideStatusPayload {
  status: GuideStatus;
  feedback?: string;
}
