import type {Post, User} from "@prisma/client";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import {api} from "~/utils/api";
import dayjs from "dayjs";
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai";
import {isLikedByUser} from "~/utils/isLikedByUser";
import {useSession} from "@clerk/nextjs";
import {useEffect, useMemo, useState} from "react";
import Linkify from "linkify-react";

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const Filter = require('bad-words'),
// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
filter = new Filter();

dayjs.extend(relativeTime);

export const PostItem = (props: { post: Post & { user: User, likedBy: User[] } }) => {
  const {post} = props;
  const {session} = useSession();

  const [isLiked, setIsLiked] = useState(isLikedByUser(post, session?.user.id));
  const [likedCounter, setLikedCounter] = useState(post.likedBy.length);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const filteredContent = useMemo(() => {
    if (!!filter && !!post.content) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      return (filter.clean(post.content)) as string;
    }
    return "";
  }, [post.content]);

  useEffect(() => {
    setIsLiked(isLikedByUser(post, session?.user.id));
    setLikedCounter(post.likedBy.length);
  }, [post, session?.user.id]);

  const {mutate} = api.posts.like.useMutation();

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
        <span className={"font-light linkHover"}>
            <Linkify>
              {filteredContent}
            </Linkify>
          </span>
        <div className={"py-2 flex gap-2 items-center"}>
          <div>{likedCounter}</div>
          <div onClick={() => {
            if (!!session?.user) {
              setIsLiked(!isLiked);
              setLikedCounter(isLiked ? likedCounter - 1 : likedCounter + 1)
              mutate({
                id: post.id,
              });
            }
          }} className={`${!!session?.user ? "cursor-pointer" : "cursor-not-allowed"}`}>
            {isLiked ? <AiFillHeart/> : <AiOutlineHeart/>}
          </div>
        </div>
      </div>
    </div>
  );
};