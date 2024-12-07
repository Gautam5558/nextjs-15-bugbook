"use client";
import UserAvatar from "@/app/(main)/_components/user-avatar";
import type { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import PostMoreButton from "./post-more-button";

interface PostCardProps {
  item: PostData;
}

const PostCard = ({ item }: PostCardProps) => {
  const session = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
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
              {formatRelativeDate(item.createdAt)}
            </Link>
          </div>
        </div>
        {
          item.user.id === session.data?.user?.id && (
            <PostMoreButton
              post={item}
              className="opacity-0 transition-opacity group-hover/post:opacity-100"
            />
          )
          // here we have protected/hidden the button on the front-end but we know it isnt secure as front
          // end can be easily modified hence bypassed so, the main security is from the backend that is
          //our server action where we check whether the post which is being deleted is the logged in users post.
        }
      </div>
      <div className="whitespace-pre-line break-words">{item.content}</div>
    </article>
  );
};

export default PostCard;
