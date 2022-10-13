/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import {
  EllipsisHorizontalIcon,
  TrashIcon,
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as LikedHeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Moment from "react-moment";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { signIn, useSession } from "next-auth/react";
import { db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";

const CommentPage = ({ comment, commentId, originalPostId }) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [postId, setPostId] = useRecoilState(postIdState);

  useEffect(() => {
    onSnapshot(
      collection(db, "posts", postId, "comments", commentId, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
  }, [db, originalPostId, commentId]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes]);

  async function deleteComment() {
    deleteDoc(doc(db, "posts", originalPostId, "comments", commentId));
  }
  return (
    <div className="flex p-4 space-x-4 shadow-sm pb-6 mb-4 border-b border-b-gray-200 pl-16">
      <div>
        <Image
          src={comment?.userImg}
          width={40}
          height={40}
          alt="User Image"
          className="rounded-full cursor-pointer hover:scale-110 transition-all ease-in-out"
        />
      </div>
      <div className="flex flex-col space-y-2 ">
        <div className="space-y-2 mb-2">
          <div className="flex items-center justify-between">
            <div className="whitespace-nowrap">
              <span className="cursor-pointer font-semibold hover:underline">
                {comment?.name}
              </span>
              <span className="text-xs ml-1 text-gray-400">
                @
                {comment?.email.length > 12
                  ? `${comment?.email.slice(0, 12)}...`
                  : comment?.email}
              </span>
              <span className="text-sm ml-1 text-gray-400">
                <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
              </span>
            </div>
            <EllipsisHorizontalIcon className="icon" />
          </div>
          <p>{comment?.comment}</p>
        </div>
        <div className="flex justify-around">
          {session?.user.uid === comment?.id && (
            <TrashIcon
              onClick={deleteComment}
              className="icon hover:text-red-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentPage;
