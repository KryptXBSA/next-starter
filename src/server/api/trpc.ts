
import { initTRPC, TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession } from "@/server/auth";


interface CreateContextOptions {
  headers: Headers;
}

export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  const session = await getServerAuthSession();

  return {
    session,
    headers: opts.headers,
  };
};

export const createTRPCContext = async (opts: { req: NextRequest }) => {

  return await createInnerTRPCContext({
    headers: opts.req.headers,
  });
};


const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
