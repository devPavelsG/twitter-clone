import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps} >
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
