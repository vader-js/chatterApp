// import React from 'react'
import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./feed.css";
import { Back } from "iconsax-react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { setUserRef } from "../../app/authSlice";

export default function NewFeed({ setNewPost }: any) {
  type User = {
    user: {
      fullName: string,
      email: string,
      titles?: string
      displayPicture?: string,
      token?: string,
      uid: string,
      userRef: string,
    }
  }
  type userState = {
    user: User
  }
  const apiKey = import.meta.env.VITE_TINY_KEY;
  const dispatch = useDispatch();
  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState("");
  const [docId, setDocId] = useState("")
  const { user } = useSelector((state: userState) => state.user);
  console.log({ user });
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      function generateUniqueId() {
        // Generate a timestamp
        const timestamp = new Date().getTime();
      
        // Generate a random number (between 0 and 1, inclusive)
        const random = Math.random();
      
        // Convert the random number to a string and remove the decimal point
        const randomString = random.toString().slice(2);
      
        // Combine the timestamp and random number to create a unique ID
        const uniqueId = `${timestamp}${randomString}`;
      
        return uniqueId;
      };
      const UniqueId = generateUniqueId();
      const createPost = async () => {
          try {
            await updateDoc(doc(db, 'users', user.userRef), {
              post: arrayUnion({
                title: "First post 11",
                body: editorRef.current.getContent(),
                createdAt: new Date(),
                bookmark: false,
                bookmarks:[],
                id: UniqueId,
                like: false,
                likes: 0,
                comment:[],
                views: 0,
                name: user.fullName
              }),
            });
            console.log('Post added successfully');
          } catch (error) {
            console.error('Error adding post:', error);
          }
          try {
            await addDoc(collection(db, 'posts'),{
              title: 'first post database',
              body: editorRef.current.getContent(),
              createdAt: new Date(),
              bookmark: false,
              bookmarks:[],
              postedById: UniqueId,
              id: generateUniqueId(),
              likedBy: [],
              likes: 0,
              isComment: false,
              comment:[],
              views: 0,
              name: user.fullName
            })
          }catch (error) {
            console.log("error creating post db")
          }
        }
      createPost();
    }
  };
  useEffect(()=>{
    const usersCollectionRef = collection(db, "users");
          const querry = query(
            usersCollectionRef,
            where("email", "==", `${user.email}`)
          );
          getDocs(querry)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log("Document ID:", doc.id);
                setDocId(doc.id);
                dispatch(setUserRef(doc.id));
              });
            })
            .catch((error) => {
              console.error("Error getting documents:", error);
            });
  },[])
  useEffect(()=>{
    console.log({docId});
  },[docId])
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  return (
    <>
      <h3 className="back" onClick={() => setNewPost(false)}>
        {" "}
        <span>
          <Back size="25" />
        </span>{" "}
        Back
      </h3>

      <div className="title_input">
        <input
          type="text"
          name=""
          id=""
          value={title}
          onChange={handleChange}
          placeholder="Title"
        />
      </div>
      <Editor
        apiKey={apiKey}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="write a post..."
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      {/* <button onClick={log}>Log editor content</button> */}
      <div className="post_button">
        <button onClick={log}>post</button>
      </div>
    </>
  );
}
