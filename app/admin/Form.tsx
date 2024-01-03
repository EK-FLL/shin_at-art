"use client";
import { auth, db, storage } from "@/app/_globals/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { randomBytes } from "crypto";
import { SetStateAction, useEffect, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, uploadBytes } from "firebase/storage";

const Form = () => {
  const [user] = useAuthState(auth);
  return (
    <>
      <p>{user?.uid || "test"}</p>
      <Author />
      <Art />
    </>
  );
};
export default Form;
const Author = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Author>();
  const onSubmit: SubmitHandler<Author> = (data) => {
    authorRegister(data.name, data.id);
    reset();
  };
  type Author = {
    name: string;
    id: string;
  };
  const authorRegister = async (authorName: string, authorId: string) => {
    await setDoc(doc(db, "authors", authorId), {
      name: authorName,
      arts: [],
    });
  };
  return (
    <>
      <h3>作者登録</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          <TextField
            id="standard-basic"
            label="作者名"
            variant="standard"
            {...register("name", { required: true })}
          />
          <TextField
            id="standard-basic"
            label="作者ID"
            variant="standard"
            {...register("id", { required: true })}
          />
          <Button variant="contained" color="primary" type="submit">
            作者
          </Button>
        </Stack>
      </form>
    </>
  );
};
type Art = {
  a_id: string;
  name: string;
  id: string;
  image: FileList;
  authorId: string;
};
type Authors = {
  id: string;
  name: string;
};
const Art = () => {
  const [artId, setArtId] = useState<string>("");
  const [authors, setAuthors] = useState<Authors[]>([]);
  useEffect(() => {
    getAuthors();
  }, []);
  const getAuthors = async () => {
    try {
      let authorsData: Authors[] = [];
      const querySnapshot = await getDocs(collection(db, "authors"));
      querySnapshot.forEach((doc) => {
        const author = {
          id: doc.id,
          name: doc.data().name,
        };
        authorsData.push(author);
      });
      setAuthors(authorsData);
    } catch (error) {
      console.error("エラー:", error);
    }
  };
  const RandomId = (length: number) => {
    const validUrlCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const validUrlCharactersLength = validUrlCharacters.length;

    let randomString = "";
    let randomBytesBuffer: Buffer;

    randomBytesBuffer = randomBytes(length);
    for (let i = 0; i < length; i++) {
      const randomIndex =
        randomBytesBuffer.readUInt8(i) % validUrlCharactersLength;
      randomString += validUrlCharacters.charAt(randomIndex);
    }
    setArtId(randomString);
  };
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<Art>();

  const onSubmit: SubmitHandler<Art> = (data) => {
    artRegister(data.a_id, data.name, data.id, data.image);
    reset();
  };
  useEffect(() => {
    setValue("id", artId);
  }, [artId, setValue]);
  const artRegister = async (
    authorId: string,
    artName: string,
    artId: string,
    artImg: FileList
  ) => {
    await setDoc(doc(db, "arts", artId), {
      name: artName,
      author: authorId,
    });
    console.log(artId, authorId);
    await updateDoc(doc(db, "authors", authorId), {
      arts: arrayUnion(artId),
    });
    const fileType = artImg[0].name.split(".").slice(-1)[0];
    const storageRef = ref(storage, `arts/${artId}/img.${fileType}`);
    uploadBytes(storageRef, artImg[0]).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };
  const watchedImage = watch("image");
  const fileName = watchedImage && watchedImage[0] ? watchedImage[0].name : "";
  return (
    <>
      <h3>作品登録</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          {/* <TextField
            id="standard-basic"
            label="作者ID"
            variant="standard"
            {...register("a_id", { required: true })}
          /> */}
          <Controller
            control={control}
            name="a_id"
            render={({ field }) => (
              <Autocomplete
                fullWidth
                options={authors}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  field.onChange(newValue?.id);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="作者名" variant="standard" />
                )}
              />
            )}
            rules={{ required: true }}
          />
          <TextField
            label="作品名"
            variant="standard"
            {...register("name", { required: true })}
          />
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="baseline"
            spacing={2}
          >
            <TextField
              label="作品ID"
              variant="standard"
              value={artId}
              InputProps={{
                readOnly: true,
              }}
              {...register("id", {
                required: true,
              })}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => RandomId(6)}
            >
              ID生成
            </Button>
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="baseline"
            spacing={2}
          >
            <Button
              component="label"
              variant="outlined"
              startIcon={<MdCloudUpload />}
            >
              画像選択
              <input
                type="file"
                style={{ display: "none" }}
                accept=".png, .jpeg, .jpg"
                {...register("image", { required: true })}
              />
            </Button>
            <p>{fileName}</p>
          </Stack>
          <Button variant="contained" color="primary" type="submit">
            作品
          </Button>
        </Stack>
      </form>
    </>
  );
};
