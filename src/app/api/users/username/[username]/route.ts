import { auth } from "@/auth";
import { db } from "@/lib/connectDb";
import { getUserDataSelect } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { username } }: { params: { username: string } },
) {
  try {
    const session = await auth();
    if (session && session.user && session.user.id) {
      const user = await db.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive",
          },
        },
        select: getUserDataSelect(session.user.id),
      });
      console.log(user);
      if (!user) {
        return Response.json({ error: "User does't exit" }, { status: 404 });
      }

      return Response.json(user);
    } else {
      return Response.json({ error: "Unauthorized" }, { status: 400 });
    }
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
