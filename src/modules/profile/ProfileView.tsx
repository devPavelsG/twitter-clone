import {api} from "~/utils/api";
import Image from "next/image";
import Head from "next/head";
import {LoadingSpinner} from "~/components/LoadingSpinner";
import {PostItem} from "~/components/PostItem";

type Props = {
  username: string;
}

const ProfileFeed = (props: { userId: string }) => {
  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  return (
    <div className={"flex flex-col"}>
      {isLoading ?
        <div className={"h-96"}><LoadingSpinner/></div> :
        !!data ? data?.map(({post, author}) => (<PostItem post={post} author={author} key={post.id}/>)) :
          <div className={"h-96 flex justify-center items-center"}>User has not posted anything yet.</div>}
    </div>
  );
};
export const ProfileView = ({username}: Props) => {
  const {data: user} = api.profile.getUserByUsername.useQuery({
    username
  });

  if (!user) return (<>404</>);

  return (
    <div className={"h-full"}>
      <Head>
        <title>@{user.username}</title>
      </Head>
      <div className={"border-b h-32 border-slate-600 flex p-4 items-center gap-4 relative bg-slate-800"}>
        <Image
          className={"rounded-full absolute bottom-0 left-4 -mb-[5rem] border-4 border-black"}
          src={user.profileImageUrl}
          width={150} height={150}
          alt={user.username ?? "Profile Picture"}
        />
      </div>
      <div className={"h-20"}/>
      <div className={"p-4"}>
        <div className={"text-2xl font-bold"}>{user.firstName} {user.lastName}</div>
        <div className={"text-gray-400"}>@{user.username}</div>
      </div>
      <div className={"border-b border-slate-600"}/>
      <ProfileFeed userId={user.id}/>
    </div>
  );
};