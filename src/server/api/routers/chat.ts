import {createTRPCRouter, privateProcedure} from "~/server/api/trpc";
import {TRPCError} from "@trpc/server";
import {z} from "zod";

export const chatRouter = createTRPCRouter({
  getChatsForUser: privateProcedure.input(z.object({
      userId: z.string()
    })
  ).mutation(async (
    {ctx, input}) => {
    const chats = await ctx.prisma.chat.findMany(
      {
        where: {OR: [{senderId: input.userId}, {receiverId: input.userId}]},
        include: {sender: true, receiver: true},
      });

    if (!chats) throw new TRPCError({
      code: "NOT_FOUND",
      message: "Chats not found"
    });

    ctx.io.to(input.userId).emit("chats", chats);

    return 200;
  }),
  sendMessage: privateProcedure.input(z.object({
    receiverId: z.string(), message: z.string()
  })).mutation(async ({ctx, input}) => {
    const chat = await ctx.prisma.chat.create({
      data: {
        message: input.message,
        receiver: {connect: {id: input.receiverId}},
        sender: {connect: {id: ctx.userId}},
      }
    });

    ctx.io.to(input.receiverId).emit("message", chat);

    return 200;
  }),
});