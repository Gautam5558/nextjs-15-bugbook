"use server";

import { auth } from "@/auth";
import { db } from "@/lib/connectDb";
import { postValidationSchema } from "@/schemas";
import { User } from "next-auth";
import { z } from "zod";

export const submitPost = async (
  values: z.infer<typeof postValidationSchema>,
) => {
  const session = await auth();

  if (session && session.user) {
    const { user } = session;
    const validatedFeilds = postValidationSchema.safeParse(values);

    if (!validatedFeilds.success) {
      throw new Error("Wrong input");
    }

    const { content } = validatedFeilds.data;

    if (!user.id) {
      throw new Error("User id doesnt exist");
    }

    const newPost = await db.post.create({
      data: {
        content,
        userId: user.id,
      },
    });
  } else {
    throw new Error("Unauthorized");
  }
};
