import { ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import Input from "./Input";
import Post from "./Post";
import { AnimatePresence, motion } from "framer-motion";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    []
  );
  return (
    <div className="xl:ml-64  border-l border-r lg:max-w-[42rem] sm:ml-24 flex-grow border-gray-200">
      <div className="flex justify-between p-4 border-b-2 z-50 shadow-sm sticky top-0 bg-white items-center">
        <Link href="/">
          <h2 className="font-semibold text-lg lg:text-xl cursor-pointer">
            Home
          </h2>
        </Link>
        <ViewfinderCircleIcon className="h-6" />
      </div>
      <Input />
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0 }}
          >
            <Post post={post} id={post.id} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Feed;
