import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/Art.module.scss";

const Art = ({ id }) => {
  const [comments, setComments] = useState([
    { text: "コメント1", x: 80, y: 90 },
    { text: "コメント2", x: 50, y: 10 },
    // 他のコメントを追加
  ]);

  const imageSrc = id; // 画像のパス

  return (
    <>
      <div className={styles.size} style={{ position: "relative" }}>
        <Image className={styles.image} src={imageSrc} alt="アートです" fill />
        {comments.map((comment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `calc(${comment.x}% - 20px)`,
              top: `calc(${comment.y}% - 20px)`,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
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
