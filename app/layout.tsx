import "@/app/_globals/style.scss";
import type { Metadata } from "next";
import Header from "@/app/_globals/header/Header";
import { Noto_Sans_JP } from "next/font/google";
const noto = Noto_Sans_JP({
  weight: ["500", "700", "900"],
  preload: false,
});
export const metadata: Metadata = {
  title: "at Art",
  description: "アッと驚く鑑賞を",
  robots: {
    index: false,
  },
};
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body className={noto.className}>
        <Header />
        {children}
      </body>
    </html>
  );
};
export default RootLayout;
