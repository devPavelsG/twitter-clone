import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {TRPCError} from "@trpc/server";
import {type ClerkUserEvent, ClerkUserEventType} from "../../../../types/ClerkUserEvent";


export const webhooksRouter = createTRPCRouter({
  clerk: publicProcedure.mutation( async ({ctx}) => {
    if (!ctx.req.body) {
      throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Bad request"});
    }

    const event = await ctx.req.body as ClerkUserEvent;

    if (event.type === ClerkUserEventType.USER_CREATED) {
      await ctx.prisma.user.create({
        data: {
          id: event.data.id,
          username: event.data.username ?? `user-${Math.random().toString(36).substring(2)}`,
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          profileImageUrl: event.data.profile_image_url,
        }
      })
    }

    if (event.type === ClerkUserEventType.USER_UPDATED) {
      await ctx.prisma.user.update({
        where: {id: event.data.id},
        data: {
          id: event.data.id,
          username: event.data.username ?? `user-${Math.random().toString(36).substring(2)}`,
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          profileImageUrl: event.data.profile_image_url,
        }
      })
    }

    if (event.type === ClerkUserEventType.USER_DELETED) {
      await ctx.prisma.user.delete({
        where: {id: event.data.id},
      })
    }

    return 200;
  })
});