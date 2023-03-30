import Head from "next/head";
import {SignInButton, SignOutButton, useUser} from "@clerk/nextjs";
import {api} from "~/utils/api";
import {CreatePostWizard} from "~/components/CreatePostWizard";
import {PostView} from "~/components/PostView";

export const Home = () => {
  const {data: posts} = api.posts.getAll.useQuery();
  const user = useUser();
  return (
    <>
      <Head>
        <title>Twitter Clone - Pāvels Garklāvs</title>
        <meta name="description" content="Twitter Clone - Pāvels Garklāvs"/>
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className="flex h-screen justify-center">
        <div className={"border-slate-600 w-full md:max-w-2xl border-x"}>
          <div className={"border-b border-slate-600 flex p-4"}>
            {user.isSignedIn ? <div className={"flex justify-between w-full gap-8 items-start"}>
              <CreatePostWizard/>
              <div className={"w-24"}>
                <SignOutButton/>
              </div>
            </div> : <SignInButton/>}
          </div>
          <div className={"flex flex-col"}>
            {posts?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id}/>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};