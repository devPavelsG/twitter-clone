import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";

import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";

import "~/styles/globals.scss";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps} >
      <Toaster position={"bottom-center"} />
      <Head>
        <title>Twitter Clone - Pāvels Garklāvs</title>
        <meta name="description" content="Twitter Clone - Pāvels Garklāvs" />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
