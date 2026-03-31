import { NextFunction, Request, Response } from "express";
import { cookieUtil } from "../utils/cookies";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwtUtils";
import { envVeriables } from "../config/env";

const optionalAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = cookieUtil.getCookie(req, "better-auth.session_token");

      // ❗ session না থাকলে → skip
      if (!session) {
        return next();
      }

      const isExistUser = await prisma.session.findFirst({
        where: {
          token: session,
        },
        include: {
          user: true,
        },
      });

      // ❗ user না পেলে → skip
      if (!isExistUser || !isExistUser.user) {
        return next();
      }

      // ❗ deleted user → skip (block না, just ignore)
      if (isExistUser.user.isDeleted) {
        return next();
      }

      const accessToken = cookieUtil.getCookie(req, "accessToken");

      // ❗ accessToken না থাকলে → skip
      if (!accessToken) {
        return next();
      }

      const jwtSecret = envVeriables.JWT_SECRET_KEY;

      if (!jwtSecret) {
        return next(); // server issue হলেও block করবো না
      }

      const isValidAccessToken = jwtUtils.verifyToken(accessToken, jwtSecret);

      // ❗ invalid token → skip
      if (!isValidAccessToken) {
        return next();
      }

      // ✅ সব ঠিক থাকলে user attach
      req.user = {
        id: isExistUser.user.id,
        email: isExistUser.user.email,
        role: isExistUser.user.role,
      };

      next();
    } catch (error) {
      // ❗ কোনো error হলেও block না
      next();
    }
  };
};

export default optionalAuth;
