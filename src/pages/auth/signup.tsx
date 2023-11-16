import { auth, provider } from "@/components/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const SignIn = () => {
  const [user] = useAuthState(auth);
  return (
    <>
      {user ? (
        <>
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
  const SignUp = () => {
    signInWithPopup(auth, provider);
  };
  return (
    <button onClick={SignUp}>
      <p>Googleでログイン</p>
    </button>
  );
};
const EmailSignUp = () => {
  const SignUp = () => {};
  return (
    <button onClick={SignUp}>
      <p>Googleでログイン</p>
    </button>
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
      <img src={auth.currentUser?.photoURL} alt="" />
      <p>{auth.currentUser?.displayName}</p>
      <p>{auth.currentUser?.email}</p>
    </>
  );
};
