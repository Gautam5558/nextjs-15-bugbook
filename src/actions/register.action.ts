"use server";

import { db } from "@/lib/connectDb";
import { registerFormSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const register = async (values: z.infer<typeof registerFormSchema>) => {
  const validatedFeilds = registerFormSchema.safeParse(values);

  if (!validatedFeilds.success) {
    return { error: "Invalid Feilds", success: undefined };
  }

  const { email, password, username } = validatedFeilds.data;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "Email already in use", success: undefined };
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = await db.user.create({
    data: {
      name: username,
      password: hashedPassword,
      email,
    },
  });

  return { error: undefined, success: "User Registered" };
};
