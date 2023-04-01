import {type GetStaticProps, type NextPage} from "next";
import {PageLayout} from "~/components/PageLayout";
import {generateSSGHelper} from "~/server/helpers/ssgHelper";
import {PostView} from "~/modules/post/PostView";

const PostPage: NextPage<{id: string}> = ({id}) => {
  return (
    <PageLayout>
      <PostView id={id}/>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("No id provided");

  await ssg.posts.getById.prefetch({id});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    }
  }
}

export const getStaticPaths = () => {
  return {paths: [], fallback: "blocking"};
}

export default PostPage;
