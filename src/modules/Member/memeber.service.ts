import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { JwtPayload } from "jsonwebtoken";

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

export const MemberService = {
  signup: memberSignUp,
  login: memberLogin,
  logout,
  getCurrentMember,
  getNewRefreshToken,
  googleLoginSuccess,
};
