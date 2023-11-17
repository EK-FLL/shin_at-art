import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth, provider } from "@/components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from "@/styles/Header.module.scss";
const Header = () => {
  return (
    <>
      <div className={styles.main}>
        <h1>プロジェクト</h1>
        <div className={styles.account}>
          <Account />
        </div>
      </div>
    </>
  );
};
export default Header;

const Account = () => {
  const [user] = useAuthState(auth);
  return (
    <>
      {user ? (
        <>
          <UserInfo />
        </>
      ) : (
        <>
          <Link
            href={{
              pathname: "/auth/login",
              query: { path: useRouter().asPath },
            }}
          >
            ログイン
          </Link>
        </>
      )}
    </>
  );
};

const UserInfo = () => {
  return (
    <>
      <Image
        className={styles.icon}
        src={auth.currentUser?.photoURL ?? ""}
        alt=""
        width={45}
        height={45}
      />
    </>
  );
};
