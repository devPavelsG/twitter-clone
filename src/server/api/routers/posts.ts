import {createTRPCRouter, privateProcedure, publicProcedure} from "~/server/api/trpc";
import {TRPCError} from "@trpc/server";
import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";
import {z} from "zod";

// RateLimiter, that allows 3 requests per 1 minute
const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});


export const postsRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({
      id: z.string()
    })
  ).query(async (
    {ctx, input}) => {
    const post = await ctx.prisma.post.findUnique(
      {
        where: {id: input.id},
        include: {
          user: true,
          likedBy: true,
        }
      })

    if (!post) throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post not found"
    });

    return post;
  }),

  getAll: publicProcedure.query(async ({ctx}) => await ctx.prisma.post.findMany({
      take: 100,
      include: {user: true, likedBy: true},
      orderBy: [{createdAt: "desc"}]
    })
  ),

  getPostsByUserId: publicProcedure.input(z.object({
    userId: z.string()
  })).query(({ctx, input}) => ctx.prisma.post.findMany({
    where: {userId: input.userId},
    include: {user: true, likedBy: true},
    take: 100,
    orderBy: [{createdAt: "desc"}],
  })),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
      })
    )
    .mutation(async ({ctx, input}) => {
      const authorId = ctx.userId;

      const {success} = await rateLimit.limit(authorId);
      if (!success) throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests. Please try again later!"
      });

      return await ctx.prisma.post.create({
        data: {
          content: input.content,
          user: {
            connect: {id: authorId},
          },
        },
      });
    }),

  like: privateProcedure.input(z.object({id: z.string()})).mutation(async ({ctx, input}) => {
    const userId = ctx.userId;
    const postId = input.id;

    const post = await ctx.prisma.post.findUnique({
      where: {id: postId},
      include: {likedBy: true},
    });

    if (!post) throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post not found"
    });

    const like = post.likedBy.find(like => like.id === userId);

    if (!!like) {
      await ctx.prisma.post.update({
        where: {id: postId},
        data: {
          likedBy: {disconnect: {id: userId}},
        },
      });
      await ctx.prisma.user.update({
        where: {id: userId},
        data: {
          likedPosts: {disconnect: {id: postId}},
        },
      });
    } else {
      await ctx.prisma.post.update({
        where: {id: postId},
        data: {
          likedBy: {connect: {id: userId}},
        },
      });
      await ctx.prisma.user.update({
        where: {id: userId},
        data: {
          likedPosts: {connect: {id: postId}},
        },
      });
    }

    return true;
  }),
});