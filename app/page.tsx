"use client";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./_globals/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

type Author = {
  id: string;
  name: string;
};
const Home = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const getAuthors = async () => {
    try {
      let authorsData: Author[] = [];
      const querySnapshot = await getDocs(collection(db, "authors"));
      querySnapshot.forEach((doc) => {
        const author: Author = {
          id: doc.id,
          name: (doc.data() as Author).name,
        };
        authorsData.push(author);
      });
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
      <h1>Home Next.js</h1>

      {authors.map((author, index) => (
        <Link key={index} href={author.id}>
          {author.name}
          <br />
        </Link>
      ))}
    </>
  );
};
export default Home;
