import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Art.module.scss";
import { Rnd } from "react-rnd";
import {
  Button,
  CssBaseline,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  getDocs,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/app/_globals/firebase";
import theme from "@/app/_globals/Var";
import { ThemeProvider } from "@mui/material";
import { set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IconContext } from "react-icons";
type Prop = {
  img: string;
  author: string;
  id: string;
};
type Comment = {
  id: string;
  text: string;
  x: number;
  y: number;
  like: number;
};
const Art = ({ img, author, id }: Prop) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user] = useAuthState(auth);
  const ArtRef = useRef<HTMLImageElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [ArtData, setArtData] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const [postPoint, setPostPoint] = useState({ x: 0, y: 0 });
  const [comments, setComments] = useState<Comment[]>([]);
  const [check, setCheck] = useState(true);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const commentsRef = collection(db, "arts", id, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      let commentsData: Comment[] = [];
      let likesData: { [key: string]: boolean } = {};
      snapshot.forEach((document) => {
        commentsData.push({ id: document.id, ...document.data() } as Comment);
        if (user) {
          const likeDoc = doc(
            db,
            "arts",
            id,
            "comments",
            document.id,
            "users",
            user.uid
          );
          getDoc(likeDoc).then((likeSnapshot) => {
            if (likeSnapshot.exists()) {
              likesData[document.id] = likeSnapshot.data().isLike;
            } else {
              likesData[document.id] = false;
            }
          });
        }
      });
      setComments(commentsData);
      setLikes(likesData);
    });
    return () => unsubscribe();
  }, [id, user]);
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
  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    updateSize();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPostPoint({ x: x, y: y });
  };
  const handleButtonClick = async () => {
    await addDoc(collection(db, "arts", id, "comments"), {
      text: inputValue,
      x: (postPoint.x / ArtData.width) * 100,
      y: (postPoint.y / ArtData.height) * 100,
      uid: user?.uid,
      date: serverTimestamp(),
      like: 0,
    });
    setInputValue("");
    setPostPoint({ x: 0, y: 0 });
  };
  const handleChangeChecked = (chk: React.ChangeEvent<HTMLInputElement>) => {
    setCheck(chk.target.checked);
  };
  const editClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget as any);
  };
  const editClose = () => {
    setAnchorEl(null);
  };
  const likeClick = async (c_id: string) => {
    if (user) {
      const commentIndex = comments.findIndex((comment) => comment.id === c_id);
      const newLikeState = !likes[c_id];
      const newLikeCount = newLikeState
        ? comments[commentIndex].like + 1
        : comments[commentIndex].like - 1;

      // Update Firestore
      await updateDoc(doc(db, "arts", id, "comments", c_id), {
        like: newLikeCount,
      });
      await setDoc(doc(db, "arts", id, "comments", c_id, "users", user?.uid), {
        isLike: newLikeState,
      });

      // Update likes state
      setLikes((prevLikes) => ({ ...prevLikes, [c_id]: newLikeState }));

      // Update comments state
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === c_id ? { ...comment, like: newLikeCount } : comment
        )
      );
    }
  };
  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-start"
        spacing={2}
      >
        <FormControlLabel
          control={
            <Switch defaultChecked onChange={(e) => handleChangeChecked(e)} />
          }
          label="コメントを表示"
        />
      </Stack>
      <div className={styles.art} style={{ position: "relative" }}>
        <Image
          onClick={handleClick}
          className={styles.image}
          src={img}
          alt="アートです"
          fill
          ref={ArtRef}
        />
        {check
          ? comments.map((comment, index) => (
              <div
                className={styles.art_comment}
                key={index}
                style={{
                  position: "absolute",
                  left: comment.x + "%",
                  top: comment.y + "%",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1.5}
                >
                  <p>{comment.text}</p>
                  <div
                    className={styles.like}
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => likeClick(comment.id)}
                  >
                    {likes[comment.id] ? (
                      <FaHeart
                        className={styles.heartIcon}
                        style={{ position: "absolute", color: "red" }}
                      />
                    ) : (
                      <FaRegHeart
                        className={styles.heartIcon}
                        style={{ position: "absolute" }}
                      />
                    )}
                    <p
                      style={{ position: "absolute" }}
                      className={styles.likeNum}
                    >
                      {comment.like}
                    </p>
                  </div>
                </Stack>
              </div>
            ))
          : null}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={editClose}
        >
          <MenuItem>
            <ListItemIcon>
              <MdEdit />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        </Menu>
        <div
          className={styles.art_comment}
          style={{
            position: "absolute",
            left: postPoint.x,
            top: postPoint.y,
            minWidth: 170,
          }}
        >
          <div>
            <ThemeProvider theme={theme}>
              <Stack direction="row" spacing={0.5}>
                <TextField
                  id="outlined-textarea"
                  label="コメント"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleButtonClick();
                    }
                  }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="20字以内"
                  multiline
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
