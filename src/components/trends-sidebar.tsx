import UserAvatar from "@/app/(main)/_components/user-avatar";
import { auth } from "@/auth";
import { db } from "@/lib/connectDb";
import Link from "next/link";
import React, { Suspense } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
};

export default TrendsSidebar;

async function WhoToFollow() {
  const session = await auth();
  if (session && session.user) {
    const users = await db.user.findMany({
      where: {
        NOT: {
          id: session.user.id,
        },
      },
      select: {
        username: true,
        displayName: true,
        image: true,
        id: true,
        email: true,
      },
      take: 3,
    });

    return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">Who to follow</div>
        {users.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-5"
            >
              <Link href={"/users/" + item.username}>
                <UserAvatar avatarUrl={item.image} className="flex-none" />
                <div>
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                    {item.displayName}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">
                    {item.username}
                  </p>
                </div>
              </Link>
              <Button>Follow</Button>
            </div>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await db.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;
    return result.map((item) => {
      return {
        hashtag: item.hashtag,
        count: Number(item.count),
      };
    });
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">
        {trendingTopics.map((item) => {
          const title = item.hashtag.split("#")[1];
          return (
            <Link key={title} href={"/hashtag/" + title} className="block">
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                #{title}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(item.count)} {item.count === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
