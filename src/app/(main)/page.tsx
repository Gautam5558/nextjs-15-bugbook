"use client";
import PostEditor from "@/components/post-editor";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  console.log(session);
  const handleClick = () => {
    signOut();
  };

  return (
    <main className="h-[200vh] w-full bg-red-50">
      <div className="w-full">
        <PostEditor />
        <button
          onClick={() => {
            handleClick();
          }}
        >
          signOut
        </button>
      </div>
    </main>
  );
}
