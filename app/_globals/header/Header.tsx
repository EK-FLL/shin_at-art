import styles from "@/app/_globals/header/Header.module.scss";
import Stack from "@mui/material/Stack";
import React from "react";
import theme from "@/app/_globals/Var";
import { ThemeProvider } from "@mui/material";
import Account from "@/app/_globals/header/Account";

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
          <h2>at Art</h2>
          <div className={styles.account}>
            <Account />
          </div>
        </Stack>
      </ThemeProvider>
    </>
  );
};
export default Header;
