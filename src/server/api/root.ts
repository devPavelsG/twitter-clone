import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "~/server/api/routers/posts";
import {profileRouter} from "~/server/api/routers/profile";
import {webhooksRouter} from "~/server/api/routers/webhooks";
import {chatRouter} from "~/server/api/routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  profile: profileRouter,
  webhooks: webhooksRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
