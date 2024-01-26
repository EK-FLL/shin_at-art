"use client";
import { auth } from "@/app/_globals/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "@/app/auth/auth.module.scss";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Stack, TextField, ThemeProvider } from "@mui/material";
import theme from "@/app/_globals/Var";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const Home = () => {
  const router = useRouter();

  const handler = (url: string | null) => {
    if (url) {
      router.push(url);
    }
  };
  const searchParams = useSearchParams();
  const path = searchParams.get("path");
  const [user] = useAuthState(auth);

  return (
    <>
      {user ? (
        <>{handler(path)}</>
      ) : (
        <ThemeProvider theme={theme}>
          <div className={styles.size}>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
              className={styles.auth}
            >
              <h2>ログイン</h2>
              <p>現在Googleのみでログイン可能です</p>
              <EmailSignUp />
              <GoogleSignUp />
            </Stack>
          </div>
        </ThemeProvider>
      )}
    </>
  );
};
export default Home;
const EmailSignUp = () => {
  return (
    <>
      <TextField
        id="standard-basic"
        label="メールアドレス"
        variant="standard"
        fullWidth
        disabled
      />
      <TextField
        id="standard-password-input"
        label="パスワード"
        type="password"
        autoComplete="current-password"
        variant="standard"
        fullWidth
        margin="normal"
        disabled
      />
      <Button variant="contained" disabled>
        ログイン
      </Button>
    </>
  );
};
const GoogleSignUp = () => {
  const provider = new GoogleAuthProvider();
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FcGoogle />}
        onClick={() => signInWithRedirect(auth, provider)}
      >
        Googleでログイン
      </Button>
    </>
  );
};
