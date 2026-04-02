import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVeriables } from "../config/env";
import { MemberRole } from "../../prisma/generated/prisma/enums";
import { bearer, emailOTP, oAuthProxy } from "better-auth/plugins";
import { sendEmail } from "../utils/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: envVeriables.FRONTEND_URL,
  secret: envVeriables.BETTER_AUTH_SECRET,
  trustedOrigins: [envVeriables.FRONTEND_URL!],

  socialProviders: {
    google: {
      clientId: envVeriables.GOOGLE_CLIENT_ID as string,
      clientSecret: envVeriables.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: () => {
        return {
          role: MemberRole.MEMBER,
          isDeleted: false,
          deletedAt: null,
        };
      },
    },
  },

  redirects: {
    signIn: `${envVeriables.BETTER_AUTH_URL}/api/v1/auth/google/success`,
  },

  user: {
    additionalFields: {
      profilePhoto: { type: "string", required: false },
      role: { type: "string", required: false, defaultValue: "MEMBER" },
      status: { type: "string", required: false, defaultValue: "ACTIVE" },
      bio: { type: "string", required: false },
      address: { type: "string", required: false },
      gender: { type: "string", required: false },
      isDeleted: { type: "boolean", required: false, defaultValue: false },
      deletedAt: { type: "date", required: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
    minPasswordLength: 6,
  },

  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  // plugins: [
  //   bearer(),
  //   emailOTP({
  //     overrideDefaultEmailVerification: true,
  //     async sendVerificationOTP({ email, otp, type }) {
  //       if (type === "email-verification") {
  //         const user = await prisma.user.findUnique({ where: { email } });

  //         if (user && !user.emailVerified) {
  //           sendEmail({
  //             to: email,
  //             subject: "Verify Your Email",
  //             templateName: "otp",
  //             templateData: {
  //               name: user.name,
  //               otp,
  //             },
  //           });
  //         }
  //       } else if (type === "forget-password") {
  //         const user = await prisma.user.findUnique({ where: { email } });
  //         if (user) {
  //           sendEmail({
  //             to: email,
  //             subject: "Reset Your Password",
  //             templateName: "otp",
  //             templateData: {
  //               name: user.name,
  //               otp,
  //             },
  //           });
  //         }
  //       }
  //     },
  //     expiresIn: 5 * 60, // OTP expires in 5 minutes
  //     otpLength: 6, // OTP length of 6 digits
  //   }),
  // ],

  session: {
    expiresIn: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60,
    },
  },

  advanced: {
    cookies: {
      session_token: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },

  // plugins: [oAuthProxy()],
});
