import Head from "next/head";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import CommentModal from "../components/CommentModal";

const Home = ({ news }) => {
  return (
    <div>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <title>Twitter Clone</title>
      </Head>
      <main className="flex max-w-7xl mx-auto min-h-screen ">
        <Sidebar />
        <Feed />
        <Widgets articles={news.articles} />
        <CommentModal />
      </main>
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  const news = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json"
  ).then((res) => res.json());

  return {
    props: {
      news,
    },
  };
}
