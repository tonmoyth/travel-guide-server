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

export const MemberValidationSchema = {
  signupValidationSchema,
  loginValidationSchema,
};
