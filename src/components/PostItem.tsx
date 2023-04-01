import type {RouterOutputs} from "~/utils/api";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import dayjs from "dayjs";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

dayjs.extend(relativeTime);
export const PostItem = (props: PostWithUser) => {
  const {post, author} = props;
  return (
    <div className={"p-4 border-slate-600 border-b flex items-center gap-4 grow"}>
      <Link href={`/@${author.username}`}>
        <Image
          className={"rounded-full"}
          src={author.profileImageUrl}
          width={48} height={48}
          alt={author.username ?? "Profile Picture"}/>
      </Link>
      <div className={"flex flex-col justify-center"}>
        <div className={"flex gap-2"}>
          <Link href={`/@${author.username}`}>
            <span className={"font-bold hover:underline"}>{`@${author.username}`}</span>
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