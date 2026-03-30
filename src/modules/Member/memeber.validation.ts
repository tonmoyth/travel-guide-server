import { z } from "zod";

export const signupValidationSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  profilePhoto: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
});

export const loginValidationSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordValidationSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const emailVerificationValidationSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().min(6, "OTP must be at least 6 characters"),
});

export const MemberValidationSchema = {
  signupValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  emailVerificationValidationSchema,
};
