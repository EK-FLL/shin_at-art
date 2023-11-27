import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/firebase";
import { useEffect, useState } from "react";
const getAuthor = async (id) => {
  const docRef = doc(db, "artworks", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return "データが見つかりません。";
  }
};
const Author = () => {
  const router = useRouter();
  const { author } = router.query;
  const [authorName, setAuthorName] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorData = await getAuthor(author);
        setAuthorName(authorData.name);
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
