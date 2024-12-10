import { auth } from "@/auth";
import { db } from "@/lib/connectDb";
import { FollowerInfo } from "@/lib/types";

// To check whether we follow userId or not
export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const session = await auth();
    if (session && session.user) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          followers: {
            where: {
              followerId: session.user.id,
            },
            select: {
              followerId: true,
            },
          },
          _count: {
            select: {
              followers: true,
            },
          },
        },
      });

      if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      const data: FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: !!user.followers.length,
      };

      return Response.json(data, { status: 200 });
    } else {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// To follow a user/ creating a follow. We use upsert instead of create here because
// create throws an error if the entry already exists but upsert ignores if already
// exits and creates a new one if it doesnt

export async function Post(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const session = await auth();
    if (session && session.user && session.user.id) {
      await db.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: userId,
          },
        },
        create: {
          followerId: session.user.id,
          followingId: userId,
        },
        update: {},
      });

      return new Response();
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// To unfollow a user, that is to delete a follow, here also we use deletemany
// instead of delete because delete throws an error if the entry we are trying
// to delete doesnt exist but deleteMany ignores if it doesnt exist and deletes
// if it does exist

export async function Delete(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const session = await auth();
    if (session && session.user && session.user.id) {
      await db.follow.deleteMany({
        where: {
          followerId: session.user.id,
          followingId: userId,
        },
      });

      return new Response();
    } else {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
