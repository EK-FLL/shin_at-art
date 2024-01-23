"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Art from "./Art";
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
import Card from "@/app/_globals/Card/Card";
import { Stack, typographyClasses } from "@mui/material";
type Art = {
  id: string;
  name: string;
};
type ArtData = {
  author: DocumentData;
  art: DocumentData;
  artURL: string;
};
const Home = () => {
  const { author, id } = useParams() as { author: string; id: string };
  const [artData, setArtData] = useState<any>({});
  const [arts, setArts] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      let workData: ArtData = {
        author: undefined,
        art: undefined,
        artURL: "",
      };
      const artData = await getDoc(doc(db, "arts", id));
      const authorData = await getDoc(
        doc(db, "authors", artData.data()?.author)
      );
      if (authorData.exists()) {
        workData[author] = authorData.data();
      }
      if (artData.exists()) {
        workData[art] = artData.data();
      }
      const artURL = await getDownloadURL(ref(storage, `/arts/${id}/img.jpg`));
      workData[artURL] = artURL;
      if (
        typeof workData.art === "object" &&
        workData.art !== null &&
        "author" in workData.art &&
        workData.art?.author != author
      ) {
        router.push(`/${workData[1]?.author}/${id}`);
      }
      setArtData(workData);
      setLoading(false);
    };
    const getAuthor = async () => {
      const authorSnap = await getDoc(doc(db, "authors", author));
      const authorData = authorSnap.data();
      if (authorData && typeof authorData !== "string") {
        let arts: Art[] = [];
        Object.entries(authorData.arts).forEach(([key, value]) => {
          arts = [...arts, { id: key, name: value as string }];
        });
        setArts(arts);
        setLoading(false);
      }
    };
    getAuthor();
    fetchData();
  }, [author, id]);
  return (
    <>
      <h1>{artData ? artData.art.name : "Loading..."}</h1>
      <p>作者：{artData ? artData.author.name : "Loading..."}</p>
      <div>
        <Art img={artData && artData.artURL} author={author} id={id} />
      </div>
      <h2>{artData ? artData.author.name : "Loading..."}の作品</h2>
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
