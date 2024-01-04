"use client";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./_globals/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "./_globals/Card";
import { set } from "firebase/database";
import { Stack } from "@mui/material";

type Author = {
  id: string;
  name: string;
};
type Arts = {
  id: string;
  name: string;
};
const Home = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [arts, setArts] = useState<Arts[]>([]);
  const getAuthors = async () => {
    try {
      let authorsData: Author[] = [];
      let artsData: Arts[] = [];
      const querySnapshot = await getDocs(collection(db, "authors"));
      querySnapshot.forEach((doc) => {
        const author: Author = {
          id: doc.id,
          name: (doc.data() as Author).name,
        };
        Object.entries(doc.data().arts).forEach(([key, value]) => {
          artsData = [...artsData, { id: key, name: value as string }];
        });
        authorsData.push(author);
      });
      setArts(artsData);
      setAuthors(authorsData);
    } catch (error) {
      console.error("エラー:", error);
    }
  };
  useEffect(() => {
    getAuthors();
  }, []);
  return (
    <>
      <h1>トップページてすと</h1>

      {authors.map((author, index) => (
        <Link key={index} href={author.id}>
          {author.name}
          <br />
        </Link>
      ))}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={2}
      >
        {arts.map((art, index) => (
          <Card key={index} name={art.name} id={art.id} />
        ))}
      </Stack>
    </>
  );
};
export default Home;
