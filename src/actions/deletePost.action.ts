"use server";

import { auth } from "@/auth";
import { db } from "@/lib/connectDb";

export async function deletePost(params: { id: string }) {
  const session = await auth();

  if (session && session.user) {
    const { id } = params;
    const post = await db.post.findUnique({ where: { id } });
    if (!post) {
      throw new Error("Post doesnt exist");
    }
    if (post.userId !== session.user.id) {
      throw new Error("Unauthorized");
    }
    const deletedPost = await db.post.delete({ where: { id } });
    return deletedPost;
  } else {
    throw new Error("Unauthorized");
  }
}
