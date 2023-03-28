import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: posts } = api.post.getAll.useQuery();

  const user = useUser();

  return (
    <>
      <Head>
        <title>Twitter Clone - Pāvels Garklāvs</title>
        <meta name="description" content="Twitter Clone - Pāvels Garklāvs" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <main className="flex min-h-screen text-white flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {user.isSignedIn ? <SignOutButton /> : <SignInButton />}
        {posts?.map((post) => (<div key={post.id}>{post.content}</div>))}
      </main>
    </>
  );
};

export default Home;
