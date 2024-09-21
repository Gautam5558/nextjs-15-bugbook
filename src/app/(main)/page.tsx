import { signOut } from "@/auth";
import PostCard from "@/components/post-card";
import PostEditor from "@/components/post-editor";
import TrendsSidebar from "@/components/trends-sidebar";
import { db } from "@/lib/connectDb";
import { postDataInclude } from "@/lib/types";

export default async function Home() {
  const feedData = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: postDataInclude,
  });
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
        {feedData.map((item) => {
          return <PostCard item={item} key={item.id} />;
        })}
      </div>
      <TrendsSidebar />
    </main>
  );
}
