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
import { useUploadImage } from "../Helpers/hooks";

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
  const [isEditorLoaded, setIsEditorLoaded] = useState(false)
  const [image, setimage] = useState("")
  const { user } = useSelector((state: userState) => state.user);
  const {uploadImageToStorage} = useUploadImage()

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
 
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent().replace(/<\/?[^>]+(>|$)/g, ""));
      let Img = editorRef.current.dom.select('img')
      const UniqueId = generateUniqueId();

      const createPost = async () => {
          try {
           
            await updateDoc(doc(db, 'users', user.userRef), {
              post: arrayUnion({
                title: title,
                body: editorRef.current.getContent().replace(/<\/?[^>]+(>|$)/g, ""),
                createdAt: new Date(),
                bookmark: false,
                bookmarks:[],
                id: UniqueId,
                likedBy: [],
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
            if(image){
              const {upload} = await uploadImageToStorage({image, UniqueId})
            }
            await addDoc(collection(db, 'posts'),{
              title,
              body: editorRef.current.getContent().replace(/<\/?[^>]+(>|$)/g, ""),
              createdAt: new Date(),
              bookmark: false,
              bookmarks:[],
              postedById: UniqueId,
              id: generateUniqueId(),
              likedBy: [],
              likes: 0,
              comment:[],
              views: 0,
              image: Img.length > 0 ? true: false ,
              name: user.fullName,
              userId: user.userRef,
            })
          }catch (error) {
            console.log("error creating post db")
          }
        }
      createPost();
      setTitle('');
      editorRef.current.setContent('');
    }
  };
  const editorInit = (ext, editor) => {
    setIsEditorLoaded(true);
    editorRef.current = editor;
  }
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
      { isEditorLoaded && <input
          type="text"
          name=""
          id=""
          value={title}
          onChange={handleChange}
          placeholder="Title"
        />}
      </div>
      <Editor
        apiKey={apiKey}
        onInit={editorInit}
        initialValue=""
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
            "undo redo | blocks | link image | code |" +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: function (cb, value, meta) {
              var input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
          
              /*
                Note: In modern browsers input[type="file"] is functional without
                even adding it to the DOM, but that might not be the case in some older
                or quirky browsers like IE, so you might want to add it to the DOM
                just in case, and visually hide it. And do not forget do remove it
                once you do not need it anymore.
              */
          
              input.onchange = function () {
                var file = input.files[0];
                setimage(file);
                var reader = new FileReader();
                reader.onload = function () {
                 var dataURL = reader.result;
      
                // Pass the Data URL to TinyMCE
                cb(dataURL);

      // Optionally, you can save the file data for later use
    };
    reader.readAsDataURL(file);
              };
          
              input.click();
              setimage('')
            },
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      {/* <button onClick={log}>Log editor content</button> */}
      <div className="post_button">
       {isEditorLoaded && <button onClick={log}>post</button>}
      </div>
    </>
  );
}
