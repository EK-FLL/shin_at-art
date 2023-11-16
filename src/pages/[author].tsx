import { useRouter } from "next/router";
import Link from "next/link";
const Author = () => {
  const router = useRouter();
  const { author } = router.query;
  return (
    <>
      <h1>{author}のプロフ</h1>
    </>
  );
};
export default Author;