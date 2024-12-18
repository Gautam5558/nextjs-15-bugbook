"use client";

import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import UserTooltip from "./user-tooltip";

interface UserLinkTooltipProps {
  children: React.ReactNode;
  username: string;
}

const UserLinkTooltip = ({ children, username }: UserLinkTooltipProps) => {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get("/api/users/username/" + username).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });
  console.log(data);
  // Normally we have to handle loading and error state in client side data fetching,
  // here also we have to do the same, but we do it using our !data check early return,
  // rather than normal loading and error state early return
  if (!data) {
    return (
      <Link
        href={"/users/" + username}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip userData={data}>
      <Link
        href={"/users/" + username}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
};

export default UserLinkTooltip;
