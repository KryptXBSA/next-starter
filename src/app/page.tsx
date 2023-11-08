import { api } from "@/trpc/server";
import PostList from "@/components/PostList";
import NewPost from "@/components/NewPost";

export default async function Home() {
  let data = await api.post.getLatest.query({"cursor":0});
  return (
    <main className="flex min-h-screen flex-col   text-white">
      <div className="container flex max-w-xl flex-col items-center justify-center gap-6 px-4 py-10 ">
        <NewPost />
        <h1 className="self-start text-xl font-bold  ">Latest Posts</h1>
        <PostList initialPosts={data.posts} />
      </div>
    </main>
  );
}
