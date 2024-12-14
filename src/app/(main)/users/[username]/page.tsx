import { auth } from "@/auth";
import TrendsSidebar from "@/components/trends-sidebar";
import { db } from "@/lib/connectDb";
import { getUserDataSelect } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

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
        <div className="w-full min-w-0 space-y-5"></div>
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
