import { useRouter } from "next/router";
import Link from "next/link";
import Art from "@/components/artwork";
const Artwork = () => {
  const router = useRouter();
  const { name, id } = router.query;
  return (
    <>
      <h1>
        {name}が作成した{id}番目の作品
      </h1>
      <Link href="/about">こんにちは</Link>
      <Art></Art>
    </>
  );
};
export default Artwork;
