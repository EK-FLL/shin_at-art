import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/Art.module.scss";

const Art = () => {
  const [comments, setComments] = useState([
    { text: "コメント1", x: 100, y: 50 },
    { text: "コメント2", x: 200, y: 100 },
    // 他のコメントを追加
  ]);

  const imageSrc = "/testimg.jpg"; // 画像のパス

  return (
    <>
      <div style={{ position: "relative" }}>
        <Image src={imageSrc} alt="画像" width={800} height={537} />
        {comments.map((comment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: comment.x,
              top: comment.y,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {comment.text}
          </div>
        ))}
      </div>
    </>
  );
};

export default Art;
