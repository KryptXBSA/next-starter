import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Post from "@/components/Post";
import NewPost from "@/components/NewPost";

export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();
  console.log("sesssss",session)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center  text-white">
      <div className="container max-w-xl flex flex-col items-center justify-center gap-6 px-4 py-10 ">
        <NewPost/>

        <h1 className="text-2xl self-start font-bold tracking-tight ">
          Latest Posts
        </h1>
        <Post/>
      </div>
    </main>
  );
}

