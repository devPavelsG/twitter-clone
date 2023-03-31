import {api} from "~/utils/api";
import Head from "next/head";

type Props = {
  username: string;
}
export const ProfileView = ({username}: Props) => {
  const {data} = api.profile.getUserByUsername.useQuery({
    username
  });

  if (!data) return (<>404</>);

  console.log(username);

  return (
    <div>
      <Head>
        <title>@{data.username}</title>
      </Head>
      <div>{data.username}</div>
    </div>
  );
};