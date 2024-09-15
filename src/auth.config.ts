import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig, User } from "next-auth";

import { db } from "./lib/connectDb";
import bcrypt from "bcryptjs";
import { loginFormSchema } from "./schemas";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFeilds = loginFormSchema.safeParse(credentials);

        if (validatedFeilds.success) {
          const { email, password } = validatedFeilds.data;

          const existingUser = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!existingUser || !existingUser.password) {
            return null;
          }

          const passwordMatches = await bcrypt.compare(
            password,
            existingUser.password,
          );

          if (passwordMatches) {
            const userData: User = {
              id: existingUser.id,
              name: existingUser.username,
              image: existingUser.image,
              email: existingUser.email,
            };

            return userData;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
