"use client";
import { useParams } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/_globals/firebase";
import { useEffect, useState } from "react";
import { type } from "os";
const getAuthor = async (author: string) => {
  const artRef = collection(db, "artworks", author, "arts");
  const artSnap = await getDocs(artRef);
  console.log(artSnap);
  artSnap.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
  const authorRef = doc(db, "authors", author);
  const authorSnap = await getDoc(authorRef);
  if (authorSnap.exists()) {
    return authorSnap.data();
  } else {
    return "データが見つかりません。";
  }
};
const Author = () => {
  const { author } = useParams() as { author: string };
  const [authorName, setAuthorName] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorData = await getAuthor(author);
        console.log(authorData);
        if (typeof authorData !== "string") {
          setAuthorName(authorData?.name || "");
        }
      } catch (error) {
        console.error("エラー:", error);
      }
    };

    fetchData();
  }, [author]);
  return (
    <>
      <h1>{authorName}のプロフ</h1>
    </>
  );
};
export default Author;
