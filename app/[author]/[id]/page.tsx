"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Art from "@/app/[author]/[id]/Art";
import { db, storage } from "@/app/_globals/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { getDownloadURL, ref } from "firebase/storage";
const Home = () => {
  const { author, id } = useParams() as { author: string; id: string };
  const [artData, setArtData] = useState<any>();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let workData = [];
        const artData = await getDoc(doc(db, "arts", id));
        const authorData = await getDoc(
          doc(db, "authors", artData.data()?.author)
        );

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
            ref(storage, `/arts/${id}/img.jpg`)
          );
          workData.push(artURL);
        } catch (error) {
          console.error("エラー:", error);
          workData.push(null);
        }
        if (
          typeof workData[1] === "object" &&
          workData[1] !== null &&
          "author" in workData[1] &&
          workData[1]?.author != author
        ) {
          router.push(`/${workData[1]?.author}/${id}`);
        }
        setArtData(workData);
      } catch (error) {
        console.error("エラー:", error);
      }
    };

    fetchData();
  }, [author, id]);
  return (
    <>
      <h1>{artData ? artData[1].name : "Loading..."}</h1>
      <p>作者：{artData ? artData[0].name : "Loading..."}</p>
      <div>
        <Art img={artData && artData[2]} author={author} id={id} />
      </div>
    </>
  );
};
export default Home;
