import { getDownloadURL, ref } from "firebase/storage";
import Link from "next/link";
import Image from "next/image";
import { storage } from "./firebase";
import { useState, useEffect } from "react";

const Card = ({ name, id }: { name: string; id: string }) => {
  const [artURL, setArtURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtURL = async () => {
      const url = await getDownloadURL(ref(storage, `/arts/${id}/img.jpg`));
      setArtURL(url);
    };

    fetchArtURL();
  }, [id]);
  return (
    <Link href={`/s/${id}`}>
      <div style={{ position: "relative", width: "150px", height: "200px" }}>
        {artURL && (
          <Image src={artURL} alt={name} fill style={{ objectFit: "cover" }} />
        )}
      </div>
      <p>{name}</p>
    </Link>
  );
};
export default Card;
