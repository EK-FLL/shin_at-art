import { ThemeProvider } from "@mui/material";
import theme from "@/app/_globals/Var";
import Form from "./Form";

const Home = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <h2>管理者</h2>
        <Form></Form>
      </ThemeProvider>
    </>
  );
};
export default Home;
