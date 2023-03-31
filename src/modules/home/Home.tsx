import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { CreatePostWizard } from "~/components/CreatePostWizard";
import { PostView } from "~/components/PostView";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export const Home = () => {
  const { data: posts, isLoading } = api.posts.getAll.useQuery();
  const user = useUser();
  return (
    <>
      <Head>
        <title>Twitter Clone - Pāvels Garklāvs</title>
        <meta name="description" content="Twitter Clone - Pāvels Garklāvs" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className="flex min-h-screen justify-center">
        <div className={"border-slate-600 w-full md:max-w-2xl border-x"}>
          <div className={"border-b border-slate-600 flex p-4"}>
            {user.isSignedIn ? <div className={"flex justify-between w-full gap-8 items-center"}>
              <CreatePostWizard />
              <div className={"w-32 border border-red-300 px-6 py-2 rounded-md"}>
                <SignOutButton />
              </div>
            </div> : <div className={"w-32 border px-6 py-2 flex justify-center items-center rounded-md"}><SignInButton /></div>}
          </div>
          {isLoading ? <LoadingSpinner size={64} /> : <div className={"flex flex-col"}>
            {posts?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>}
        </div>
      </main>
    </>
  );
};