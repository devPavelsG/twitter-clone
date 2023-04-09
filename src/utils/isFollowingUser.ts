import type {User} from "@prisma/client";

export function isFollowingUser(following: User[] | undefined, followingAttemptUserId: string | undefined): boolean {
  return !!following?.find((followedUser) => followedUser.id === followingAttemptUserId);
}
