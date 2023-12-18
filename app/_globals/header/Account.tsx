"use client";
import { Menu, MenuItem, Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/_globals/firebase";
import styles from "@/app/_globals/header/Header.module.scss";
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
              query: { path: usePathname() },
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
export default Account;
