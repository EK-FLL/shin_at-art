import { useRouter } from "next/router";
import Link from "next/link";
import Art from "@/components/Art";
import styles from "@/styles/Artwork.module.scss";
import { db, storage } from "@/components/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { getDownloadURL, ref } from "firebase/storage";
const Artwork = () => {
  const router = useRouter();
  const { author, id } = router.query as { author: string; id: string };
  const [artData, setArtData] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const workData: (string | DocumentData | null)[] = await getArt(
          author,
          id
        );
        setArtData(workData as any);
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
        <Art img={artData && artData[2]} author={author} id={id} />
      </div>
    </>
  );
};
export default Artwork;

const getArt = async (author: string, id: string) => {
  let workData = [];
  const artData = await getDoc(doc(db, "authors", author, "arts", id));
  const authorData = await getDoc(doc(db, "authors", author));
  if (authorData.exists()) {
    workData.push(authorData.data());
  } else {
    workData.push(null);
  }
  if (artData.exists()) {
    workData.push(artData.data());
  } else {
    workData.push(null);
  }
  try {
    const artURL = await getDownloadURL(
      ref(storage, `/authors/${author}/${id}/img.jpg`)
    );
    workData.push(artURL);
  } catch (error) {
    console.error("エラー:", error);
    workData.push(null);
  }
  return workData;
};
