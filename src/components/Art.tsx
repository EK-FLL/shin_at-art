import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/Art.module.scss";
import { Rnd } from "react-rnd";
import { Button, CssBaseline, Stack, TextField } from "@mui/material";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import theme from "./Var";
import { ThemeProvider } from "@mui/material";
import { set } from "firebase/database";
type Prop = {
  img: string;
  author: string;
  id: string;
};
type Comment = {
  // Define the structure of a comment
  text: string;
  x: number;
  y: number;
  // Add any other properties as needed
};
const Art = ({ img, author, id }: Prop) => {
  const [onDoc, setOnDoc] = useState(0);
  const ArtRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [ArtData, setArtData] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const [postPoint, setPostPoint] = useState({ x: 0, y: 0 });
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    const getComments = async () => {
      try {
        let commentsData: Comment[] = [];
        const querySnapshot = await getDocs(
          collection(db, "authors", author, "arts", id, "comments")
        );
        querySnapshot.forEach((doc) => {
          commentsData.push(doc.data());
          console.log(commentsData);
        });
        setComments(commentsData);
      } catch (error) {
        console.error("エラー:", error);
      }
    };
    getComments();
  }, [author, id, onDoc]);
  const updateSize = () => {
    if (ArtRef.current) {
      const { clientWidth, clientHeight } = ArtRef.current;
      const client = ArtRef.current.getBoundingClientRect();
      setArtData({
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
      Math.max(0, ((d.x - ArtData.left) / ArtData.width) * 100)
    );
    const positionY = Math.min(
      100,
      Math.max(0, ((d.y - ArtData.top) / ArtData.height) * 100)
    );
    console.log("Current position: ", {
      x: positionX,
      y: positionY,
    });
  };
  const handleClick = (event) => {
    updateSize();
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPostPoint({ x: x, y: y });
    console.log("クリックした相対座標: ", { x, y });
  };
  const handleButtonClick = async () => {
    const docRef = await addDoc(
      collection(db, "authors", author, "arts", id, "comments"),
      {
        text: inputValue,
        x: (postPoint.x / ArtData.width) * 100,
        y: (postPoint.y / ArtData.height) * 100,
      }
    );
    setOnDoc(onDoc + 1);
    setInputValue("");
    setPostPoint({ x: 0, y: 0 });
  };

  return (
    <>
      <div className={styles.art} style={{ position: "relative" }}>
        <Image
          onClick={handleClick}
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
        <div
          className={styles.art_comment}
          style={{
            position: "absolute",
            left: postPoint.x,
            top: postPoint.y,
          }}
        >
          <div>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Stack direction="row" spacing={0.5}>
                <TextField
                  id="outlined-basic"
                  label="コメントを入力"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleButtonClick();
                    }
                  }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Button
                  onClick={handleButtonClick}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  投稿
                </Button>
              </Stack>
            </ThemeProvider>
          </div>
        </div>
        {/* <Rnd
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
        /> */}
      </div>
      <p>Width: {ArtData.width}px</p>
      <p>Height: {ArtData.height}px</p>
    </>
  );
};

export default Art;
