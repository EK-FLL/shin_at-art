import styles from "@/app/_globals/header/Header.module.scss";
import Stack from "@mui/material/Stack";
import React from "react";
import theme from "@/app/_globals/Var";
import { ThemeProvider } from "@mui/material";
import Account from "@/app/_globals/header/Account";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <Link href="/">
            {/* ロゴをSVGとして追加 */}
            <Image
              src="/logo.svg"
              alt="logo"
              width={100}
              height={100}
              className={styles.logo}
            />
          </Link>
          <div className={styles.account}>
            <Account />
          </div>
        </Stack>
      </ThemeProvider>
    </>
  );
};
export default Header;
