"use client";
import { useParams } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/_globals/firebase";
import { useEffect, useState } from "react";
import { type } from "os";
import Link from "next/link";
import { set } from "firebase/database";
import Card from "@/app/_globals/Card/Card";
import { Stack } from "@mui/material";

type Art = {
  id: string;
  name: string;
};
const Home = () => {
  const [arts, setArts] = useState<Art[]>([]);
  const getAuthor = async (author: string) => {
    const authorSnap = await getDoc(doc(db, "authors", author));
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
      const authorData = await getAuthor(author);
      if (typeof authorData !== "string") {
        let arts: Art[] = [];
        Object.entries(authorData.arts).forEach(([key, value]) => {
          arts = [...arts, { id: key, name: value as string }];
        });
        setArts(arts);
        setAuthorName(authorData?.name || "");
      }
    };

    fetchData();
  }, [author]);
  return (
    <>
      <h1>{authorName}のプロフ</h1>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        flexWrap="wrap"
      >
        {arts.map((art, index) => (
          <Card key={index} name={art.name} id={art.id} author={author} />
        ))}
      </Stack>
    </>
  );
};
export default Home;
