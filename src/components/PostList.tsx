"use client";
import { Post, User } from "@prisma/client";
import { FormattedDate } from "./FormattedDate";
import { api } from "@/trpc/react";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { LoadingSpinner } from "./LoadingSpinner";

type Post0 = {
  createdBy: User;
} & Post;

type Props = { initialPosts: Post0[] };

export default function PostList(props: Props) {
  // let getPosts = api.post.getLatest.useInfiniteQuery();

  // to invalidate:
  // let utils=api.useUtils()
  // utils.post.invalidate()
  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    ...getPosts
  } = api.post.getLatest.useInfiniteQuery(
    {},
    {
      initialData: {
        pages: [{ posts: props.initialPosts, nextCursor: 2 }],
        pageParams: [],
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // initialCursor: 1, // <-- optional you can pass an initialCursor
    },
  );

// console.log(getPosts.data),
  // console.log("hasssnext", hasNextPage);
  // const [posts, setPosts] = useState(props.initialPosts);

  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  async function fetchPosts() {
    // const skip = posts?.length || 0;
    const newPosts = fetchNextPage();
    // const uniquePosts = removeDuplicates([
    //   ...(posts || []),
    //   ...(newPosts?.posts || []),
    // ]);
    // setPosts([...(posts || []), ...newPosts.posts]);
    // setHasMore(newPosts.hasMore);
  }

  // function removeDuplicates(tweets:any) {
  //   const tweetSet = new Set();
  //   return tweets.filter((tweet:any) => {
  //     if (tweetSet.has(tweet.id)) {
  //       return false;
  //     } else {
  //       tweetSet.add(tweet.id);
  //       return true;
  //     }
  //   });
  // }

  // useEffect(() => {
  //   fetchTweets();
  // }, []);

  useEffect(() => {
    if (inView && !getPosts.isLoading && hasMore) {
      fetchPosts();
    }
  }, [getPosts.isLoading, inView, , hasMore]);

  return (
    <>
      {getPosts.data?.pages.map((page, i) => (
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
