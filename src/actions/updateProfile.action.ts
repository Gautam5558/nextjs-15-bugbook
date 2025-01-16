"use server";

import { auth } from "@/auth";
import { db } from "@/lib/connectDb";
import { getUserDataSelect } from "@/lib/types";
import { updateProfileSchema } from "@/schemas";
import { z } from "zod";

// both returning an error or throwing an error is one and the same thing.

export async function updateProfile(
  params: z.infer<typeof updateProfileSchema>,
) {
  const validateFeilds = updateProfileSchema.safeParse(params);

  if (!validateFeilds.success) {
    throw new Error("Inputs validation failed");
  }

  const { bio, displayName } = validateFeilds.data;

  // checking if user is logged in or not as only a logged in user can update their profile

  const session = await auth();

  if (session && session.user && session.user.id) {
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        bio,
        displayName,
      },
      select: getUserDataSelect(session.user.id),
    });

    return updatedUser;
  } else {
    throw new Error("Only logged in users can update their profile");
  }
}
