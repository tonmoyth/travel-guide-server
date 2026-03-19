import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

import {
  TAuthResponse,
  TLoginPayload,
  TMember,
  TSignupPayload,
} from "./memeber.interface";
import { tokenUtils } from "../../utils/token";

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

const logout = async (sessionToken: string) => {
  return await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
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
};
