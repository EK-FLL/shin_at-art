import { useRouter } from "next/router";
import Link from "next/link";
import Art from "@/components/Art";
import styles from "@/styles/Artwork.module.scss";
const Artwork = () => {
  const router = useRouter();
  const { author, id } = router.query;
  const ArtId = `/${id}`;
  return (
    <>
      <h1>{id}</h1>
      <p>作者：{author}</p>
      <div className={styles.art}>
        <Art id={ArtId} />
      </div>
    </>
  );
};
export default Artwork;
