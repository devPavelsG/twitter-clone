import type {Post, User} from "@prisma/client";

export function isLikedByUser(post: Post & { user: User; likedBy: User[] }, userId: string | undefined): boolean {
  return !!post.likedBy.find((like) => like.id === userId);
}
