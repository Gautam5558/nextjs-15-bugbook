"use client";
import { useFollowInfo } from "@/hooks/use-follow-info";
import { FollowerInfo } from "@/lib/types";
import { Button } from "./ui/button";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { toast } from "@/hooks/use-toast";

interface FollowInfoProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowButton = ({ userId, initialState }: FollowInfoProps) => {
  const query = useFollowInfo(userId, initialState);
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];
  const data = query.data;
  const mutation = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete("/api/users/" + userId + "/followers")
        : kyInstance.post("/api/users/" + userId + "/followers"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => {
        return {
          followers:
            (previousState?.followers || 0) +
            (previousState?.isFollowedByUser ? -1 : 1),
          isFollowedByUser: !previousState?.isFollowedByUser,
        };
      });
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.log(error);
      toast({
        variant: "destructive",
        description: "Something went wrong.Try again.",
      });
    },
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
