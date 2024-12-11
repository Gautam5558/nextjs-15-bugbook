"use client";
import { useFollowInfo } from "@/hooks/use-follow-info";
import { FollowerInfo } from "@/lib/types";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface FollowInfoProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowButton = ({ userId, initialState }: FollowInfoProps) => {
  const query = useFollowInfo(userId, initialState);
  const data = query.data;
  const mutation = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete("/api/users/" + userId + "/followers")
        : kyInstance.post("/api/users/" + userId + "/followers"),
  });

  return (
    <Button
      onClick={() => {
        mutation.mutate();
      }}
      variant={data.isFollowedByUser ? "secondary" : "default"}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
