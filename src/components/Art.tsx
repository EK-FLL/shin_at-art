import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/Art.module.scss";
type Prop = {
  id: string;
};
const Art = ({ id }: Prop) => {
  const [comments, setComments] = useState([
    { text: "神奈川から見た富士山", x: 63, y: 40 },
    { text: "波かっこいい", x: 47, y: 10 },
    // 他のコメントを追加
  ]);

  const imageSrc = id; // 画像のパス

  return (
    <>
      <div className={styles.art} style={{ position: "relative" }}>
        <Image className={styles.image} src={imageSrc} alt="アートです" fill />
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
