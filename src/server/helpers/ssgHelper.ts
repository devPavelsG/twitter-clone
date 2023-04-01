import {appRouter} from "~/server/api/root";
import {prisma} from "~/server/db";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import superjson from "superjson";

export const generateSSGHelper = () => createProxySSGHelpers({
  router: appRouter,
  ctx: {prisma, userId: null},
  transformer: superjson,
});