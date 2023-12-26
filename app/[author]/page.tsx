"use client";
import { useParams } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/_globals/firebase";
import { useEffect, useState } from "react";
import { type } from "os";
import Link from "next/link";

type Art = {
  id: string;
  name: string;
};
const Home = () => {
  const [arts, setArts] = useState<Art[]>([]);
  const getAuthors = async () => {
    try {
      let artsData: Art[] = [];
      const querySnapshot = await getDocs(
        collection(db, "authors", author, "arts")
      );
      querySnapshot.forEach((doc) => {
        const art: Art = {
          id: doc.id,
          name: (doc.data() as Art).name,
        };
        artsData.push(art);
      });
      setArts(artsData);
    } catch (error) {
      console.error("エラー:", error);
    }
  };
  useEffect(() => {
    getAuthors();
  }, []);
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
      {arts.map((art, index) => (
        <Link key={index} href={`${author}/${art.id}`}>
          {art.name}
          <br />
        </Link>
      ))}
    </>
  );
};
export default Home;
