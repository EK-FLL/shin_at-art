import React, { useState, useRef, useEffect, use } from "react";
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
  Tab,
  Tabs,
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
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/app/_globals/firebase";
import theme from "@/app/_globals/Var";
import { ThemeProvider } from "@mui/material";
import { set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { IconContext } from "react-icons";
type Prop = {
  img: string;
  author: string;
  id: string;
};
type Comment = {
  id: string;
  score: number;
  text: string;
  x: number;
  y: number;
  like: number;
  uid: string;
};
type CommentPosition = {
  id: string | number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
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
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [commentSizes, setCommentSizes] = useState<{ [key: string]: DOMRect }>(
    {}
  );
  const [commentState, setCommentState] = useState(0);
  const handleComment = (event: React.SyntheticEvent, newValue: number) => {
    setCommentState(newValue);
  };
  useEffect(() => {
    const commentsRef = collection(db, "arts", id, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      let commentsData: Comment[] = [];
      let likesData: { [key: string]: boolean } = {};
      snapshot.forEach((document) => {
        const diffTime =
          new Date().getTime() - document.data().date.toDate().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const score =
          500 / (diffDays + 10) +
          5 * Math.cos(5 * diffDays) +
          5 +
          4 * document.data().like;
        commentsData.push({
          id: document.id,
          score: score,
          ...document.data(),
        } as Comment);
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
      commentsData.sort((a, b) => b.score - a.score);
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

  //ドラッグできる要素
  // const handleDrag = (d: any) => {
  //   updateSize();
  //   const positionX = Math.min(
  //     100,
  //     Math.max(0, ((d.x - ArtData.left) / ArtData.width) * 100)
  //   );
  //   const positionY = Math.min(
  //     100,
  //     Math.max(0, ((d.y - ArtData.top) / ArtData.height) * 100)
  //   );
  //   console.log("Current position: ", {
  //     x: positionX,
  //     y: positionY,
  //   });
  // };

  //コメント投稿
  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
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

  //自分のコメントの編集
  const editClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event);
    setAnchorEl(event.currentTarget as any);
  };
  const editClose = () => {
    setAnchorEl(null);
  };

  //いいね
  const likeClick = async (c_id: string) => {
    if (user) {
      const commentIndex = comments.findIndex((comment) => comment.id === c_id);
      const newLikeState = !likes[c_id];
      const newLikeCount = newLikeState
        ? comments[commentIndex].like + 1
        : comments[commentIndex].like - 1;

      await updateDoc(doc(db, "arts", id, "comments", c_id), {
        like: newLikeCount,
      });
      await setDoc(doc(db, "arts", id, "comments", c_id, "users", user?.uid), {
        isLike: newLikeState,
      });

      setLikes((prevLikes) => ({ ...prevLikes, [c_id]: newLikeState }));

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === c_id ? { ...comment, like: newLikeCount } : comment
        )
      );
    }
  };

  //コメントサイズ
  const commentRefs = comments.reduce((acc, comment) => {
    acc[comment.id] = React.createRef<HTMLDivElement>();
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLDivElement> });

  const updateCommentSizes = () => {
    const newCommentSizes = Object.keys(commentRefs).reduce((acc, id) => {
      const ref = commentRefs[id];
      if (ref.current) {
        acc[id] = ref.current.getBoundingClientRect();
      }
      return acc;
    }, {} as { [key: string]: DOMRect });
    setCommentSizes(newCommentSizes);
  };

  const deleteClick = async (c_text: string, c_id: string) => {
    if (confirm(`コメント"${c_text}"を削除しますか？`)) {
      await deleteDoc(doc(db, "arts", id, "comments", c_id));
    }
  };

  useEffect(() => {
    updateCommentSizes();
  }, [comments]);
  useEffect(() => {
    const current = ArtRef.current;
    if (current) {
      const resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(current);

      return () => {
        if (current) {
          resizeObserver.unobserve(current);
        }
      };
    }
  }, [ArtRef]);
  const radiusDefault = "20px";
  let commentPositions: CommentPosition[] = [];
  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-start"
        spacing={2}
      >
        <Tabs
          onChange={handleComment}
          value={commentState}
          aria-label="Tabs where selection follows focus"
          selectionFollowsFocus
        >
          <Tab label="おすすめ" />
          <Tab label="すべて" />
          <Tab label="非表示" />
        </Tabs>
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
        {comments.map((comment, index) => {
          let commentStyle: React.CSSProperties = {
            position: "absolute",
            left: comment.x + "%",
            top: comment.y + "%",
            transform: "",
            borderTopLeftRadius: radiusDefault,
            borderTopRightRadius: radiusDefault,
            borderBottomLeftRadius: radiusDefault,
            borderBottomRightRadius: radiusDefault,
            whiteSpace: "nowrap",
            opacity: 1,
          };
          if (commentSizes[comment.id]) {
            const setPoint = (commentData: {
              x: number;
              id: string | number;
              y: number;
            }) => {
              if (
                ArtData.width * (commentData.x / 100) +
                  commentSizes[commentData.id].width <
                ArtData.width
              ) {
                if (
                  ArtData.height * (commentData.y / 100) >
                  commentSizes[commentData.id].height
                ) {
                  commentStyle.borderBottomLeftRadius = "5px";
                  commentStyle.transform = "translate(0,-100%)";
                  const commentPosition = {
                    id: commentData.id,
                    x1: ArtData.width * (commentData.x / 100),
                    x2:
                      ArtData.width * (commentData.x / 100) +
                      commentSizes[commentData.id].width,
                    y1:
                      ArtData.height * (commentData.y / 100) -
                      commentSizes[commentData.id].height,
                    y2: ArtData.height * (commentData.y / 100),
                  };
                  return commentPosition;
                } else {
                  commentStyle.borderTopLeftRadius = "5px";
                  commentStyle.transform = "translate(0,0)";
                  const commentPosition = {
                    id: commentData.id,
                    x1: ArtData.width * (commentData.x / 100),
                    x2:
                      ArtData.width * (commentData.x / 100) +
                      commentSizes[commentData.id].width,
                    y1: ArtData.height * (commentData.y / 100),
                    y2:
                      ArtData.height * (commentData.y / 100) +
                      commentSizes[commentData.id].height,
                  };
                  return commentPosition;
                }
              } else {
                if (
                  ArtData.height * (commentData.y / 100) >
                  commentSizes[commentData.id].height
                ) {
                  commentStyle.borderBottomRightRadius = "5px";
                  commentStyle.transform = "translate(-100%,-100%)";
                  const commentPosition = {
                    id: commentData.id,
                    x1:
                      ArtData.width * (commentData.x / 100) -
                      commentSizes[commentData.id].width,
                    x2: ArtData.width * (commentData.x / 100),
                    y1:
                      ArtData.height * (commentData.y / 100) -
                      commentSizes[commentData.id].height,
                    y2: ArtData.height * (commentData.y / 100),
                  };
                  return commentPosition;
                } else {
                  commentStyle.borderTopRightRadius = "5px";
                  commentStyle.transform = "translate(-100%,0)";
                  const commentPosition = {
                    id: commentData.id,
                    x1:
                      ArtData.width * (commentData.x / 100) -
                      commentSizes[commentData.id].width,
                    x2: ArtData.width * (commentData.x / 100),
                    y1: ArtData.height * (commentData.y / 100),
                    y2:
                      ArtData.height * (commentData.y / 100) +
                      commentSizes[commentData.id].height,
                  };
                  return commentPosition;
                }
              }
            };
            const commentPosition = setPoint(comment);
            const safeArea = {
              x: ArtData.width * 0.02,
              y: ArtData.height * 0.05,
            };
            const isOverlapping = commentPositions.some((position) => {
              return (
                (position.x1 + safeArea.x < commentPosition.x1 &&
                  position.x2 - safeArea.x > commentPosition.x1) ||
                (position.x1 + safeArea.x < commentPosition.x2 &&
                  position.x2 - safeArea.x > commentPosition.x2) ||
                (position.y1 + safeArea.y < commentPosition.y1 &&
                  position.y2 - safeArea.y > commentPosition.y1) ||
                (position.y1 + safeArea.y < commentPosition.y2 &&
                  position.y2 - safeArea.y > commentPosition.y2)
              );
            });
            if (commentState === 0) {
              if (isOverlapping) {
                console.log("重なっています");
                // コメントIDから使用座標をcommentPositionsから削除する
                // commentPositions = commentPositions.filter(
                //   (position) => position.id !== comment.id
                // );
                commentStyle.opacity = 0;
              } else {
                commentPositions.push(setPoint(comment));
                commentStyle.opacity = 1;
              }
            } else if (commentState === 1) {
              commentStyle.opacity = 1;
            } else {
              commentStyle.opacity = 0;
            }
          }
          return (
            <div
              ref={commentRefs[comment.id]}
              className={styles.art_comment}
              key={index}
              style={commentStyle}
              onClick={() => console.log(commentSizes[comment.id])}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1.5}
              >
                <p>{comment.text}</p>
                {comment.uid == user?.uid ? (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => deleteClick(comment.text, comment.id)}
                  >
                    <MdDeleteForever />
                  </div>
                ) : (
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
                )}
              </Stack>
            </div>
          );
        })}
        {/* <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={editClose}
          >
            <MenuItem>
              <ListItemIcon>
                <MdDeleteForever />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu> */}
        <div
          className={`${styles.input} ${styles.art_comment}`}
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
                    if (
                      e.key === "Enter" &&
                      inputValue.length >= 1 &&
                      inputValue.length <= 20
                    ) {
                      handleButtonClick();
                    }
                  }}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  placeholder="20字以内"
                  multiline
                  size="small"
                />
                <Button
                  onClick={handleButtonClick}
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={
                    !(inputValue.length >= 1 && inputValue.length <= 20)
                  }
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
