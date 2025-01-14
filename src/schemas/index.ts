import * as z from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "password is required" }),
});

export const registerFormSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  username: z.string().min(1, { message: "Username is required" }),
});

export const postValidationSchema = z.object({
  content: z.string().trim().min(1, { message: "required" }),
});

// Here i am not keeping image prop in my updateProfileSchema because image upload
// will be handled separately by uploadthing in the core.ts file route handler

export const updateProfileSchema = z.object({
  displayName: z.string().min(1, { message: "Display Name is required" }),
  bio: z
    .string()
    .max(1000, { message: "Bio can be at most of 1000 characters" }),
});
