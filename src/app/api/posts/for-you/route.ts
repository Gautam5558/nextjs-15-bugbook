import { auth } from "@/auth";
import { db } from "@/lib/connectDb";
import { postDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 5;
    const session = await auth();

    if (session && session.user) {
      const posts = await db.post.findMany({
        orderBy: { createdAt: "desc" },
        include: postDataInclude,
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;
      const data: PostsPage = {
        posts: posts.slice(0, pageSize),
        nextCursor,
      };
      return Response.json(data);
    }

    return Response.json({ error: "Unauthorized" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
