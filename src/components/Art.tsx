import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/Art.module.scss";
import { Rnd } from "react-rnd";
type Prop = {
  id: string;
};
const Art = ({ id }: Prop) => {
  const [comments, setComments] = useState([
    { text: "神奈川から見た富士山", x: 64, y: 65 },
    { text: "波かっこいい", x: 47, y: 10 },
  ]);

  const updateSize = () => {
    if (ArtRef.current) {
      const { clientWidth, clientHeight } = ArtRef.current;
      setArtSize({ width: clientWidth, height: clientHeight });
    }
  };

  const imageSrc = id; // 画像のパス

  const handleDrag = (d: any) => {
    updateSize();
    console.log("Current position: ", { x: d.x, y: d.y });
  };

  const ArtRef = useRef(null);
  const [ArtSize, setArtSize] = useState({ width: 0, height: 0 });



  return (
    <>
      <div className={styles.art} style={{ position: "relative" }}>
        <Image
          className={styles.image}
          src={imageSrc}
          alt="アートです"
          fill
          ref={ArtRef}
        />
        <Rnd
          className={styles.point}
          default={{
            x: 0,
            y: 0,
            width: 60,
            height: 60,
          }}
          enableResizing={false}
          bounds="parent"
          onDrag={handleDrag}
          style={{
            position: "absolute",
          }}
        />
        {comments.map((comment, index) => (
          <>
            <div
              className={styles.art_comment}
              key={index}
              style={{
                position: "absolute",
                left: comment.x + "%",
                top: comment.y + "%",
              }}
            >
              {comment.text}
            </div>
          </>
        ))}
      </div>
      <p>Width: {ArtSize.width}px</p>
      <p>Height: {ArtSize.height}px</p>
    </>
  );
};

export default Art;
