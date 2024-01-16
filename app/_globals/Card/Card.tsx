import { getDownloadURL, ref } from "firebase/storage";
import Link from "next/link";
import Image from "next/image";
import { storage } from "../firebase";
import { useState, useEffect } from "react";
import styles from "./Card.module.scss";

const Card = ({
  name,
  id,
  author,
}: {
  name: string;
  id: string;
  author: string;
}) => {
  const [artURL, setArtURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtURL = async () => {
      const url = await getDownloadURL(ref(storage, `/arts/${id}/img.jpg`));
      setArtURL(url);
    };

    fetchArtURL();
  }, [id]);
  return (
    <div
      className={styles.card}
      style={{
        position: "relative",
        width: "150px",
        height: "200px",
      }}
    >
      {artURL && (
        <Image src={artURL} alt={name} fill style={{ objectFit: "cover" }} />
      )}
      <Link
        href={`/gallery/${author}/${id}`}
        className={styles.name}
        style={{ position: "absolute" }}
      >
        {name}
      </Link>
    </div>
  );
};
export default Card;
