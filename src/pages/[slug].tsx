import {type GetStaticProps, type NextPage} from "next";
import {ProfileView} from "~/modules/profile/ProfileView";
import {PageLayout} from "~/components/PageLayout";
import {generateSSGHelper} from "~/server/helpers/ssgHelper";

const ProfilePage: NextPage<{username: string}> = ({username}) => {
  return (
    <PageLayout>
      <ProfileView username={username}/>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

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
