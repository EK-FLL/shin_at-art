import { useRouter } from "next/router";
const Artwork = () => {
  const router = useRouter();
  console.log(router.query);
  return <h1>{router.query.name}About Next.js </h1>;
};
export default Artwork;
