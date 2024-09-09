"use client";

import Image from "next/image";
import React from "react";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

interface UserAvatarProps {
  size?: number;
  avatarUrl: string | null | undefined;
}

const UserAvatar = ({ size, avatarUrl }: UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt="User Avatar"
      width={size ?? 48}
      height={size ?? 48}
      className="aspect-square h-fit flex-none rounded-full bg-secondary object-cover"
    />
  );
};

export default UserAvatar;
