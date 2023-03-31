import Head from "next/head";


type Props = {
  id: string;
}
export const PostView = ({id}: Props) => {
  return (
    <>
      <Head>
        <title>Post View</title>
      </Head>
      <main className="flex min-h-screen justify-center">
        <div>test</div>
      </main>
    </>
  );
};