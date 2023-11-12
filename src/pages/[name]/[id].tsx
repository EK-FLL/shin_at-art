import { useRouter } from "next/router";
import Link from "next/link";
import Art from "@/components/Art";
import styles from "@/styles/Artwork.module.scss";
const Artwork = () => {
  const router = useRouter();
  const { name, id } = router.query;
  const ArtId = `/${id}`;
  return (
    <>
      <h1>{id}</h1>
      <p>作者：{name}</p>
      <div className={styles.art}>
        <Art id={ArtId} />
      </div>
    </>
  );
};
export default Artwork;
