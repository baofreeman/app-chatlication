import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, { message: "Min 3 character" }),
  email: z.string().email({ message: "Email is require" }),
  password: z.string().min(6, { message: "Min 6 character" }),
  password_confirmation: z.string().min(6, { message: "Min 6 character" }),
});

export const verifyEmailSchema = z.object({
  email: z.string().email({ message: "Email is require" }),
  otp: z.string().min(4, { message: "Min 4 character" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Email is require" }),
  password: z.string().min(6, { message: "Min 6 character" }),
});
