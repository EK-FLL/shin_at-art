import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Noto_Sans_JP } from "@next/font/google";
const noto = Noto_Sans_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className={noto.className}>
      <Head>
        <title>FLLプロジェクト</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
};
export default App;
