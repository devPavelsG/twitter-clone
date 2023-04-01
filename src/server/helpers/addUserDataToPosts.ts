import {type Post} from "@prisma/client";
import {filterUserForClient} from "~/server/helpers/filterUserForClient";
import {TRPCError} from "@trpc/server";
import {clerkClient} from "@clerk/nextjs/api";

export const addUserDataToPosts = async (posts: Post[]) => {
  const users = (await clerkClient.users.getUserList({
    userId: posts.map(post => post.authorId),
    limit: 100
  })).map(filterUserForClient);

  return posts.map(post => {
    const author = users.find(user => user.id === post.authorId);

    if (!author || !author.username) throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Author not found"
    });

    return {
      post,
      author: {
        ...author,
        username: author.username
      }
    };
  });
}