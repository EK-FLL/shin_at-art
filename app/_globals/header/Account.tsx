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
  const pathname = usePathname();
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
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
              query: { path: pathname },
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
