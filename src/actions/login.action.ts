"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/connectDb";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginFormSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof loginFormSchema>) => {
  const validatedFeilds = loginFormSchema.safeParse(values);

  if (!validatedFeilds.success) {
    return { error: "Invalid Credentials", success: undefined };
  }

  const { email, password } = validatedFeilds.data;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser || !existingUser.password) {
    return {
      success: undefined,
      error: "User isnt registered or registered with github or google",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin": {
          return { error: "Invalid credentails", success: undefined };
        }
        default: {
          return { error: "Something went wrong", success: undefined };
        }
      }
    }
    throw err;
  }

  return { success: "loggedIn", error: undefined };
};
