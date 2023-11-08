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
        cursor: z.number().nullish(),
      }),
    )
    .query(async (opts) => {
      // limit is how many posts is going to be fetched, currently fetching 5 posts at a time
      const limit = 5;
      const { cursor } = opts.input;

      const posts = await db.post.findMany({
        take: limit + 1,
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
      console.log("resss getLatest len,next: ", posts.length, nextCursor);
      return {
        posts,
        nextCursor,
      };
    }),
});
