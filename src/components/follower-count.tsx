"use client";

import { useFollowInfo } from "@/hooks/use-follow-info";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
  const { data } = useFollowInfo(userId, initialState);
  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
};

export default FollowerCount;
