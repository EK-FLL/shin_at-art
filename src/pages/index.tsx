import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { Rnd } from "react-rnd";

const Home = () => {
  return (
    <>
      <h1>Home Next.js</h1>
      <Rnd
        className="none"
        default={{
          x: 0,
          y: 0,
          width: 320,
          height: 200,
        }}
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        style={{
          border: "solid 2px #ddd",
          background: "#f0f0f0",
        }}
      ></Rnd>
    </>
  );
};
export default Home;
