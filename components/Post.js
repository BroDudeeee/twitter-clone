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
import { useRouter } from "next/router";

const Post = ({ post, id }) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [opened, setOpened] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const router = useRouter();

  const likePost = async () => {
    if (session) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", session?.user.uid), {
          email: session.user.email,
        });
      }
    } else {
      signIn();
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "comments"), (snapshot) => {
      setComments(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes]);

  async function deletePost() {
    router.push("/");
    deleteDoc(doc(db, "posts", id));
    {
      post.data().image && deleteObject(ref(storage, `posts/${id}/image`));
    }
  }
  return (
    <div className="flex p-4 space-x-4 shadow-sm pb-6 mb-4 border-b border-b-gray-200">
      <div>
        <Image
          src={post?.data()?.userImg}
          width={50}
          height={50}
          alt="User Image"
          className="rounded-full cursor-pointer hover:scale-110 transition-all ease-in-out"
        />
      </div>
      <div className="flex flex-col space-y-2 ">
        <div className="space-y-2 mb-2">
          <div className="flex items-center justify-between">
            <div className="whitespace-nowrap">
              <span className="cursor-pointer font-semibold hover:underline">
                {post?.data()?.name}
              </span>
              <span className="text-xs ml-1 text-gray-400">
                @
                {post?.data()?.email.length > 12
                  ? `${post?.data()?.email.slice(0, 12)}...`
                  : post?.data()?.email}
              </span>
              <span className="text-sm ml-1 text-gray-400">
                <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
              </span>
            </div>
            <EllipsisHorizontalIcon
              className="icon"
              onClick={() => router.push(`/posts/${id}`)}
            />
          </div>
          <p
            onClick={() => router.push(`/posts/${id}`)}
            className="cursor-pointer"
          >
            {post?.data()?.text}
          </p>
        </div>
        {post?.data()?.image && (
          <img
            src={post?.data()?.image}
            className="flex justify-center items-center rounded-lg cursor-pointer flex-grow w-[30rem] h-80"
            onClick={() => router.push(`/posts/${id}`)}
          />
        )}

        <div className="flex justify-around">
          <div className="flex items-center">
            {hasLiked ? (
              <LikedHeartIcon
                className="icon text-red-700"
                onClick={likePost}
              />
            ) : (
              <HeartIcon
                className="icon hover:text-red-700"
                onClick={likePost}
              />
            )}
            {likes.length > 0 && (
              <span className="text-red-700">{likes.length}</span>
            )}
          </div>
          <div className="flex items-center">
            <ChatBubbleOvalLeftEllipsisIcon
              className={`icon ${comments.length > 0 && "text-blue-500"}`}
              onClick={() => {
                session ? (setPostId(id), setOpened(!opened)) : signIn();
              }}
            />
            {comments.length > 0 && (
              <span className="text-blue-500">{comments.length}</span>
            )}
          </div>

          {session?.user.uid === post?.data()?.id && (
            <TrashIcon
              onClick={deletePost}
              className="icon hover:text-red-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
