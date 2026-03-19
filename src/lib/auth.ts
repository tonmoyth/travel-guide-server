import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVeriables } from "../config/env";

export const auth = betterAuth({
  baseURL: envVeriables.BETTER_AUTH_URL,
  secret: envVeriables.BETTER_AUTH_SECRET,
  trustedOrigins: ["http://localhost:3000"],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      profilePhoto: { type: "string", required: false },
      role: { type: "string", required: false, defaultValue: "MEMBER" },
      bio: { type: "string", required: false },
      address: { type: "string", required: false },
      gender: { type: "string", required: false },
      isDeleted: { type: "boolean", required: false, defaultValue: false },
      deletedAt: { type: "date", required: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  session: {
    expiresIn: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60,
    },
  },

  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
    },
  },
});
