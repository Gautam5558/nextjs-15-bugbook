import { auth } from "@/auth";
import { db } from "@/lib/connectDb";
import { postDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (session && session.user) {
      const posts = await db.post.findMany({
        orderBy: { createdAt: "desc" },
        include: postDataInclude,
      });
      return Response.json(posts);
    }

    return Response.json({ error: "Unauthorized" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
