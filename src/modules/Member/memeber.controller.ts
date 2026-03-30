import { Request, Response } from "express";
import { catchAsync } from "../../shared";
import AppError from "../../errors/AppError";
import { auth } from "../../lib/auth";

import { MemberService } from "./memeber.service";
import { tokenUtils } from "../../utils/token";
import { cookieUtil } from "../../utils/cookies";
import { envVeriables } from "../../config/env";
import status from "http-status";

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
      token,
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
      token,
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
  const sessionToken = req.cookies["better-auth.session_token"];

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

const getNewRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const sessionToken = req.cookies?.["better-auth.session-token"];

  if (!refreshToken || !sessionToken) {
    throw new AppError(401, "Refresh token and session token are required.");
  }

  const result = await MemberService.getNewRefreshToken(
    refreshToken,
    sessionToken,
  );

  tokenUtils.setTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
  tokenUtils.setBetterAuthSession(res, sessionToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      session: result.session,
    },
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = (req.query.redirect as string) || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);

  const callbackURL = `${envVeriables.BETTER_AUTH_URL}/api/v1/members/google/success?redirect=${encodedRedirectPath}`;
  const errorCallbackURL = `${envVeriables.BETTER_AUTH_URL}/api/v1/members/google/error?redirect=${encodedRedirectPath}`;

  const socialRedirect = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL,
      errorCallbackURL,
      disableRedirect: true,
    },
  });

  if (!socialRedirect || !socialRedirect.url) {
    throw new AppError(500, "Google OAuth login flow initialization failed");
  }

  res.redirect(socialRedirect.url);
});

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = (req.query.redirect as string) || "/dashboard";

  const session = req.cookies["better-auth.session-token"];

  if (!session) {
    return res.redirect(
      `${envVeriables.FRONTEND_URL}/login?error=Google login failed. No session token found.`,
    );
  }

  const verifiedSession = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session-token=${session}`,
    },
  });

  if (!verifiedSession) {
    return res.redirect(
      `${envVeriables.FRONTEND_URL}/login?error=Google login failed. Invalid session token.`,
    );
  }

  if (verifiedSession && !verifiedSession.user) {
    return res.redirect(
      `${envVeriables.FRONTEND_URL}/login?error=Google login failed. User not found.`,
    );
  }

  const result = await MemberService.googleLoginSuccess(verifiedSession.user);

  const { accessToken, refreshToken } = result;

  tokenUtils.setTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);

  const isValidRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVeriables.FRONTEND_URL}${finalRedirectPath}`);
});

const handleGoogleError = catchAsync(async (req: Request, res: Response) => {
  const error =
    (req.query.error as string) ||
    "Google login failed. An unknown error occurred.";
  res.redirect(`${envVeriables.FRONTEND_URL}/login?error=${error}`);
});

// TODO:
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const sessionToken = req.cookies["better-auth.session_token"];

  if (!sessionToken) {
    throw new AppError(401, "Session token is required to change password.");
  }

  const result = await MemberService.changePassword(payload, sessionToken);

  const { accessToken, refreshToken } = result;

  tokenUtils.setTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSession(res, sessionToken);

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError(status.BAD_REQUEST, "Email and OTP are required.");
  }

  await MemberService.verifyEmail(email, otp);
  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
  });
});

export const MemberController = {
  signup: memberSignup,
  login: memberLogin,
  getCurrentMember: memberGetCurrent,
  logout,
  getNewRefreshToken,
  googleLogin,
  googleLoginSuccess,
  handleGoogleError,
  changePassword,
  verifyEmail,
};
