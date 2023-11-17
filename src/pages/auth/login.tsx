import { auth } from "@/components/firebase";
import { useSignInWithGoogle, useAuthState } from "react-firebase-hooks/auth";
import styles from "@/styles/login.module.scss";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SignIn = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const path = searchParams.get("path");
  const [user] = useAuthState(auth);

  return (
    <>
      {user ? (
        <>
          {router.replace(path)}
          <UserInfo />
          <SignOut />
        </>
      ) : (
        <GoogleSignUp />
      )}
    </>
  );
};
export default SignIn;

const GoogleSignUp = () => {
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  return (
    <div onClick={() => signInWithGoogle()} className={styles.service}>
      <FcGoogle />
    </div>
  );
};
const SignOut = () => {
  return (
    <button onClick={() => auth.signOut()}>
      <p>ログアウト</p>
    </button>
  );
};
const UserInfo = () => {
  return (
    <>
      <p>{auth.currentUser?.displayName}</p>
      <p>{auth.currentUser?.email}</p>
    </>
  );
};
