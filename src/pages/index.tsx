import { type NextPage } from "next";
import {Home} from "~/modules/home/Home";
import {PageLayout} from "~/components/PageLayout";

const HomePage: NextPage = () => {
  return (
    <PageLayout>
      <Home/>
    </PageLayout>
  );
};

export default HomePage;
