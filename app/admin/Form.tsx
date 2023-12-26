"use client";
import { auth, db } from "@/app/_globals/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { randomBytes } from "crypto";
import { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
type Author = {
  name: string;
  id: string;
};
type Art = {
  a_id: string;
  name: string;
  id: string;
};

const Form = () => {
  return (
    <>
      <p>{auth.currentUser?.uid || "test"}</p>
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
  const authorRegister = async (authorName: string, authorId: string) => {
    await setDoc(doc(db, "authors", authorId), {
      name: authorName,
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
const Art = () => {
  const [id, setId] = useState<string>();
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
    setId(randomString);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Art>();
  const onSubmit: SubmitHandler<Art> = (data) => {
    artRegister(data.a_id, data.name, data.id);
    reset();
  };
  const artRegister = async (
    authorId: string,
    artName: string,
    artId: string
  ) => {
    await setDoc(doc(db, "authors", authorId), {
      name: "test",
    });
  };
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
          {/* <FormControl variant="standard" sx={{ minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">作者名</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="作者名"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl> */}

          <TextField
            id="standard-basic"
            label="作者ID"
            variant="standard"
            {...register("name", { required: true })}
          />
          <TextField
            id="standard-basic"
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
              id="standard-basic"
              label="作品ID"
              variant="standard"
              defaultValue="RandomID"
              value={id}
              {...register("id", { required: true, minLength: 6 })}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                RandomId(6);
              }}
            >
              ID生成
            </Button>
          </Stack>
          <Button
            component="label"
            variant="outlined"
            startIcon={<MdCloudUpload />}
          >
            画像選択
            <input type="file" style={{ display: "none" }} />
          </Button>
          <Button variant="contained" color="primary" type="submit">
            作品
          </Button>
        </Stack>
      </form>
    </>
  );
};
