import { Prisma } from "@prisma/client";

export const getUserDataSelect = (loggedInUserId: string) => {
  return {
    id: true,
    username: true,
    displayName: true,
    email: true,
    image: true,
    bio: true,
    createdAt: true,
    followers: {
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
        posts: true,
      },
    },
  } satisfies Prisma.UserSelect;
};

export const postDataInclude = {
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      image: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
export type UserData = Omit<
  Prisma.UserGetPayload<{
    include: ReturnType<typeof getUserDataSelect>;
  }>,
  "password" | "emailVerified" | "updatedAt"
>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
