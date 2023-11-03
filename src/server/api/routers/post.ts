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

  getLatest: publicProcedure.query(() => {
    return db.post.findMany({ include: { createdBy: true } });
  }),
});
