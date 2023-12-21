"use client";
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

const Form = () => {
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
  const authorRegister = () => {};
  return (
    <>
      <h3>作者登録</h3>

      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        <TextField id="standard-basic" label="作者名" variant="standard" />
        <TextField id="standard-basic" label="作者ID" variant="standard" />
        <Button variant="contained" color="primary">
          作者
        </Button>
      </Stack>
      <h3>作品登録</h3>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        <FormControl variant="standard" sx={{ minWidth: 200 }}>
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
        </FormControl>
        <TextField id="standard-basic" label="作品名" variant="standard" />
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
        <Button variant="contained" color="primary">
          作品
        </Button>
      </Stack>
    </>
  );
};
export default Form;
