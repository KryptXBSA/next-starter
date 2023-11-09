"use client";
import { Post, User } from "@prisma/client";
import { FormattedDate } from "./FormattedDate";
import { api } from "@/trpc/react";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { LoadingSpinner } from "./LoadingSpinner";

type Post0 = {
  createdBy: { username: string; id: string };
} & Post;

type Props = { initialPosts: Post0[] };

export default function PostList(props: Props) {
  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    data,
    ...getPosts
  } = api.post.getLatest.useInfiniteQuery(
    {},
    {
      initialData: {
        pages: [{ posts: props.initialPosts, nextCursor: 0 }],
        pageParams: [],
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
    },
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !getPosts.isLoading) {
      fetchNextPage();
    }
  }, [getPosts.isLoading, inView]);

  return (
    <>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.posts.map((p) => (
            <article key={p.id} className="mr-auto">
              <h2 className="text-2xl font-semibold">{p.createdBy.username}</h2>
              <p
                className="text-sm text-zinc-500 dark:text-zinc-400"
                suppressHydrationWarning
              >
                <FormattedDate date={p.createdAt} />
              </p>
              <p className="mt-1">{p.body}</p>
            </article>
          ))}
        </React.Fragment>
      ))}
      <div ref={ref}>
        {hasNextPage && <LoadingSpinner />}
        {getPosts.isLoading && <LoadingSpinner />}
      </div>
    </>
  );
}
