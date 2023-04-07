import type {Post, User} from "@prisma/client";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import {api} from "~/utils/api";
import dayjs from "dayjs";
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai";
import {isLikedByUser} from "~/utils/isLikedByUser";
import {useSession} from "@clerk/nextjs";
import {useEffect, useState} from "react";

dayjs.extend(relativeTime);
export const PostItem = (props: { post: Post & { user: User, likedBy: User[] } }) => {
  const {post} = props;
  const {session} = useSession();

  const [isLiked, setIsLiked] = useState(isLikedByUser(post, session?.user.id));

  useEffect(() => {
    setIsLiked(isLikedByUser(post, session?.user.id));
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
        <Link href={`/post/${post.id}`}>
          <span className={"font-light"}>{post.content}</span>
        </Link>
        <div className={"py-2 flex gap-2 items-center"}>
          <div>{post.likedBy.length}</div>
          <div onClick={() => {
            if (!!session?.user) {
              setIsLiked(!isLiked);
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