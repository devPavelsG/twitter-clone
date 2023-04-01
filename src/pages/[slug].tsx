import {type GetStaticProps, type NextPage} from "next";
import superjson from "superjson";
import {ProfileView} from "~/modules/profile/ProfileView";
import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import {PageLayout} from "~/components/PageLayout";
import {appRouter} from "~/server/api/root";
import {prisma} from "~/server/db";

const ProfilePage: NextPage<{username: string}> = ({username}) => {
  return (
    <PageLayout>
      <ProfileView username={username}/>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {prisma, userId: null},
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No slug provided");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({username});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    }
  }
}

export const getStaticPaths = () => {
  return {paths: [], fallback: "blocking"};
}

export default ProfilePage;
