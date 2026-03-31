import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { JwtPayload } from "jsonwebtoken";
import {
  GuideStatus,
  Prisma,
  PaymentStatus,
  GuideReviewStatus,
} from "../../../prisma/generated/prisma/browser";
import { QueryBuilder } from "../../utils/queryBuilder";
import {
  IQueryParams,
  IQueryResult,
} from "../../interface/queryBuilder.interface";
import { TravelGuide } from "../Travel-Guides/travel-guide.interface";
import {
  SearchableFields,
  FilterableFields,
} from "../Travel-Guides/travel-guide.constant";

import {
  TAuthResponse,
  TLoginPayload,
  TMember,
  TSignupPayload,
} from "./memeber.interface";
import { tokenUtils } from "../../utils/token";
import { jwtUtils } from "../../utils/jwtUtils";
import { envVeriables } from "../../config/env";

export type TAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const memberSignUp = async (payload: TSignupPayload) => {
  if (!payload) {
    throw new Error("Invalid signup payload");
  }
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  const user = data.user as TMember;
  const accessToken = tokenUtils.getToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    deletedAt: user.deletedAt,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    deletedAt: user.deletedAt,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const memberLogin = async (payload: TLoginPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  const user = data.user as TMember;
  const accessToken = tokenUtils.getToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    deletedAt: user.deletedAt,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    deletedAt: user.deletedAt,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const googleLoginSuccess = async (user: Record<string, any>) => {
  if (!user || !user.id) {
    throw new AppError(400, "Invalid user data from Google session.");
  }

  let existingUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!existingUser) {
    existingUser = await prisma.user.create({
      data: {
        id: user.id,
        name: user.name ?? "",
        email: user.email ?? "",
        image: user.image ?? undefined,
        profilePhoto: user.profilePhoto ?? undefined,
        role: user.role ?? "MEMBER",
        bio: user.bio ?? undefined,
        address: user.address ?? undefined,
        gender: user.gender ?? undefined,
        emailVerified: user.emailVerified ?? false,
      },
    });
  }

  const accessToken = tokenUtils.getToken({
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    role: existingUser.role,
    deletedAt: existingUser.deletedAt,
    isDeleted: existingUser.isDeleted,
    status: (existingUser as any).status,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    role: existingUser.role,
    deletedAt: existingUser.deletedAt,
    isDeleted: existingUser.isDeleted,
    status: (existingUser as any).status,
  });

  return {
    accessToken,
    refreshToken,
    user: existingUser,
  };
};

const logout = async (sessionToken: string) => {
  return await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
};

const getNewRefreshToken = async (
  refreshToken: string,
  sessionToken: string,
) => {
  if (!refreshToken || !sessionToken) {
    throw new AppError(401, "Invalid refresh or session token.");
  }

  const verifyResult = await jwtUtils.verifyToken(
    refreshToken,
    envVeriables.JWT_REFRESH_SECRET_KEY,
  );

  if (!verifyResult || !verifyResult.seccess) {
    throw new AppError(401, "Invalid refresh token. Please login again.");
  }

  const session = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
  });

  if (!session) {
    throw new AppError(401, "Invalid session token.");
  }

  const data = verifyResult.data as JwtPayload;

  const accessToken = tokenUtils.getToken({
    userId: data.userId as string,
    email: data.email as string,
    name: data.name as string,
    role: data.role as string,
    deletedAt: data.deletedAt as Date | undefined,
    isDeleted: data.isDeleted as boolean | undefined,
    status: data.status as string | undefined,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId as string,
    email: data.email as string,
    name: data.name as string,
    role: data.role as string,
    deletedAt: data.deletedAt as Date | undefined,
    isDeleted: data.isDeleted as boolean | undefined,
    status: data.status as string | undefined,
  });

  const updateSessionTime = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    session: updateSessionTime,
  };
};

export const getCurrentMember = async (userId: string): Promise<TMember> => {
  const member = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!member) {
    throw new AppError(404, "Member not found");
  }

  // Normalize Prisma nullable fields to match our TMember type
  return {
    ...member,
    image: member.image ?? undefined,
    profilePhoto: member.profilePhoto ?? undefined,
    bio: member.bio ?? undefined,
    address: member.address ?? undefined,
    gender: member.gender ?? undefined,
    deletedAt: member.deletedAt ?? undefined,
  };
};

export const getDraftGuides = async (
  memberId: string,
  query: IQueryParams = {},
): Promise<IQueryResult<TravelGuide>> => {
  // restrict to the member's own drafts only
  const safeQuery = { ...query };
  delete (safeQuery as any).status;
  delete (safeQuery as any).memberId;
  delete (safeQuery as any).isDeleted;

  const queryBuilder = new QueryBuilder<
    TravelGuide,
    Prisma.TravelGuideWhereInput,
    Prisma.TravelGuideInclude
  >(prisma.travelGuide, safeQuery, {
    searchableFields: SearchableFields,
    filterableFields: FilterableFields,
  });

  queryBuilder.where({
    memberId,
    status: GuideStatus.DRAFT,
    isDeleted: false,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .include({ guideMedia: true, votes: true, comments: true, category: true })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const changePassword = async (
  payload: {
    currentPassword: string;
    newPassword: string;
  },
  session: string,
) => {
  // Query the session from the database to validate it and get the user
  const sessionRecord = await prisma.session.findUnique({
    where: {
      token: session,
    },
    include: {
      user: true,
    },
  });

  if (!sessionRecord || !sessionRecord.user) {
    throw new AppError(401, "Invalid session token.");
  }

  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: {
      Authorization: `Bearer ${session}`,
    },
  } as any);

  const accessToken = tokenUtils.getToken({
    userId: sessionRecord.user.id,
    email: sessionRecord.user.email,
    name: sessionRecord.user.name,
    role: sessionRecord.user.role,
    deletedAt: sessionRecord.user.deletedAt,
    isDeleted: (sessionRecord.user as any).isDeleted,
    status: (sessionRecord.user as any).status,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: sessionRecord.user.id,
    name: sessionRecord.user.name,
    role: sessionRecord.user.role,
    email: sessionRecord.user.email,
    deletedAt: sessionRecord.user.deletedAt,
    isDeleted: (sessionRecord.user as any).isDeleted,
    status: (sessionRecord.user as any).status,
  });

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  // On better-auth verify success, update local user to keep the app in sync
  if (result.status && result.user && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });
  }
};

const getPurchasedGuides = async (userId: string) => {
  const purchases = await prisma.purchase.findMany({
    where: {
      memberId: userId,
      paymentStatus: PaymentStatus.COMPLETED,
    },
    select: {
      guideId: true,
    },
  });

  const guideIds = purchases.map((p) => p.guideId);

  if (guideIds.length === 0) {
    return [];
  }

  const guides = await prisma.travelGuide.findMany({
    where: {
      id: {
        in: guideIds,
      },
      isDeleted: false,
    },
  });

  return guides;
};

const getRejectedGuides = async (userId: string) => {
  const rejectedReviews = await prisma.guideReview.findMany({
    where: {
      status: GuideReviewStatus.REJECTED,
      guide: {
        memberId: userId,
        isDeleted: false,
      },
      isDeleted: false,
    },
    include: {
      guide: true,
    },
  });

  return rejectedReviews.map((review) => ({
    feedback: review.feedback,
    guide: review.guide,
  }));
};

export const MemberService = {
  signup: memberSignUp,
  login: memberLogin,
  logout,
  getCurrentMember,
  getNewRefreshToken,
  googleLoginSuccess,
  changePassword,
  verifyEmail,
  getPurchasedGuides,
  getRejectedGuides,
};
