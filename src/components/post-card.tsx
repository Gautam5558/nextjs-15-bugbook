import UserAvatar from "@/app/(main)/_components/user-avatar";
import type { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface PostCardProps {
  item: PostData;
}

const PostCard = ({ item }: PostCardProps) => {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Link href={"/users/" + item.user.username}>
          <UserAvatar avatarUrl={item.user.image} />
        </Link>
        <div>
          <Link
            href={"/users/" + item.user.username}
            className="block font-medium hover:underline"
          >
            {item.user.displayName}
          </Link>
          <Link
            href={"/posts/" + item.id}
            className="block text-sm text-muted-foreground hover:underline"
          >
            {/* formatRelativeDate(item.createdAt) */}
          </Link>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">{item.content}</div>
    </article>
  );
};

export default PostCard;
