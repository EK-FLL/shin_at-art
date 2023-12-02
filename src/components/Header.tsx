import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "@/components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "@/styles/Header.module.scss";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import React from "react";
import theme from "./Var";
import { ThemeProvider } from "@mui/material";

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
          <h1>プロジェクト</h1>
          <div className={styles.account}>
            <Account />
          </div>
        </Stack>
      </ThemeProvider>
    </>
  );
};
export default Header;

const Account = () => {
  const [user] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget as any);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {user ? (
        <>
          <div onClick={handleClick}>
            <UserInfo />
          </div>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>マイページ</MenuItem>
            <MenuItem onClick={handleClose}>設定</MenuItem>
            <MenuItem onClick={() => auth.signOut()}>ログアウト</MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Link
            href={{
              pathname: "/auth/login",
              query: { path: useRouter().asPath },
            }}
          >
            <Button variant="contained" color="primary">
              ログイン
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

const UserInfo = () => {
  return (
    <div className={styles.iconBack}>
      <Image
        className={styles.icon}
        src={auth.currentUser?.photoURL ?? ""}
        alt=""
        width={45}
        height={45}
      />
    </div>
  );
};
