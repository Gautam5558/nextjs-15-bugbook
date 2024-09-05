"use client";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  console.log(session);
  const handleClick = () => {
    signOut();
  };

  return (
    <button
      onClick={() => {
        handleClick();
      }}
    >
      signOut
    </button>
  );
}
