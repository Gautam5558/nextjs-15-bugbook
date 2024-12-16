"use client";
import { FollowerInfo, UserData } from "@/lib/types";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import UserAvatar from "@/app/(main)/_components/user-avatar";
import FollowButton from "./follow-button";
import Linkify from "./linkify";
import FollowerCount from "./follower-count";

interface UserTooltipProps {
  userData: UserData;
  children: React.ReactNode;
}

const UserTooltip = ({ userData, children }: UserTooltipProps) => {
  const session = useSession();
  const followerState: FollowerInfo = {
    followers: userData._count.followers,
    isFollowedByUser: userData.followers.some((item) => {
      return item.followerId === session.data?.user?.id;
    }),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="break-works flex max-w-80 flex-col gap-3 px-1 py-2 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={"/users/" + userData.username}>
                <UserAvatar avatarUrl={userData.image} size={70} />
              </Link>
              {userData.id !== session.data?.user?.id && (
                <FollowButton
                  userId={userData.id}
                  initialState={followerState}
                />
              )}
            </div>
            <div>
              <Link href={"/users/" + userData.username}>
                <div className="text-lg font-semibold hover:underline">
                  {userData.displayName}
                </div>
                <div className="text-muted-foreground">
                  @{userData.username}
                </div>
              </Link>
            </div>
            {userData.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {userData.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount userId={userData.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserTooltip;
