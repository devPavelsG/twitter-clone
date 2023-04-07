import {api} from "~/utils/api";
import Head from "next/head";
import {PostItem} from "~/components/PostItem";

type Props = {
  id: string;
}
export const PostView = ({id}: Props) => {
  const {data} = api.posts.getById.useQuery({
    id
  });

  if (!data) return (<>404</>);

  return (
    <div>
      <Head>
        <title>{data.content.slice(0, 12)}{data.content.length > 12 ? "..." : ""} - @{data.user.username}</title>
      </Head>
      <PostItem post={data} />
    </div>
  );
};