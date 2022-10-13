/* eslint-disable @next/next/no-img-element */
import { FaceSmileIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Input = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const filePickerRef = useRef(null);

  const sendPost = async () => {
    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      text: input,
      name: session.user.name,
      email: session.user.email,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }
    setInput("");
    setSelectedFile(null);
  };

  const addMainImage = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <div>
      {session && (
        <div className="flex space-x-3 p-3 border-b border-b-gray-200">
          <div>
            <Image
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
              placeholder="What is Happening?"
              className="resize-none border-gray-200 border-b p-2 outline-none placeholder:text-xl tracking-wide min-h-30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
            {selectedFile && (
              <div
                className="h-10 w-10 relative cursor-pointer hover:scale-110 transition-all ease-in-out"
                onClick={() => setSelectedFile(null)}
              >
                <XMarkIcon className="h-3 z-40 absolute text-red-700 font-bold" />
                <img src={selectedFile} alt="image" className="animate-pulse" />
              </div>
            )}
            <div className="flex justify-between px-4 items-center mt-2">
              <div className="flex items-center space-x-4 text-sky-400">
                <div onClick={() => filePickerRef.current.click()}>
                  <PhotoIcon className="h-6 cursor-pointer hover:scale-105 transition-all ease-in-out hover:text-sky-500" />
                  <input
                    type="file"
                    hidden
                    ref={filePickerRef}
                    onChange={addMainImage}
                  />
                </div>
              </div>
              <button
                disabled={!input.trim()}
                onClick={sendPost}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full text-white disabled:opacity-50 cursor-pointer"
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Input;
