import { useRouter } from "next/router";
import Link from "next/link";
import Art from "@/components/Art";
import styles from "@/styles/Artwork.module.scss";
const Artwork = () => {
  const router = useRouter();
  const { name, id } = router.query;
  return (
    <div className="main">
      <h1>
        {name}が作成した{id}番目の作品
      </h1>
      <Link href="/about">こんにちは</Link>
      <div className={styles.art}>
        <Art />
      </div>
    </div>
  );
};
export default Artwork;
