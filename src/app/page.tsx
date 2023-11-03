import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Post from "@/components/Post";
import NewPost from "@/components/NewPost";

export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();
  console.log("sesssss", session);

  let posts = await api.post.getLatest.query();

  return (
    <main className="flex min-h-screen flex-col   text-white">
      <div className="container flex max-w-xl flex-col items-center justify-center gap-6 px-4 py-10 ">
        <NewPost />

        <h1 className="self-start text-2xl font-bold tracking-tight ">
          Latest Posts
        </h1>
        {posts.map((p) => (
          <Post {...p} />
        ))}
      </div>
    </main>
  );
}
