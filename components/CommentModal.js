/* eslint-disable @next/next/no-img-element */
import { modalState, postIdState } from "../atom/modalAtom";
import { useRecoilState } from "recoil";
import Modal from "react-modal";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import Moment from "react-moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const CommentModal = () => {
  const [opened, setOpened] = useRecoilState(modalState);
  const [postId] = useRecoilState(postIdState);
  const [post, setPost] = useState({});
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const router = useRouter();

  const sendComment = async () => {
    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: input,
      name: session.user.name,
      email: session.user.email,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    setOpened(false);
    setInput("");
    router.push(`/posts/${postId}`);
  };

  useEffect(() => {
    onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot);
    });
  }, [postId, db]);

  return (
    <div>
      {opened && (
        <Modal
          isOpen={opened}
          onRequestClose={() => setOpened(!opened)}
          className="absolute max-w-lg top-[20%] left-[50%] translate-x-[-50%] w-[90%]  outline-gray-200 shadow-md border border-gray-200 bg-white rounded-xl p-1"
        >
          <div>
            <div className="p-2 border-b border-b-gray-200">
              <XMarkIcon onClick={() => setOpened(false)} className="icon" />
            </div>
            <div className="flex items-center space-x-4 space-y-4 pl-2">
              <img
                src={post?.data()?.userImg}
                width={40}
                height={40}
                alt="User Image"
                className="rounded-full cursor-pointer hover:scale-110 transition-all ease-in-out"
              />
              <div>
                <div className="space-x-2">
                  <span className="text-sm">{post?.data()?.name}</span>
                  <span className="text-xs text-gray-500">
                    @
                    {post?.data()?.email.length > 12
                      ? `${post?.data()?.email.slice(0, 12)}...`
                      : post?.data()?.email}
                  </span>
                  <span className="text-xs text-gray-500">
                    <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{post?.data()?.text}</p>
                </div>
              </div>
            </div>
            <>
              <div className="flex space-x-3 p-3 border-b border-b-gray-200">
                <div>
                  <img
                    src={session.user.image}
                    width={40}
                    height={40}
                    alt="Me"
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <textarea
                    rows="4"
                    placeholder="Tweet your Comment"
                    className="resize-none border-gray-200 border-b p-2 outline-none placeholder:text-xl tracking-wide min-h-30"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  ></textarea>

                  <div className="flex justify-between px-4 items-center mt-2">
                    <div className="flex items-center space-x-4 text-sky-400"></div>
                    <button
                      disabled={!input.trim()}
                      onClick={sendComment}
                      className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full text-white disabled:opacity-50 cursor-pointer"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CommentModal;
