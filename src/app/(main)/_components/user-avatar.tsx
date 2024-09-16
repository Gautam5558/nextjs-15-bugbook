"use client";

import Image from "next/image";
import React from "react";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  size?: number;
  avatarUrl: string | null | undefined;
  className?: string;
}

const UserAvatar = ({ size, avatarUrl, className }: UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt="User Avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
};

export default UserAvatar;
