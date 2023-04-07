import type {Post, User} from "@prisma/client";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import dayjs from "dayjs";

dayjs.extend(relativeTime);
export const PostItem = (props: {post:  Post & {user: User}}) => {
  const {post} = props;
  return (
    <div className={"p-4 border-slate-600 border-b flex items-center gap-4 grow"}>
      <Link href={`/@${post.user.username}`}>
        <Image
          className={"rounded-full"}
          src={post.user.profileImageUrl ?? ""}
          width={48} height={48}
          alt={post.user.username ?? "Profile Picture"}/>
      </Link>
      <div className={"flex flex-col justify-center"}>
        <div className={"flex gap-2"}>
          <Link href={`/@${post.user.username}`}>
            <span className={"font-bold hover:underline"}>{`@${post.user.username}`}</span>
          </Link>
          <span>·</span>
          <Link href={`/post/${post.id}`}>
            <span>
              {dayjs(
                post.createdAt
              ).fromNow()}
            </span>
          </Link>
        </div>
        <Link href={`/post/${post.id}`}>
          <span className={"font-light"}>{post.content}</span>
        </Link>
      </div>
    </div>
  );
};