import type {RouterOutputs} from "~/utils/api";
import Image from "next/image";
import dayjs from "dayjs";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export const PostView = (props: PostWithUser) => {
  const {post, author} = props;
  return (
    <div className={"p-4 border-slate-600 border-b flex items-center gap-4 grow"}>
      <Image className={"rounded-full"} src={author.profileImageUrl} width={48} height={48}
             alt={author.username ?? "Profile Picture"}/>
      <div className={"flex flex-col justify-center"}>
        <div className={"flex gap-2"}>
          <span className={"font-bold"}>{`@${author.username}`}</span>
          <span>·</span>
          <span>
            {dayjs(
              post.createdAt
            ).fromNow()}
          </span>
        </div>
        <span className={"font-light"}>{post.content}</span>
      </div>
    </div>
  );
};