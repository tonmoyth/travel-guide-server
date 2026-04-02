import { NextFunction, Request, Response } from "express";

import { cookieUtil } from "../utils/cookies";
import AppError from "../errors/AppError";
import { prisma } from "../lib/prisma";
import { MemberRole } from "../../prisma/generated/prisma/enums";
import { jwtUtils } from "../utils/jwtUtils";
import { envVeriables } from "../config/env";

const chackAuth = (...roles: MemberRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session =
        cookieUtil.getCookie(req, "__Secure-session_token") ||
        cookieUtil.getCookie(req, "better-auth.session_token");

      if (!session) {
        throw new AppError(
          401,
          "Unauthorized, please login to access this resource",
        );
      }

      const isExistUser = await prisma.session.findFirst({
        where: {
          token: session,
        },
        include: {
          user: true,
        },
      });

      if (!isExistUser || !isExistUser.user) {
        throw new AppError(
          401,
          "Unauthorized, please login to access this resource",
        );
      }

      if (isExistUser.user.isDeleted) {
        throw new AppError(
          403,
          "Forbidden, your account is blocked or deleted, please contact support",
        );
      }

      if (roles.length > 0 && !roles.includes(isExistUser.user.role)) {
        throw new AppError(
          403,
          "Forbidden, you don't have permission to access this resource",
        );
      }

      const accessToken = cookieUtil.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          401,
          "Unauthorized, please login to access this resource",
        );
      }

      const jwtSecret = envVeriables.JWT_SECRET_KEY;
      if (!jwtSecret) {
        throw new AppError(
          500,
          "Server misconfiguration: JWT secret is missing",
        );
      }

      const isValidAccessToken = jwtUtils.verifyToken(accessToken, jwtSecret);

      if (!isValidAccessToken) {
        throw new AppError(
          401,
          "Unauthorized, please login to access this resource",
        );
      }

      req.user = {
        id: isExistUser.user.id,
        email: isExistUser.user.email,
        role: isExistUser.user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default chackAuth;
