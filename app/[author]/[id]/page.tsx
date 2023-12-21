"use client";
import { useParams } from "next/navigation";
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
      <div>
        <Art img={artData && artData[2]} author={author} id={id} />
      </div>
    </>
  );
};
export default Home;

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
