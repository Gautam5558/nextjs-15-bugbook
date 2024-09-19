import PostCard from "@/components/post-card";
import PostEditor from "@/components/post-editor";
import { db } from "@/lib/connectDb";
import { postDataInclude } from "@/lib/types";

export default async function Home() {
  const feedData = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: postDataInclude,
  });
  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {feedData.map((item) => {
          return <PostCard item={item} key={item.id} />;
        })}
      </div>
    </main>
  );
}
