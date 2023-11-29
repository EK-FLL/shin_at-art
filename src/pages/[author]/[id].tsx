import { useRouter } from "next/router";
import Link from "next/link";
import Art from "@/components/Art";
import styles from "@/styles/Artwork.module.scss";
import { db, storage } from "@/components/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getDownloadURL, ref } from "firebase/storage";
const Artwork = () => {
  const router = useRouter();
  const { author, id } = router.query;
  const [artData, setArtData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const workData = await getArt(author, id);
        setArtData(workData);
      } catch (error) {
        console.error("エラー:", error);
      }
    };

    fetchData();
  }, [author, id]);
  return (
    <>
      <h1>{artData && artData[1].name}</h1>
      <p>作者：{artData && artData[0].name}</p>
      <div className={styles.art}>
        <Art img={artData && artData[2]} />
      </div>
    </>
  );
};
export default Artwork;

const getArt = async (author: string, id: string) => {
  try {
    const artData = await getDoc(doc(db, "authors", author, "arts", id));
    const authorData = await getDoc(doc(db, "authors", author));
    const artURL = await getDownloadURL(
      ref(storage, `/authors/${author}/${id}/img.jpg`)
    );
    if (artData.exists()) {
      return [authorData.data(), artData.data(), artURL];
    } else {
      return "データが見つかりません。";
    }
  } catch (error) {
    console.error("エラー:", error);
    return ["エラー", "エラー", "/load.jpg"];
  }
};
