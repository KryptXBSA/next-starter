import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ body: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      return db.post.create({
        data: {
          body: input.body,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      }),
    )
    .query(async (opts) => {
    function delay(milliseconds:number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Delay completed after " + milliseconds + " milliseconds");
    }, milliseconds);
  });
}
    await delay(2999)
      console.log("inpp", opts.input);
      const { input } = opts;
      const limit = input.limit ?? 5;
      const { cursor } = input;
    
      const posts = await db.post.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: { createdBy: true },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }
    console.log("ressss",nextCursor,posts.length)

      return {
        posts,
        nextCursor,
      };
    }),
});
