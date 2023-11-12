import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Meta } from "@/components/Meta";
import { Noto_Sans_JP } from "next/font/google";
const noto = Noto_Sans_JP({
  weight: ["500", "700", "900"],
  preload: false,
});
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className={noto.className}>
      <Meta />
      <div className="main">
        <Component {...pageProps} />
      </div>
    </div>
  );
};
export default App;
