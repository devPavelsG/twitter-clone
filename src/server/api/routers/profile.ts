import {createTRPCRouter, privateProcedure, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {TRPCError} from "@trpc/server";


export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure.input(z.object({
    username: z.string()
  })).query(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findUnique({
      where: {username: input.username},
      include: {
        following: true,
        followedBy: true,
      }
    });

    if (!user) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });

    return user;
  }),

  getUserById: publicProcedure.input(z.object({
    id: z.string()
  })).query(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findUnique({
      where: {id: input.id},
      include: {
        following: true,
        followedBy: true,
      }
    });

    if (!user) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });

    return user;
  }),

  getUserByIdOnEvent: publicProcedure.input(z.object({
    id: z.string()
  })).mutation(async ({ctx, input}) => {
    const user = await ctx.prisma.user.findUnique({
      where: {id: input.id},
      include: {
        following: true,
        followedBy: true,
      }
    });

    if (!user) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });

    return user;
  }),

  followUser: privateProcedure.input(z.object({id: z.string()})).mutation(async ({ctx, input}) => {
    const userId = ctx.userId;
    const followingUserId = input.id;

    const user = await ctx.prisma.user.findUnique({
      where: {id: userId},
      include: {following: true},
    });

    if (!user) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found"
    });

    const following = user.following.some((followingUser) => followingUser.id === followingUserId);

    if (!!following) {
      await ctx.prisma.user.update({
        where: {id: userId},
        data: {
          following: {disconnect: {id: followingUserId}},
        },
      });
    } else {
      await ctx.prisma.user.update({
        where: {id: userId},
        data: {
          following: {connect: {id: followingUserId}},
        },
      });
    }

    return true;
  }),
});