"use client";
import { auth } from "@/app/_globals/firebase";
import { useSignInWithGoogle, useAuthState } from "react-firebase-hooks/auth";
import styles from "@/app/auth/auth.module.scss";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

  return <>{user ? <>{handler(path)}</> : <GoogleSignUp />}</>;
};
export default Home;

const GoogleSignUp = () => {
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  return (
    <div onClick={() => signInWithGoogle()} className={styles.service}>
      <FcGoogle />
    </div>
  );
};
