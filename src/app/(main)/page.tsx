import { signOut } from "@/auth";
import PostEditor from "@/components/post-editor";
import TrendsSidebar from "@/components/trends-sidebar";
import ForYouFeed from "./_components/for-you-feed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button>signout</button>
        </form>
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
