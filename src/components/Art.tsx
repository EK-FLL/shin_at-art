import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/Art.module.scss";
import { Rnd } from "react-rnd";
import { TextField } from "@mui/material";
type Prop = {
  img: string;
};
const Art = ({ img }: Prop) => {
  const ArtRef = useRef(null);
  const [ArtSize, setArtSize] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const [comments] = useState([
    { text: "神奈川から見た富士山", x: 64, y: 65 },
    { text: "波かっこいい", x: 47, y: 20 },
  ]);

  const updateSize = () => {
    if (ArtRef.current) {
      const { clientWidth, clientHeight } = ArtRef.current;
      const client = ArtRef.current.getBoundingClientRect();
      setArtSize({
        width: clientWidth,
        height: clientHeight,
        left: client.left,
        top: client.top,
      });
    }
  };
  const handleDrag = (d: any) => {
    updateSize();
    const positionX = Math.min(
      100,
      Math.max(0, ((d.x - ArtSize.left) / ArtSize.width) * 100)
    );
    const positionY = Math.min(
      100,
      Math.max(0, ((d.y - ArtSize.top) / ArtSize.height) * 100)
    );
    console.log("Current position: ", {
      x: positionX,
      y: positionY,
    });
  };

  return (
    <>
      <div className={styles.art} style={{ position: "relative" }}>
        <Image
          className={styles.image}
          src={img}
          alt="アートです"
          fill
          ref={ArtRef}
        />
        {comments.map((comment, index) => (
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
        ))}
        <Rnd
          className={styles.point}
          default={{
            x: 0,
            y: 0,
            width: 40,
            height: 40,
          }}
          enableResizing={false}
          bounds="parent"
          onDrag={handleDrag}
        />
        <TextField
          id="filled-hidden-label-small"
          label="Standard"
          variant="filled"
          size="small"
          style={{
            position: "absolute",
            left: 50 + "%",
            top: 50 + "%",
          }}
        />
      </div>
      <p>Width: {ArtSize.width}px</p>
      <p>Height: {ArtSize.height}px</p>
    </>
  );
};

export default Art;
