import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import AppError from "../../errors/AppError";

import { MemberService } from "./memeber.service";
import { tokenUtils } from "../../utils/token";
import { cookieUtil } from "../../utils/cookies";

const memberSignup = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberService.signup(req.body);
  const { accessToken, refreshToken, token, user } = result;

  tokenUtils.setTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSession(res, token as string);

  res.status(201).json({
    success: true,
    message: "Member created successfully",
    data: {
      user: user,
      accessToken,
      refreshToken,
    },
  });
});

const memberLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await MemberService.login(req.body);
  const { accessToken, refreshToken, token, user } = result;

  tokenUtils.setTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSession(res, token as string);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: user,
      accessToken,
      refreshToken,
    },
  });
});

const memberGetCurrent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await MemberService.getCurrentMember(userId);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session-token"];

  if (!sessionToken) {
    throw new AppError(
      401,
      "Unauthorized, please login to access this resource",
    );
  }
  await MemberService.logout(sessionToken);

  cookieUtil.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  cookieUtil.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  cookieUtil.clearCookie(res, "better-auth.session-token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const MemberController = {
  signup: memberSignup,
  login: memberLogin,
  getCurrentMember: memberGetCurrent,
  logout,
};
