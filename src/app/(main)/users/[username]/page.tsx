import { auth } from "@/auth";
import TrendsSidebar from "@/components/trends-sidebar";
import { db } from "@/lib/connectDb";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserAvatar from "../../_components/user-avatar";
import { formatDate } from "date-fns";
import { formatNumber } from "@/lib/utils";
import FollowerCount from "@/components/follower-count";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/follow-button";

interface UserProfilePageProps {
  params: {
    username: string;
  };
}

// Sunce we have do db reads in both our component and generateMetadata function, it is very inefficient to
// do it twice , so instead we would deduplicate our db read, so we make only 1 query to the db.
// We do this using react's cache function.

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await db.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) {
    notFound();
  }
  return user;
});

export async function generateMetadata({
  params: { username },
}: UserProfilePageProps): Promise<Metadata> {
  const session = await auth();

  if (session && session.user && session.user.id) {
    const user = await getUser(username, session.user.id);
    return {
      title: `${user.displayName} (@${user.username})`,
    };
  } else {
    return {};
  }
}

const UserProfilePage = async ({
  params: { username },
}: UserProfilePageProps) => {
  const session = await auth();
  if (session && session.user && session.user.id) {
    const user = await getUser(username, session.user.id);
    return (
      <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
          <UserInfo userData={user} loggedInUserId={session.user.id} />
        </div>
        <TrendsSidebar />
      </main>
    );
  } else {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }
};

export default UserProfilePage;

interface UserInfoProps {
  userData: UserData;
  loggedInUserId: string;
}

const UserInfo = ({ userData, loggedInUserId }: UserInfoProps) => {
  const followerInfo: FollowerInfo = {
    followers: userData._count.followers,
    isFollowedByUser: userData.followers.some((item) => {
      return item.followerId === loggedInUserId;
    }),
  };
  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={userData.image}
        size={250}
        className="mx-auto max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{userData.displayName}</h1>
            <div className="text-muted-foreground">@{userData.username}</div>
          </div>
          <div>
            Member since {formatDate(userData.createdAt, "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(userData._count.posts)}
              </span>
            </span>
            <FollowerCount userId={userData.id} initialState={followerInfo} />
          </div>
        </div>
        {userData.id === loggedInUserId ? (
          <Button>Edit Profile</Button>
        ) : (
          <FollowButton userId={userData.id} initialState={followerInfo} />
        )}
      </div>
      {userData.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {userData.bio}
          </div>
        </>
      )}
    </div>
  );
};
