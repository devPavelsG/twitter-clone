import {type User} from "@prisma/client";
import {api} from "~/utils/api";
import Image from "next/image";
import Head from "next/head";
import {LoadingSpinner} from "~/components/LoadingSpinner";
import {PostItem} from "~/components/PostItem";
import {useSession} from "@clerk/nextjs";
import {isFollowingUser} from "~/utils/isFollowingUser";
import {useEffect, useState} from "react";

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
        !!data ? data?.map((post) => (<PostItem post={post} key={post.id}/>)) :
          <div className={"h-96 flex justify-center items-center"}>User has not posted anything yet.</div>}
    </div>
  );
};
export const ProfileView = ({username}: Props) => {
  const {session} = useSession();
  const {mutate: getUserById} = api.profile.getUserByIdOnEvent.useMutation();
  const {data: user} = api.profile.getUserByUsername.useQuery({
    username
  });

  const [sessionUser, setSessionUser] = useState<User & { followedBy: User[]; following: User[]; }>();
  const [isFollowing, setIsFollowing] = useState(isFollowingUser(sessionUser?.following, user?.id));
  const [followersCount, setFollowersCount] = useState(user?.followedBy.length ?? 0);
  const [followingCount, setFollowingCount] = useState(user?.following.length ?? 0);

  useEffect(() => {
    if (!!user) {
      setFollowersCount(user?.followedBy.length ?? 0);
      setFollowingCount(user?.following.length ?? 0);
    }
  }, [user]);

  useEffect(() => {
    if (!!session?.user.id) {
      getUserById({id: session?.user.id}, {
        onSuccess: (data) => {
          setSessionUser(data);
          setIsFollowing(isFollowingUser(data?.following, user?.id));
        }
      });
    }
  }, [getUserById, session?.user, user?.id]);

  const {mutate: followUser} = api.profile.followUser.useMutation();

  if (!user) return (<>404</>);

  return (
    <div className={"h-full"}>
      <Head>
        <title>@{user.username}</title>
      </Head>
      <div className={"border-b h-32 border-slate-600 flex p-4 items-center gap-4 relative bg-slate-800"}>
        <Image
          className={"rounded-full absolute bottom-0 left-4 -mb-[5rem] border-4 border-black"}
          src={user.profileImageUrl ?? ""}
          width={150} height={150}
          alt={user.username ?? "Profile Picture"}
        />
      </div>
      <div className={"h-20"}/>
      <div className={"p-4"}>
        <div className={"w-full flex justify-between"}>
          <div className={"text-2xl font-bold"}>{user.firstName} {user.lastName}</div>
          {
            session?.user.id !== user.id &&
              <button className={`${!!session?.user ? "cursor-pointer" : "cursor-not-allowed"} border px-6 py-2 rounded-md`} onClick={
                () => {
                  if (!!session?.user) {
                    setIsFollowing(!isFollowing);
                    setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
                    followUser({
                      id: user.id
                    });
                  }
                }}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
          }
        </div>
        <div className={"text-gray-400"}>@{user.username}</div>
        <div className={"flex items-center gap-4 text-sm"}>
          <div>{followingCount} <span className={"text-gray-400"}>Following</span></div>
          <div>{followersCount} <span className={"text-gray-400"}>Followers</span></div>
        </div>
      </div>
      <div className={"border-b border-slate-600"}/>
      <ProfileFeed userId={user.id}/>
    </div>
  );
};