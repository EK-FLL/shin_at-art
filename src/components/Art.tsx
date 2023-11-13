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
    // 他のコメントを追加
  ]);

  const imageSrc = id; // 画像のパス

  // const parentRef = useRef(null);
  // const childRef = useRef(null);
  // useEffect(() => {
  //   const parent = parentRef.current;
  //   const child = childRef.current;

  //   const parentRect = parent.getBoundingClientRect();
  //   console.log("これは草:", parentRect);
  //   const childRect = child.getBoundingClientRect();

  //   const relativePosition = {
  //     top: parentRect.top - childRect.top,
  //     left: parentRect.left - childRect.left,
  //   };

  //   console.log("Relative Position:", relativePosition);
  // }, []);

  return (
    <>
      <div className={styles.art} style={{ position: "relative" }}>
        <Image className={styles.image} src={imageSrc} alt="アートです" fill />
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
          style={{ position: "absolute" }}
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
    </>
  );
};

export default Art;
