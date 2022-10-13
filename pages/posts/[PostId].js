import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import Widgets from "../../components/Widgets";
import CommentModal from "../../components/CommentModal";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Post from "../../components/Post";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import CommentPage from "../../components/CommentPage";

const PostPage = ({ news }) => {
  const router = useRouter();
  const id = router.query.PostId;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    onSnapshot(doc(db, "posts", id), (snapshot) => {
      setPost(snapshot);
    });
  }, [db, id]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, id]);
  return (
    <div>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <title>Twitter Clone</title>
      </Head>
      <main className="flex max-w-7xl mx-auto min-h-screen ">
        <Sidebar />
        <div className="xl:ml-64  border-l border-r lg:max-w-[42rem] sm:ml-24 flex-grow border-gray-200">
          <div className="flex justify-between p-4 border-b-2 z-50 shadow-sm sticky top-0 bg-white items-center">
            <Link href="/">
              <div className="font-semibold flex items-center space-x-3 text-lg lg:text-xl cursor-pointer">
                <ArrowLeftIcon className="icon" />
                Home
              </div>
            </Link>
          </div>
          <Post id={id} post={post} />
          <div>
            {comments.length > 0 &&
              comments.map((comment) => (
                <CommentPage
                  key={comment.id}
                  commentId={comment.id}
                  originalPostId={id}
                  comment={comment.data()}
                />
              ))}
          </div>
        </div>
        <Widgets articles={news.articles} />
        <CommentModal />
      </main>
    </div>
  );
};

export default PostPage;

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